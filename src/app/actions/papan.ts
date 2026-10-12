"use server";

import { revalidatePath } from "next/cache";
import { sesiUntukAksi } from "@/lib/dal";
import {
  arsipkanPesananLama,
  buatPesanan,
  daftarPesanan,
  isStageId,
  pindahTahap,
} from "@/lib/orders";
import type { ServiceOrder, StageId } from "@/lib/types";

/**
 * Aksi papan selalu mengembalikan daftar pesanan terbaru milik toko yang sedang
 * masuk. Klien tidak pernah mengirim daftarnya, jadi tidak ada jalan untuk
 * menampilkan data toko lain dari sisi tampilan.
 */
export type HasilPapan = {
  ok: boolean;
  pesan: string;
  orders: ServiceOrder[];
};

const TIDAK_MASUK: HasilPapan = {
  ok: false,
  pesan: "Sesi Anda sudah berakhir. Masuk ulang untuk melanjutkan.",
  orders: [],
};

export async function aksiBuatPesanan(data: {
  perangkat: string;
  pelanggan: string;
  telepon: string;
  keluhan: string;
}): Promise<HasilPapan> {
  const sesi = await sesiUntukAksi();
  if (!sesi) return TIDAK_MASUK;

  const hasil = await buatPesanan(sesi.toko.id, sesi.user.id, data);
  const orders = await daftarPesanan(sesi.toko.id);
  revalidatePath("/app");
  return { ok: hasil.ok, pesan: hasil.pesan, orders };
}

export async function aksiPindahTahap(
  pesananId: string,
  ke: StageId,
): Promise<HasilPapan> {
  const sesi = await sesiUntukAksi();
  if (!sesi) return TIDAK_MASUK;
  if (!isStageId(ke)) {
    const orders = await daftarPesanan(sesi.toko.id);
    return { ok: false, pesan: "Tahap tujuan tidak dikenal.", orders };
  }

  const hasil = await pindahTahap(sesi.toko.id, sesi.user.id, pesananId, ke);
  const orders = await daftarPesanan(sesi.toko.id);
  revalidatePath("/app");
  return { ok: hasil.ok, pesan: hasil.pesan, orders };
}

/** Hanya pemilik toko. Unit lama di Sudah Diambil disembunyikan dari papan. */
export async function aksiArsipkan(): Promise<HasilPapan> {
  const sesi = await sesiUntukAksi();
  if (!sesi) return TIDAK_MASUK;

  if (sesi.user.peran !== "owner") {
    const orders = await daftarPesanan(sesi.toko.id);
    return {
      ok: false,
      pesan: "Hanya pemilik toko yang bisa mengarsipkan.",
      orders,
    };
  }

  const hasil = await arsipkanPesananLama(sesi.toko.id);
  const orders = await daftarPesanan(sesi.toko.id);
  revalidatePath("/app");
  return { ok: hasil.ok, pesan: hasil.pesan, orders };
}
