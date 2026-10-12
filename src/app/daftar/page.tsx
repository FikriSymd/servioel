import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { FormDaftar } from "@/components/app/FormDaftar";

export const metadata: Metadata = {
  title: "Daftarkan toko, Servioel",
  description: "Buat akun toko dan mulai papan servis.",
};

export default function DaftarPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 lg:py-16">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
            Daftarkan toko
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bench-muted">
            Satu akun untuk satu toko. Anda jadi pemiliknya, lalu akun teknisi dan
            kasir dibuat dari dalam aplikasi.
          </p>

          <div className="on-paper mt-7 border-t-4 border-signal bg-paper p-5 text-ink">
            <FormDaftar />
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-bench-muted">
            Belum ada verifikasi email. Toko langsung aktif setelah daftar.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
