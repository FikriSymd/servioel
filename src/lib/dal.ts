import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { bacaSesi, type SesiAktif } from "./auth";
import { isPeran, type Peran } from "./peran";

export { PERAN, isPeran, labelPeran } from "./peran";
export type { Peran } from "./peran";

/**
 * Dibungkus `cache` supaya dalam satu render hanya sekali menyentuh database,
 * walau dipanggil dari beberapa komponen.
 */
export const sesiSekarang = cache(async (): Promise<SesiAktif | null> => {
  return bacaSesi();
});

/**
 * Untuk halaman. Kalau tidak ada sesi, langsung dialihkan ke halaman masuk.
 * Semua data yang ditampilkan halaman ini nanti disaring memakai toko dari sini,
 * bukan dari alamat atau parameter yang bisa dikirim klien.
 */
export async function wajibMasuk(): Promise<SesiAktif> {
  const sesi = await sesiSekarang();
  if (!sesi) redirect("/masuk");
  return sesi;
}

/**
 * Untuk halaman yang hanya boleh dibuka peran tertentu. Pengguna yang tidak
 * berwenang dikembalikan ke papan, bukan dibuang keluar aplikasi.
 */
export async function wajibPeran(peran: readonly Peran[]): Promise<SesiAktif> {
  const sesi = await wajibMasuk();
  if (!isPeran(sesi.user.peran) || !peran.includes(sesi.user.peran)) {
    redirect("/app?ditolak=peran");
  }
  return sesi;
}

/**
 * Untuk Server Action. Tidak mengalihkan halaman, tapi mengembalikan null
 * supaya aksinya sendiri yang memutuskan berhenti dengan pesan galat.
 */
export async function sesiUntukAksi(): Promise<SesiAktif | null> {
  return bacaSesi();
}
