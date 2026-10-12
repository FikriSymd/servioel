import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Masuk, Servioel",
  description: "Status pendaftaran dan login Servioel.",
};

// Jujur: login belum ada. Halaman ini menyebutkan apa yang belum jadi
// dan mengarahkan ke papan contoh, bukan formulir yang tidak berfungsi.
export default function MasukPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Masuk dan daftar belum tersedia
          </h1>
          <p className="mt-3 text-sm text-muted">
            Papan contoh sekarang bisa dipakai tanpa akun. Pendaftaran toko,
            login, dan pemisahan data antar toko masuk di tahap berikutnya.
          </p>

          <div className="mt-6 rounded-card border border-line-strong bg-surface p-5">
            <h2 className="text-base font-bold">Yang sudah bisa dicoba</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li className="border-l-2 border-accent pl-3">
                Membuka papan contoh dan melihat unit per tahap.
              </li>
              <li className="border-l-2 border-accent pl-3">
                Memindahkan kartu antar tahap dengan tarik, ketuk, atau keyboard.
              </li>
              <li className="border-l-2 border-accent pl-3">
                Membuat kartu servis baru dan melihat riwayat perpindahannya.
              </li>
            </ul>
            <Link
              href="/papan"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-control bg-accent px-5 text-sm font-semibold text-paper"
            >
              Buka papan contoh
            </Link>
          </div>

          <div className="mt-4 rounded-card border border-dashed border-line-strong p-5">
            <h2 className="text-base font-bold">Yang belum ada</h2>
            <p className="mt-2 text-sm text-muted">
              Daftar toko dengan email dan password, login, sesi, dan peran
              owner/teknisi/kasir. Jadi tidak ada formulir di halaman ini yang
              bisa dipakai, dan sengaja tidak dibuat supaya tidak ada tombol yang
              tidak berfungsi.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
