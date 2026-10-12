"use client";

import { useState, useTransition } from "react";
import {
  aksiSetelUlangSandi,
  aksiTambahStaf,
  aksiUbahAktifStaf,
  type HasilStaf,
} from "@/app/actions/staf";
import { labelPeran } from "@/lib/peran";
import type { StafRingkas } from "@/lib/toko";

const kelasIsian =
  "mt-1.5 min-h-11 w-full rounded-control border border-paper-edge bg-paper px-3 text-sm text-ink";

const PERAN_DIPILIH = [
  { nilai: "teknisi", label: "Teknisi" },
  { nilai: "kasir", label: "Kasir" },
];

export function KelolaStaf({ stafAwal }: { stafAwal: StafRingkas[] }) {
  const [daftar, setDaftar] = useState(stafAwal);
  const [pesan, setPesan] = useState("");
  const [galat, setGalat] = useState("");
  const [sibuk, mulai] = useTransition();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [peran, setPeran] = useState("teknisi");
  const [sandi, setSandi] = useState("");

  const [resetUntuk, setResetUntuk] = useState<string | null>(null);
  const [sandiBaru, setSandiBaru] = useState("");

  function terapkan(hasil: HasilStaf) {
    setDaftar(hasil.staf);
    setGalat(hasil.ok ? "" : hasil.pesan);
    setPesan(hasil.ok ? hasil.pesan : "");
  }

  function jalankan(aksi: () => Promise<HasilStaf>) {
    mulai(async () => terapkan(await aksi()));
  }

  return (
    <div className="flex flex-col gap-8">
      {(pesan || galat) && (
        <p
          role={galat ? "alert" : "status"}
          className={[
            "border px-3 py-2 text-[13px]",
            galat ? "border-signal text-bench-text" : "border-bench-line text-bench-muted",
          ].join(" ")}
        >
          {galat || pesan}
        </p>
      )}

      <section>
        <h2 className="font-display text-lg font-bold text-bench-text">
          Akun di toko ini
        </h2>
        <p className="mt-1 text-sm text-bench-muted">
          {daftar.length} akun. Yang dimatikan tidak bisa masuk, dan sesinya yang
          sedang berjalan langsung dicabut.
        </p>

        <ul className="mt-4 flex flex-col border-t border-bench-line">
          {daftar.map((s) => (
            <li key={s.id} className="border-b border-bench-line py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-bench-text">
                    {s.nama}
                    {!s.aktif && (
                      <span className="ml-2 text-[12px] font-normal text-bench-muted">
                        dimatikan
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-bench-muted">
                    {s.email} · {labelPeran(s.peran)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {s.peran !== "owner" && (
                    <>
                      <button
                        type="button"
                        disabled={sibuk}
                        onClick={() =>
                          jalankan(() => aksiUbahAktifStaf(s.id, !s.aktif))
                        }
                        className="min-h-11 rounded-control border border-bench-line px-3 text-[13px] font-semibold text-bench-muted hover:border-signal hover:text-bench-text disabled:opacity-60"
                      >
                        {s.aktif ? "Matikan" : "Nyalakan"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setResetUntuk(resetUntuk === s.id ? null : s.id)
                        }
                        className="min-h-11 rounded-control border border-bench-line px-3 text-[13px] font-semibold text-bench-muted hover:border-signal hover:text-bench-text"
                      >
                        {resetUntuk === s.id ? "Batal" : "Setel ulang sandi"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {resetUntuk === s.id && (
                <div className="on-paper mt-3 border-t-2 border-signal bg-paper p-4 text-ink">
                  <label htmlFor={`sandi-${s.id}`} className="text-sm font-semibold">
                    Kata sandi baru untuk {s.nama}
                  </label>
                  <input
                    id={`sandi-${s.id}`}
                    type="password"
                    autoComplete="new-password"
                    value={sandiBaru}
                    onChange={(e) => setSandiBaru(e.target.value)}
                    className={kelasIsian}
                  />
                  <p className="mt-1 text-[12px] text-ink-muted">
                    Minimal 8 karakter, harus ada huruf dan angka. Sesi lamanya
                    akan dicabut.
                  </p>
                  <button
                    type="button"
                    disabled={sibuk}
                    onClick={() => {
                      const nilai = sandiBaru;
                      setSandiBaru("");
                      setResetUntuk(null);
                      jalankan(() => aksiSetelUlangSandi(s.id, nilai));
                    }}
                    className="mt-3 min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-60"
                  >
                    Simpan kata sandi baru
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="on-paper border-t-4 border-signal bg-paper p-5 text-ink">
        <h2 className="font-display text-lg font-extrabold tracking-tight">
          Buat akun staf
        </h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          Staf tidak bisa mendaftar sendiri. Akunnya selalu dibuat dari dalam toko.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="s-nama" className="text-sm font-semibold">
              Nama
            </label>
            <input
              id="s-nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className={kelasIsian}
            />
          </div>

          <div>
            <label htmlFor="s-email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="s-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={kelasIsian}
            />
          </div>

          <div>
            <label htmlFor="s-peran" className="text-sm font-semibold">
              Peran
            </label>
            <select
              id="s-peran"
              value={peran}
              onChange={(e) => setPeran(e.target.value)}
              className={kelasIsian}
            >
              {PERAN_DIPILIH.map((p) => (
                <option key={p.nilai} value={p.nilai}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="s-sandi" className="text-sm font-semibold">
              Kata sandi awal
            </label>
            <input
              id="s-sandi"
              type="password"
              autoComplete="new-password"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              className={kelasIsian}
            />
            <p className="mt-1 text-[12px] text-ink-muted">
              Minimal 8 karakter, harus ada huruf dan angka. Sampaikan ke
              orangnya, dan minta diganti setelah masuk pertama.
            </p>
          </div>

          <button
            type="button"
            disabled={sibuk}
            onClick={() => {
              const isian = { nama, email, peran, kataSandi: sandi };
              setNama("");
              setEmail("");
              setSandi("");
              jalankan(() => aksiTambahStaf(isian));
            }}
            className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-60"
          >
            Buat akun
          </button>
        </div>
      </section>
    </div>
  );
}
