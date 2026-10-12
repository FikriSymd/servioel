"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aksiKeluar } from "@/app/actions/auth";
import { bolehKelolaToko, labelPeran } from "@/lib/peran";

type Props = {
  namaToko: string;
  namaPengguna: string;
  peran: string;
};

/**
 * Kepala halaman untuk area kerja. Menyebut nama toko dan nama pengguna, supaya
 * di layar HP yang dipakai bergantian, jelas siapa yang sedang tercatat.
 * Tautan "Staf" hanya muncul untuk pemilik, dan itu bukan pengamannya: aksinya
 * tetap memeriksa peran di server.
 */
export function AppHeader({ namaToko, namaPengguna, peran }: Props) {
  const pathname = usePathname();

  const tautan = [
    { href: "/app", label: "Papan" },
    ...(bolehKelolaToko(peran) ? [{ href: "/app/staf", label: "Staf" }] : []),
  ];

  return (
    <header className="border-b border-bench-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-signal" />
          <span className="font-display text-base font-extrabold tracking-tight text-bench-text">
            Servioel
          </span>
          <span className="text-sm text-bench-muted">{namaToko}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <nav aria-label="Navigasi area kerja" className="flex items-center gap-1">
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

          <span className="hidden text-[13px] text-bench-muted sm:inline">
            {namaPengguna}, {labelPeran(peran)}
          </span>

          <form action={aksiKeluar}>
            <button
              type="submit"
              className="inline-flex min-h-11 min-w-11 items-center px-2.5 text-sm text-bench-muted hover:text-bench-text"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
