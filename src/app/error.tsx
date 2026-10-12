"use client";

import { useEffect } from "react";

/**
 * Batas kegagalan tingkat akar. Dibutuhkan karena pemeriksaan sesi dijalankan di
 * layout area kerja, dan batas kegagalan milik segmen yang sama tidak menangkap
 * kegagalan layout-nya sendiri. Tanpa ini, kegagalan basis data berubah jadi
 * halaman bawaan Next yang berbahasa Inggris dan tanpa jalan keluar.
 *
 * `reset()` dan `router.refresh()` sama-sama tidak cukup di sini: kegagalannya
 * datang dari server saat segmennya diambil, dan keduanya tetap menyajikan
 * muatan yang gagal. Muat ulang penuh yang benar-benar mengambil dari server
 * lagi, jadi itu yang dipakai.
 */
export default function Gagal({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Kegagalan halaman:", error);
  }, [error]);

  function coba() {
    window.location.reload();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-bench-muted">
          Servioel
        </p>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-bench-text">
          Halaman ini tidak bisa dibuka
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-bench-text/85">
          Server tidak menjawab. Paling sering karena penyimpanan datanya sedang
          mati atau sedang dinyalakan ulang. Data yang sudah tersimpan tidak
          hilang.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-bench-muted">
          Tunggu sebentar lalu coba lagi. Kalau tetap begini, hubungi pengelola
          server.
        </p>
        <button
          type="button"
          onClick={coba}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-control bg-signal px-5 text-sm font-bold text-ink"
        >
          Coba lagi
        </button>
      </div>
    </main>
  );
}
