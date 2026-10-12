import "server-only";
import { db } from "./db";
import { cocokKataSandi, hashKataSandi, periksaKekuatanSandi } from "./password";
import { isPeran, type Peran } from "./peran";

export type Hasil<T = undefined> =
  | ({ ok: true; pesan: string } & (T extends undefined ? object : { data: T }))
  | { ok: false; pesan: string };

const EMAIL_SEDERHANA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rapikanEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Toko baru mendaftar: satu toko dan satu pemilik dibuat sekaligus, dalam satu
 * transaksi. Kalau salah satu gagal, tidak ada toko setengah jadi yang tertinggal.
 */
export async function daftarToko(input: {
  namaToko: string;
  namaPemilik: string;
  email: string;
  kataSandi: string;
}): Promise<Hasil<{ userId: string }>> {
  const namaToko = input.namaToko.trim();
  const namaPemilik = input.namaPemilik.trim();
  const email = rapikanEmail(input.email);

  if (!namaToko) return { ok: false, pesan: "Nama toko belum diisi." };
  if (!namaPemilik) return { ok: false, pesan: "Nama Anda belum diisi." };
  if (!EMAIL_SEDERHANA.test(email)) return { ok: false, pesan: "Alamat email belum benar." };

  const lemah = periksaKekuatanSandi(input.kataSandi);
  if (lemah) return { ok: false, pesan: lemah };

  const sudahAda = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (sudahAda) return { ok: false, pesan: "Email ini sudah terdaftar." };

  const kataSandi = await hashKataSandi(input.kataSandi);

  const user = await db.$transaction(async (tx) => {
    const toko = await tx.toko.create({ data: { nama: namaToko }, select: { id: true } });
    return tx.user.create({
      data: {
        tokoId: toko.id,
        email,
        nama: namaPemilik,
        kataSandi,
        peran: "owner",
      },
      select: { id: true },
    });
  });

  return { ok: true, pesan: `Toko ${namaToko} dibuat.`, data: { userId: user.id } };
}

/**
 * Pemilik toko membuat akun untuk stafnya dari dalam aplikasi.
 * Staf tidak bisa mendaftar sendiri, jadi tiap akun selalu terikat ke satu toko
 * dan dibuat oleh orang yang sudah bertanggung jawab di toko itu.
 */
export async function tambahStaf(
  tokoId: string,
  input: { nama: string; email: string; peran: string; kataSandi: string },
): Promise<Hasil<{ userId: string }>> {
  const nama = input.nama.trim();
  const email = rapikanEmail(input.email);

  if (!nama) return { ok: false, pesan: "Nama staf belum diisi." };
  if (!EMAIL_SEDERHANA.test(email)) return { ok: false, pesan: "Alamat email belum benar." };
  if (!isPeran(input.peran) || input.peran === "owner") {
    return { ok: false, pesan: "Peran harus Teknisi atau Kasir." };
  }

  const lemah = periksaKekuatanSandi(input.kataSandi);
  if (lemah) return { ok: false, pesan: lemah };

  const sudahAda = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (sudahAda) return { ok: false, pesan: "Email ini sudah terdaftar." };

  const kataSandi = await hashKataSandi(input.kataSandi);
  const user = await db.user.create({
    data: { tokoId, email, nama, kataSandi, peran: input.peran },
    select: { id: true },
  });

  return { ok: true, pesan: `Akun ${nama} dibuat.`, data: { userId: user.id } };
}

export type StafRingkas = {
  id: string;
  nama: string;
  email: string;
  peran: string;
  aktif: boolean;
  dibuatPada: string;
};

/** Daftar staf satu toko. Penyaring tokoId lagi-lagi dari sesi, bukan dari klien. */
export async function daftarStaf(tokoId: string): Promise<StafRingkas[]> {
  const baris = await db.user.findMany({
    where: { tokoId },
    orderBy: [{ peran: "asc" }, { nama: "asc" }],
    select: {
      id: true,
      nama: true,
      email: true,
      peran: true,
      aktif: true,
      dibuatPada: true,
    },
  });
  return baris.map((b) => ({ ...b, dibuatPada: b.dibuatPada.toISOString() }));
}

/**
 * Menyalakan atau mematikan akun staf. Sesi yang sedang berjalan ikut dicabut
 * saat akun dimatikan, jadi orangnya benar-benar langsung tidak bisa masuk.
 */
export async function ubahAktifStaf(
  tokoId: string,
  stafId: string,
  aktif: boolean,
): Promise<Hasil> {
  const staf = await db.user.findFirst({
    where: { id: stafId, tokoId },
    select: { id: true, peran: true, nama: true },
  });
  if (!staf) return { ok: false, pesan: "Staf tidak ditemukan di toko ini." };
  if (staf.peran === "owner") {
    return { ok: false, pesan: "Akun pemilik tidak bisa dimatikan." };
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: staf.id }, data: { aktif } });
    if (!aktif) await tx.sesi.deleteMany({ where: { userId: staf.id } });
  });

  return { ok: true, pesan: `Akun ${staf.nama} ${aktif ? "dinyalakan" : "dimatikan"}.` };
}

/** Mengganti kata sandi staf oleh pemilik toko. */
export async function setelUlangKataSandi(
  tokoId: string,
  stafId: string,
  kataSandiBaru: string,
): Promise<Hasil> {
  const lemah = periksaKekuatanSandi(kataSandiBaru);
  if (lemah) return { ok: false, pesan: lemah };

  const staf = await db.user.findFirst({
    where: { id: stafId, tokoId },
    select: { id: true, nama: true },
  });
  if (!staf) return { ok: false, pesan: "Staf tidak ditemukan di toko ini." };

  const kataSandi = await hashKataSandi(kataSandiBaru);
  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: staf.id }, data: { kataSandi } });
    await tx.sesi.deleteMany({ where: { userId: staf.id } });
  });

  return { ok: true, pesan: `Kata sandi ${staf.nama} diganti. Sesi lamanya dicabut.` };
}

/** Dipakai halaman masuk. Mencocokkan email dan kata sandi. */
export async function masukDenganKataSandi(
  email: string,
  kataSandi: string,
): Promise<Hasil<{ userId: string }>> {
  const bersih = rapikanEmail(email);
  const user = await db.user.findUnique({
    where: { email: bersih },
    select: { id: true, kataSandi: true, aktif: true },
  });

  // Pesan galatnya sengaja sama untuk email yang tidak ada dan kata sandi yang
  // salah, supaya tidak bisa dipakai menebak email mana yang terdaftar.
  const pesanGagal = "Email atau kata sandi tidak cocok.";
  if (!user) return { ok: false, pesan: pesanGagal };
  if (!user.aktif) return { ok: false, pesan: "Akun ini dimatikan oleh pemilik toko." };

  const cocok = await cocokKataSandi(kataSandi, user.kataSandi);
  if (!cocok) return { ok: false, pesan: pesanGagal };

  return { ok: true, pesan: "Masuk berhasil.", data: { userId: user.id } };
}

/** Membaca toko dari id. Dipakai untuk menampilkan nama toko di kepala halaman. */
export async function ambilToko(tokoId: string) {
  return db.toko.findUnique({
    where: { id: tokoId },
    select: { id: true, nama: true, dibuatPada: true },
  });
}
