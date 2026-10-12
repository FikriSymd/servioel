"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onTutup: () => void;
  onSimpan: (data: { pelanggan: string; telepon: string; keluhan: string }) => void;
};

type Galat = Partial<Record<"pelanggan" | "telepon" | "keluhan", string>>;

export function NewCardForm({ onTutup, onSimpan }: Props) {
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
    if (!pelanggan.trim()) g.pelanggan = "Nama pelanggan belum diisi.";
    if (!telepon.trim()) g.telepon = "Nomor HP belum diisi.";
    if (!keluhan.trim()) g.keluhan = "Keluhan belum diisi.";
    setGalat(g);
    if (Object.keys(g).length > 0) return;
    onSimpan({ pelanggan, telepon, keluhan });
  }

  const kelasInput =
    "mt-1 min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Tutup formulir"
        onClick={onTutup}
        className="absolute inset-0 bg-ink/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-kartu-baru"
        className="relative w-full max-w-md rounded-t-card border border-line-strong bg-paper p-4 sm:rounded-card"
      >
        <h2 id="judul-kartu-baru" className="text-lg font-bold">
          Kartu servis baru
        </h2>
        <p className="mt-1 text-sm text-muted">
          Kartu masuk ke tahap Barang Masuk dan langsung tampil di papan.
        </p>

        <form onSubmit={kirim} className="mt-4 flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="f-pelanggan" className="text-sm font-semibold">
              Nama pelanggan
            </label>
            <input
              id="f-pelanggan"
              ref={inputRef}
              value={pelanggan}
              onChange={(e) => setPelanggan(e.target.value)}
              aria-invalid={galat.pelanggan ? true : undefined}
              aria-describedby={galat.pelanggan ? "g-pelanggan" : undefined}
              className={kelasInput}
            />
            {galat.pelanggan && (
              <p id="g-pelanggan" className="mt-1 text-xs font-semibold text-accent">
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
              <p id="g-telepon" className="mt-1 text-xs font-semibold text-accent">
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
              className="mt-1 w-full rounded-control border border-line-strong bg-surface px-3 py-2 text-sm"
            />
            {galat.keluhan && (
              <p id="g-keluhan" className="mt-1 text-xs font-semibold text-accent">
                {galat.keluhan}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onTutup}
              className="min-h-11 rounded-control border border-line-strong px-4 text-sm font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-control bg-accent px-4 text-sm font-semibold text-paper"
            >
              Simpan kartu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
