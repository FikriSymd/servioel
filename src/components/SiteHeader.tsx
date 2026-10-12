"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Kepala halaman. Nama toko ditulis sebagai teks, bukan lambang karangan,
 * karena lambang asli belum ada dan menciptakan aset palsu itu lebih buruk
 * daripada tidak ada.
 */
export function SiteHeader() {
  const pathname = usePathname();

  const tautan = [
    { href: "/", label: "Beranda" },
    { href: "/papan", label: "Papan" },
  ];

  return (
    <header className="border-b border-bench-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex min-h-11 min-w-11 items-center gap-2.5 font-display text-base font-extrabold tracking-tight text-bench-text"
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-signal" />
          Servioel
        </Link>

        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
          {tautan.map((t) => {
            const aktif = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={aktif ? "page" : undefined}
                className={[
                  "inline-flex min-h-11 min-w-11 items-center px-2.5 text-sm",
                  aktif
                    ? "font-semibold text-bench-text"
                    : "text-bench-muted hover:text-bench-text",
                ].join(" ")}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
