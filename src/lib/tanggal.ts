/*
  Penulisan tanggal dalam Bahasa Indonesia.

  Dikumpulkan di satu tempat karena tanggal muncul di nota cetak, di halaman
  status pelanggan, dan di detail nota. Kalau formatnya ditulis ulang di tiap
  tempat, cepat atau lambat akan ada satu yang beda sendiri.
*/

const PANJANG = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const PANJANG_DENGAN_JAM = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function tanggalPanjang(iso: string): string {
  return PANJANG.format(new Date(iso));
}

export function tanggalJam(iso: string): string {
  return PANJANG_DENGAN_JAM.format(new Date(iso));
}
