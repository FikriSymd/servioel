import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { STAGES } from "./stages";
import type { NotaPublik, ServiceOrder, StageId } from "./types";

/** Unit di Sudah Diambil disimpan di papan selama ini, lalu diarsipkan. */
export const AMBANG_ARSIP_HARI = 30;

/**
 * Token untuk tautan nota pelanggan. 16 byte acak, ditulis sebagai 32 huruf
 * heksadesimal.
 *
 * Dibuat dari sumber acak, bukan dari id atau nomor servis: tautan ini boleh
 * dibuka tanpa masuk, jadi kalau bisa ditebak dari nomor nota, tautan satu
 * pelanggan bisa dipakai melihat nota pelanggan lain.
 */
export function tokenNotaBaru(): string {
  return randomBytes(16).toString("hex");
}

const POLA_TOKEN = /^[0-9a-f]{32}$/;

export function isStageId(nilai: unknown): nilai is StageId {
  return typeof nilai === "string" && STAGES.some((s) => s.id === nilai);
}

type BarisPesanan = {
  id: string;
  nomor: string;
  perangkat: string;
  pelanggan: string;
  telepon: string;
  keluhan: string;
  stage: string;
  masukTahapPada: Date;
  dibuatPada: Date;
  tokenPublik: string;
  diubahPada: Date | null;
  diubahOleh: { nama: string } | null;
  riwayat: { id: string; pada: Date; dari: string | null; ke: string; oleh: { nama: string } }[];
};

/** Kolom yang dibaca untuk satu nota, dipakai daftar papan dan satu nota. */
const KOLOM_NOTA = {
  id: true,
  nomor: true,
  perangkat: true,
  pelanggan: true,
  telepon: true,
  keluhan: true,
  stage: true,
  masukTahapPada: true,
  dibuatPada: true,
  tokenPublik: true,
  diubahPada: true,
  diubahOleh: { select: { nama: true } },
  riwayat: {
    orderBy: { pada: "asc" },
    select: {
      id: true,
      pada: true,
      dari: true,
      ke: true,
      oleh: { select: { nama: true } },
    },
  },
} as const;

/**
 * Memetakan baris database ke bentuk yang dipakai tampilan. Baris yang tahapnya
 * tidak dikenal (misalnya tahap dihapus di versi berikutnya) dilewati, bukan
 * dipaksa tampil dan bikin papan rusak.
 */
function keTampilan(baris: BarisPesanan): ServiceOrder | null {
  if (!isStageId(baris.stage)) return null;
  const riwayat = baris.riwayat
    .filter((m) => isStageId(m.ke) && (m.dari === null || isStageId(m.dari)))
    .map((m) => ({
      id: m.id,
      pada: m.pada.toISOString(),
      dari: (m.dari as StageId | null) ?? null,
      ke: m.ke as StageId,
      oleh: m.oleh.nama,
    }));

  return {
    id: baris.id,
    nomor: baris.nomor,
    perangkat: baris.perangkat,
    pelanggan: baris.pelanggan,
    telepon: baris.telepon,
    keluhan: baris.keluhan,
    stage: baris.stage,
    masukTahapPada: baris.masukTahapPada.toISOString(),
    dibuatPada: baris.dibuatPada.toISOString(),
    token: baris.tokenPublik,
    diubahPada: baris.diubahPada?.toISOString() ?? null,
    diubahOleh: baris.diubahOleh?.nama ?? null,
    riwayat,
  };
}

/**
 * Daftar pesanan milik satu toko. `tokoId` wajib datang dari sesi, bukan dari
 * klien. Penyaring tokoId inilah yang memisahkan data antar toko.
 */
export async function daftarPesanan(tokoId: string): Promise<ServiceOrder[]> {
  const baris = await db.serviceOrder.findMany({
    where: { tokoId, diarsipPada: null },
    orderBy: { dibuatPada: "desc" },
    select: KOLOM_NOTA,
  });

  return baris.map(keTampilan).filter((o): o is ServiceOrder => o !== null);
}

/**
 * Satu nota milik satu toko, termasuk yang sudah diarsipkan.
 *
 * Dipakai halaman cetak: nota lama kadang perlu dicetak ulang, dan yang
 * diarsipkan bukan berarti hilang. Penyaring tokoId tetap ada, jadi nota toko
 * lain tidak bisa dibuka dari sini walau id-nya ditebak.
 */
export async function ambilPesanan(
  tokoId: string,
  pesananId: string,
): Promise<ServiceOrder | null> {
  const baris = await db.serviceOrder.findFirst({
    where: { id: pesananId, tokoId },
    select: KOLOM_NOTA,
  });
  return baris ? keTampilan(baris) : null;
}

/**
 * Nota lewat tautan pelanggan. Tidak butuh sesi, jadi yang dikembalikan sengaja
 * dipilih satu-satu: nomor, perangkat, nama, tahap, dan kapan terakhir berubah.
 *
 * Nomor HP, isi keluhan, dan riwayat lengkap tidak ikut. Tautan ini bisa
 * diteruskan ke siapa saja, dan yang perlu diketahui pelanggan cuma "barang saya
 * sudah sampai mana". Nama toko ikut supaya halaman itu tidak terasa anonim.
 */
export async function notaDariToken(token: string): Promise<NotaPublik | null> {
  if (!POLA_TOKEN.test(token)) return null;

  const baris = await db.serviceOrder.findUnique({
    where: { tokenPublik: token },
    select: {
      nomor: true,
      perangkat: true,
      pelanggan: true,
      stage: true,
      masukTahapPada: true,
      dibuatPada: true,
      diubahPada: true,
      toko: { select: { nama: true } },
    },
  });
  if (!baris) return null;
  if (!isStageId(baris.stage)) return null;

  const terakhir = [baris.masukTahapPada, baris.diubahPada]
    .filter((d): d is Date => d instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return {
    nomor: baris.nomor,
    perangkat: baris.perangkat,
    pelanggan: baris.pelanggan,
    stage: baris.stage,
    diperbaruiPada: terakhir.toISOString(),
    namaToko: baris.toko.nama,
  };
}

/**
 * Nomor servis berikutnya untuk satu toko pada satu tahun.
 *
 * Bukan dihitung dari jumlah baris: baris bisa dihapus, dan nomor yang sudah
 * dipakai tidak boleh muncul lagi. Yang dipakai baris penghitung yang dinaikkan
 * langsung di database dengan satu perintah, jadi dua permintaan yang datang
 * bersamaan tetap dapat nomor berbeda.
 */
async function nomorBerikut(
  tx: Parameters<Parameters<typeof db.$transaction>[0]>[0],
  tokoId: string,
  tahun: number,
): Promise<string> {
  const kunci = `${tokoId}:${tahun}`;
  const hasil = await tx.$queryRaw<{ nilai: number }[]>`
    INSERT INTO penghitung (kunci, nilai) VALUES (${kunci}, 1)
    ON CONFLICT (kunci) DO UPDATE SET nilai = penghitung.nilai + 1
    RETURNING nilai
  `;
  const nilai = hasil[0]?.nilai ?? 1;
  return `SV-${tahun}-${String(nilai).padStart(4, "0")}`;
}

export type HasilAksi =
  | { ok: true; pesan: string }
  | { ok: false; pesan: string };

export type DataNota = {
  perangkat: string;
  pelanggan: string;
  telepon: string;
  keluhan: string;
};

/** Memeriksa isi nota sebelum disimpan. Dipakai buat dan ubah. */
function bersihkan(data: DataNota): DataNota | string {
  const perangkat = data.perangkat.trim();
  const pelanggan = data.pelanggan.trim();
  const telepon = data.telepon.trim();
  const keluhan = data.keluhan.trim();

  if (!perangkat) return "Nama perangkat belum diisi.";
  if (!pelanggan) return "Nama pelanggan belum diisi.";
  if (!telepon) return "Nomor HP belum diisi.";
  if (!keluhan) return "Keluhan belum diisi.";

  return { perangkat, pelanggan, telepon, keluhan };
}

/** Menyimpan pesanan baru di tahap Barang Masuk, sekaligus mencatat riwayatnya. */
export async function buatPesanan(
  tokoId: string,
  olehId: string,
  data: DataNota,
): Promise<HasilAksi> {
  const bersih = bersihkan(data);
  if (typeof bersih === "string") return { ok: false, pesan: bersih };

  const tahun = new Date().getFullYear();

  const nomor = await db.$transaction(async (tx) => {
    const n = await nomorBerikut(tx, tokoId, tahun);
    const pesanan = await tx.serviceOrder.create({
      data: {
        tokoId,
        nomor: n,
        ...bersih,
        stage: "barang-masuk",
        tokenPublik: tokenNotaBaru(),
      },
      select: { id: true },
    });
    await tx.stageMove.create({
      data: {
        pesananId: pesanan.id,
        tokoId,
        dari: null,
        ke: "barang-masuk",
        olehId,
      },
    });
    return n;
  });

  return { ok: true, pesan: `Nota ${nomor} dibuat di tahap Barang Masuk.` };
}

/**
 * Membetulkan isi nota: perangkat, nama, nomor HP, keluhan.
 *
 * Tahap tidak diubah di sini. Perpindahan tahap punya jalurnya sendiri
 * (`pindahTahap`) supaya riwayatnya tetap bersih: satu catatan, satu perpindahan.
 *
 * `updateMany` dengan saringan id DAN tokoId dipakai supaya toko lain tidak bisa
 * mengubah nota yang bukan miliknya, walau id-nya ditebak benar. Nomor servis
 * juga tidak bisa diubah dari sini: nomornya sudah dipakai di nota yang mungkin
 * sudah dipegang pelanggan.
 */
export async function ubahPesanan(
  tokoId: string,
  olehId: string,
  pesananId: string,
  data: DataNota,
): Promise<HasilAksi> {
  const bersih = bersihkan(data);
  if (typeof bersih === "string") return { ok: false, pesan: bersih };

  const hasil = await db.serviceOrder.updateMany({
    where: { id: pesananId, tokoId, diarsipPada: null },
    data: { ...bersih, diubahPada: new Date(), diubahOlehId: olehId },
  });

  if (hasil.count === 0) {
    return { ok: false, pesan: "Nota tidak ditemukan di toko ini." };
  }

  const nota = await db.serviceOrder.findUnique({
    where: { id: pesananId },
    select: { nomor: true },
  });
  return { ok: true, pesan: `Nota ${nota?.nomor ?? ""} diperbarui.` };
}

/**
 * Memindahkan pesanan ke tahap lain.
 *
 * `updateMany` dengan saringan id DAN tokoId dipakai supaya toko lain tidak bisa
 * memindahkan pesanan yang bukan miliknya, walau id-nya ditebak benar.
 */
export async function pindahTahap(
  tokoId: string,
  olehId: string,
  pesananId: string,
  ke: StageId,
): Promise<HasilAksi> {
  if (!isStageId(ke)) return { ok: false, pesan: "Tahap tujuan tidak dikenal." };

  const pesanan = await db.serviceOrder.findFirst({
    where: { id: pesananId, tokoId, diarsipPada: null },
    select: { id: true, nomor: true, stage: true },
  });
  if (!pesanan) return { ok: false, pesan: "Nota tidak ditemukan di toko ini." };
  if (pesanan.stage === ke) return { ok: true, pesan: "Tahap tidak berubah." };
  if (!isStageId(pesanan.stage)) {
    return { ok: false, pesan: "Tahap nota sekarang tidak dikenal." };
  }

  const dari = pesanan.stage;
  await db.$transaction(async (tx) => {
    const ubah = await tx.serviceOrder.updateMany({
      where: { id: pesanan.id, tokoId, stage: dari },
      data: { stage: ke, masukTahapPada: new Date() },
    });
    // Kalau tidak ada baris yang berubah, ada permintaan lain yang lebih dulu
    // memindahkan nota ini. Riwayatnya tidak ditulis supaya tidak ada catatan palsu.
    if (ubah.count === 0) return;
    await tx.stageMove.create({
      data: { pesananId: pesanan.id, tokoId, dari, ke, olehId },
    });
  });

  const label = STAGES.find((s) => s.id === ke)?.label ?? ke;
  return { ok: true, pesan: `${pesanan.nomor} dipindahkan ke tahap ${label}.` };
}

/**
 * Mengarsipkan pesanan yang sudah lama di tahap Sudah Diambil. Hanya pemilik
 * toko yang menjalankannya. Yang diarsipkan tidak dihapus, cuma disembunyikan
 * dari papan.
 */
export async function arsipkanPesananLama(tokoId: string): Promise<HasilAksi> {
  const batas = new Date(Date.now() - AMBANG_ARSIP_HARI * 86_400_000);
  const hasil = await db.serviceOrder.updateMany({
    where: {
      tokoId,
      stage: "sudah-diambil",
      diarsipPada: null,
      masukTahapPada: { lt: batas },
    },
    data: { diarsipPada: new Date() },
  });

  if (hasil.count === 0) {
    return {
      ok: true,
      pesan: `Tidak ada unit di Sudah Diambil yang sudah lewat ${AMBANG_ARSIP_HARI} hari.`,
    };
  }
  return {
    ok: true,
    pesan: `${hasil.count} unit diarsipkan dari papan (masih tersimpan, tidak dihapus).`,
  };
}
