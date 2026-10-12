import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Board } from "@/components/board/Board";

export const metadata: Metadata = {
  title: "Papan servis (contoh), Servioel",
  description:
    "Papan kanban alur servis dengan data contoh: tarik kartu antar tahap, atau ketuk kartu untuk memindahkannya.",
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
