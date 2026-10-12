"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onTutup: () => void;
  onSimpan: (data: {
    perangkat: string;
    pelanggan: string;
    telepon: string;
    keluhan: string;
  }) => void;
};

type Galat = Partial<Record<"perangkat" | "pelanggan" | "telepon" | "keluhan", string>>;

/**
 * Menulis nota baru: formulirnya sendiri berbentuk nota kertas.
 *
 * Perangkat ditaruh paling atas karena itu yang pertama dilihat dan ditulis
 * saat unit diterima di meja. Nomor nota muncul di kartu setelah disimpan.
 */
export function NewCardForm({ onTutup, onSimpan }: Props) {
  const [perangkat, setPerangkat] = useState("");
  const [pelanggan, setPelanggan] = useState("");
  const [telepon, setTelepon] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [galat, setGalat] = useState<Galat>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onTutup();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onTutup]);

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    const g: Galat = {};
    if (!perangkat.trim()) g.perangkat = "Nama perangkat belum diisi.";
    if (!pelanggan.trim()) g.pelanggan = "Nama pelanggan belum diisi.";
    if (!telepon.trim()) g.telepon = "Nomor HP belum diisi.";
    if (!keluhan.trim()) g.keluhan = "Keluhan belum diisi.";
    setGalat(g);
    if (Object.keys(g).length > 0) return;
    onSimpan({ perangkat, pelanggan, telepon, keluhan });
  }

  const kelasInput =
    "mt-1.5 min-h-11 w-full rounded-control border border-paper-edge bg-paper px-3 text-sm text-ink";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Tutup formulir"
        onClick={onTutup}
        className="absolute inset-0 bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-nota-baru"
        className="on-paper relative max-h-[92vh] w-full overflow-y-auto border-t-4 border-signal bg-paper p-4 text-ink sm:max-w-lg"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="judul-nota-baru"
            className="font-display text-xl font-extrabold tracking-tight"
          >
            Nota servis baru
          </h2>
          <span className="angka text-[11px] font-semibold text-ink-muted">
            nomor dibuat otomatis
          </span>
        </div>

        <div className="mt-3 border-t border-dashed border-ink/30" />

        <p className="mt-3 text-sm text-ink-muted">
          Nota langsung masuk tahap Barang Masuk dan muncul di papan.
        </p>

        <form onSubmit={kirim} className="mt-4 flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="f-perangkat" className="text-sm font-semibold">
              Perangkat
            </label>
            <input
              id="f-perangkat"
              ref={inputRef}
              placeholder="Samsung Galaxy A54"
              value={perangkat}
              onChange={(e) => setPerangkat(e.target.value)}
              aria-invalid={galat.perangkat ? true : undefined}
              aria-describedby={galat.perangkat ? "g-perangkat" : "b-perangkat"}
              className={kelasInput}
            />
            {galat.perangkat ? (
              <p id="g-perangkat" className="mt-1 text-[13px] font-semibold text-signal-ink">
                {galat.perangkat}
              </p>
            ) : (
              <p id="b-perangkat" className="mt-1 text-[13px] text-ink-muted">
                Merek dan tipe, tulis apa adanya.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="f-pelanggan" className="text-sm font-semibold">
              Nama pelanggan
            </label>
            <input
              id="f-pelanggan"
              value={pelanggan}
              onChange={(e) => setPelanggan(e.target.value)}
              aria-invalid={galat.pelanggan ? true : undefined}
              aria-describedby={galat.pelanggan ? "g-pelanggan" : undefined}
              className={kelasInput}
            />
            {galat.pelanggan && (
              <p
                id="g-pelanggan"
                className="mt-1 text-[13px] font-semibold text-signal-ink"
              >
                {galat.pelanggan}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="f-telepon" className="text-sm font-semibold">
              Nomor HP
            </label>
            <input
              id="f-telepon"
              inputMode="tel"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              aria-invalid={galat.telepon ? true : undefined}
              aria-describedby={galat.telepon ? "g-telepon" : undefined}
              className={kelasInput}
            />
            {galat.telepon && (
              <p id="g-telepon" className="mt-1 text-[13px] font-semibold text-signal-ink">
                {galat.telepon}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="f-keluhan" className="text-sm font-semibold">
              Keluhan yang dilaporkan
            </label>
            <textarea
              id="f-keluhan"
              rows={3}
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              aria-invalid={galat.keluhan ? true : undefined}
              aria-describedby={galat.keluhan ? "g-keluhan" : undefined}
              className="mt-1.5 w-full rounded-control border border-paper-edge bg-paper px-3 py-2 text-sm text-ink"
            />
            {galat.keluhan && (
              <p id="g-keluhan" className="mt-1 text-[13px] font-semibold text-signal-ink">
                {galat.keluhan}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onTutup}
              className="min-h-11 rounded-control border border-paper-edge px-4 text-sm font-semibold hover:border-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink/90"
            >
              Simpan nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
