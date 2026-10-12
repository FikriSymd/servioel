import type { ServiceOrder } from "./types";

/**
 * Pencarian unit di papan.
 *
 * Yang dicocokkan: nomor servis, nama perangkat, nama pelanggan, nomor HP.
 * Nomor servis ikut karena itu yang paling sering disebut saat pelanggan
 * menelpon ("nota SV-2026-0007 sudah jadi belum?").
 *
 * Pencocokan disamakan dulu supaya orang tidak perlu menulis persis:
 * - huruf besar-kecil diabaikan ("BUDI" cocok "budi")
 * - spasi, tanda hubung, titik, dan tanda kurung dibuang, jadi "08123456789",
 *   "0812-3456-7890", dan "0812 3456 7890" sama-sama cocok
 *
 * Substring dipakai, bukan awalan: orang mencari potongan nama, bukan awalannya.
 */
export function samakan(nilai: string): string {
  return nilai.toLowerCase().replace(/[\s\-().+]/g, "");
}

export function cocokCari(order: ServiceOrder, kueri: string): boolean {
  const q = samakan(kueri);
  if (!q) return true;
  return [order.nomor, order.perangkat, order.pelanggan, order.telepon].some((nilai) =>
    samakan(nilai).includes(q),
  );
}

/** Menyaring papan. Kueri kosong mengembalikan semuanya, tidak menyembunyikan apa pun. */
export function saringPesanan(orders: ServiceOrder[], kueri: string): ServiceOrder[] {
  if (!samakan(kueri)) return orders;
  return orders.filter((o) => cocokCari(o, kueri));
}
