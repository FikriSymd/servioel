import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Board } from "@/components/board/Board";

export const metadata: Metadata = {
  title: "Papan servis (contoh), Servioel",
  description:
    "Papan kerja servis dengan data contoh: seret nota antar tahap, atau buka notanya untuk memindahkan.",
};

export default function PapanPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Board />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
