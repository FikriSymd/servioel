import "server-only";
import { db } from "./db";
import { STAGES } from "./stages";
import type { ServiceOrder, StageId } from "./types";

/** Unit di Sudah Diambil disimpan di papan selama ini, lalu diarsipkan. */
export const AMBANG_ARSIP_HARI = 30;

export function isStageId(nilai: unknown): nilai is StageId {
  return typeof nilai === "string" && STAGES.some((s) => s.id === nilai);
}

type BarisPesanan = {
  id: string;
  nomor: string;
  pelanggan: string;
  telepon: string;
  keluhan: string;
  stage: string;
  masukTahapPada: Date;
  dibuatPada: Date;
  riwayat: { id: string; pada: Date; dari: string | null; ke: string; oleh: { nama: string } }[];
};

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
    pelanggan: baris.pelanggan,
    telepon: baris.telepon,
    keluhan: baris.keluhan,
    stage: baris.stage,
    masukTahapPada: baris.masukTahapPada.toISOString(),
    dibuatPada: baris.dibuatPada.toISOString(),
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
    select: {
      id: true,
      nomor: true,
      pelanggan: true,
      telepon: true,
      keluhan: true,
      stage: true,
      masukTahapPada: true,
      dibuatPada: true,
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
    },
  });

  return baris.map(keTampilan).filter((o): o is ServiceOrder => o !== null);
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

/** Menyimpan pesanan baru di tahap Barang Masuk, sekaligus mencatat riwayatnya. */
export async function buatPesanan(
  tokoId: string,
  olehId: string,
  data: { pelanggan: string; telepon: string; keluhan: string },
): Promise<HasilAksi> {
  const pelanggan = data.pelanggan.trim();
  const telepon = data.telepon.trim();
  const keluhan = data.keluhan.trim();

  if (!pelanggan) return { ok: false, pesan: "Nama pelanggan belum diisi." };
  if (!telepon) return { ok: false, pesan: "Nomor HP belum diisi." };
  if (!keluhan) return { ok: false, pesan: "Keluhan belum diisi." };

  const tahun = new Date().getFullYear();

  const nomor = await db.$transaction(async (tx) => {
    const n = await nomorBerikut(tx, tokoId, tahun);
    const pesanan = await tx.serviceOrder.create({
      data: {
        tokoId,
        nomor: n,
        pelanggan,
        telepon,
        keluhan,
        stage: "barang-masuk",
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
