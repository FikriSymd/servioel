"use client";

import { useEffect } from "react";

/**
 * Keadaan gagal untuk area kerja. Menyebut penyebab yang paling mungkin dan
 * memberi satu tindakan, bukan cuma "terjadi kesalahan".
 */
export default function GagalPapan({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Papan gagal dirender:", error.message);
  }, [error]);

  return (
    <div role="alert" className="border border-bench-line px-4 py-12 text-center">
      <h2 className="font-display text-lg font-bold text-bench-text">
        Papan gagal dimuat
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-bench-muted">
        Data papan tidak terbaca. Biasanya karena sambungan ke database terputus.
        Coba lagi; kalau tetap gagal, papan belum bisa dipakai.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 min-h-11 rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
      >
        Coba lagi
      </button>
    </div>
  );
}
