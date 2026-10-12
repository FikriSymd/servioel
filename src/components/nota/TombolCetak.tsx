"use client";

/**
 * Tombol cetak. Dipisah jadi komponen klien sendiri supaya halaman nota tetap
 * dirender di server: isi notanya sudah ada di HTML pertama, jadi kalau
 * JavaScript belum jalan pun notanya tetap terbaca dan bisa dicetak dengan
 * Ctrl+P dari peramban.
 */
export function TombolCetak() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-11 rounded-control bg-signal px-4 text-sm font-bold text-ink"
    >
      Cetak nota
    </button>
  );
}
