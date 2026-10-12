import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BoardContoh } from "@/components/board/BoardContoh";

export const metadata: Metadata = {
  title: "Papan contoh, Servioel",
  description:
    "Coba papan servis dengan data contoh: seret nota antar tahap, atau buka notanya untuk memindahkan.",
};

export default function PapanContohPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <BoardContoh />
          <p className="mt-6 text-sm text-bench-muted">
            Papan ini tidak menyimpan apa pun. Untuk papan yang menyimpan, buat
            akun toko dulu.
          </p>
          <Link
            href="/daftar"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-control border border-bench-line px-5 text-sm font-semibold text-bench-text hover:border-signal"
          >
            Daftarkan toko
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
