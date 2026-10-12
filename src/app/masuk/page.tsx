import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Masuk, Servioel",
  description: "Status pendaftaran dan login Servioel.",
};

/*
  Jujur: login belum ada. Halaman ini menyebut apa yang belum jadi dan
  mengarahkan ke papan contoh. Tidak ada formulir yang tidak berfungsi.
*/
export default function MasukPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 lg:py-16">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
            Masuk dan daftar belum tersedia
          </h1>
          <p className="mt-4 text-base leading-relaxed text-bench-text/85">
            Papan contoh bisa dipakai tanpa akun. Pendaftaran toko, login, dan
            pemisahan data antar toko masuk di tahap berikutnya.
          </p>

          <h2 className="mt-10 font-display text-base font-bold text-bench-text">
            Yang sudah bisa dicoba
          </h2>
          <ul className="mt-3 flex flex-col">
            {[
              "Membuka papan contoh dan melihat unit per tahap.",
              "Memindahkan nota antar tahap dengan seret, ketuk, atau keyboard.",
              "Menulis nota servis baru dan membaca riwayat perpindahannya.",
            ].map((t) => (
              <li
                key={t}
                className="border-t border-bench-line py-3.5 text-sm text-bench-muted first:border-t-0 first:pt-0"
              >
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/papan"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-control bg-signal px-5 text-sm font-bold text-ink"
          >
            Buka papan contoh
          </Link>

          <h2 className="mt-10 font-display text-base font-bold text-bench-text">
            Yang belum ada
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-bench-muted">
            Daftar toko dengan email dan password, login, sesi, dan peran owner,
            teknisi, kasir. Karena itu tidak ada formulir di halaman ini, supaya
            tidak ada tombol yang tidak berfungsi.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
