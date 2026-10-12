import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { FormMasuk } from "@/components/app/FormMasuk";

export const metadata: Metadata = {
  title: "Masuk, Servioel",
  description: "Masuk ke papan servis toko Anda.",
};

export default function MasukPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-12 lg:py-16">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
            Masuk
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bench-muted">
            Papan kerja toko Anda. Akun staf dibuat oleh pemilik toko dari dalam
            aplikasi. Kalau tokonya baru, daftarkan dulu.
          </p>

          <div className="on-paper mt-7 border-t-4 border-signal bg-paper p-5 text-ink">
            <FormMasuk />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
