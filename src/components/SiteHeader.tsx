"use client";

import Link from "next/link";
import { useState } from "react";

// Wordmark berupa teks, bukan logo karangan. Logo asli belum ada,
// jadi tidak ada aset yang dipalsukan (lihat R-23 di docs/PRD.md).
export function SiteHeader() {
  const [menuBuka, setMenuBuka] = useState(false);

  return (
    <header className="on-dark bg-struct text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2 py-1">
          <span className="text-lg font-extrabold tracking-tight">Servioel</span>
          <span className="hidden text-xs text-paper/70 sm:inline">
            papan servis
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Utama">
          <Link
            href="/papan"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control px-3 text-sm font-medium hover:bg-paper/10"
          >
            Papan contoh
          </Link>
          <Link
            href="/masuk"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-paper/40 px-3 text-sm font-semibold hover:bg-paper/10"
          >
            Masuk
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={menuBuka}
          aria-controls="menu-utama"
          onClick={() => setMenuBuka((v) => !v)}
          className="min-h-11 rounded-control border border-paper/40 px-3 text-sm font-semibold sm:hidden"
        >
          {menuBuka ? "Tutup" : "Menu"}
        </button>
      </div>

      {menuBuka && (
        <nav
          id="menu-utama"
          aria-label="Utama"
          className="border-t border-paper/20 px-4 pb-3 pt-2 sm:hidden"
        >
          <ul className="flex flex-col">
            <li>
              <Link
                href="/papan"
                onClick={() => setMenuBuka(false)}
                className="block rounded-control px-3 py-3 text-sm font-medium hover:bg-paper/10"
              >
                Papan contoh
              </Link>
            </li>
            <li>
              <Link
                href="/masuk"
                onClick={() => setMenuBuka(false)}
                className="block rounded-control px-3 py-3 text-sm font-medium hover:bg-paper/10"
              >
                Masuk
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
