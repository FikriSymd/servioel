"use client";

import { useState } from "react";

/**
 * Bagikan tautan nota ke pelanggan.
 *
 * Tautannya ditampilkan di kotak yang bisa diblok dan disalin manual, bukan
 * cuma tombol salin. Kalau peramban menolak akses papan klip (izin, atau
 * halaman bukan HTTPS), tombolnya gagal tapi tautannya tetap ada di layar dan
 * masih bisa disalin tangan. Tombol yang gagal diam-diam lebih buruk daripada
 * kotak teks biasa.
 */
export function BagikanNota({ token }: { token: string }) {
  const [kabar, setKabar] = useState("");

  // Alamat dibaca di klien supaya tautannya ikut alamat yang sedang dipakai
  // (localhost saat diuji, alamat publik saat dipakai toko).
  const tautan =
    typeof window === "undefined" ? `/n/${token}` : `${window.location.origin}/n/${token}`;

  async function salin() {
    try {
      await navigator.clipboard.writeText(tautan);
      setKabar("Tautan disalin.");
    } catch {
      setKabar("Peramban menolak menyalin. Blok tautannya lalu salin sendiri.");
    }
  }

  return (
    <div>
      <label htmlFor="tautan-nota" className="text-sm font-semibold">
        Tautan untuk pelanggan
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="tautan-nota"
          readOnly
          value={tautan}
          onFocus={(e) => e.currentTarget.select()}
          className="angka min-h-11 min-w-0 flex-1 rounded-control border border-paper-edge bg-paper px-3 text-[13px] text-ink"
        />
        <button
          type="button"
          onClick={salin}
          className="min-h-11 shrink-0 rounded-control border border-paper-edge px-4 text-sm font-semibold hover:border-ink"
        >
          Salin
        </button>
      </div>
      <p className="mt-1 text-[13px] text-ink-muted">
        Siapa pun yang punya tautan ini bisa melihat nota sampai tahap mana, jadi
        kirim ke pelanggannya saja.
      </p>
      <p role="status" aria-live="polite" className="mt-1 min-h-5 text-[13px] font-semibold text-signal-ink">
        {kabar}
      </p>
    </div>
  );
}
