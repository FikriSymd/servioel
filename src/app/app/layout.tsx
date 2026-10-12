import type { Metadata } from "next";
import { AppHeader } from "@/components/app/AppHeader";
import { wajibMasuk } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Area kerja, Servioel",
};

/**
 * Kerangka area kerja. Sesi diperiksa di server sebelum apa pun dirender, dan
 * data toko yang dipakai di sini datang dari sesi itu, bukan dari alamat.
 */
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sesi = await wajibMasuk();

  return (
    <>
      <AppHeader
        namaToko={sesi.toko.nama}
        namaPengguna={sesi.user.nama}
        peran={sesi.user.peran}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
      <footer className="mt-auto border-t border-bench-line">
        <div className="mx-auto max-w-6xl px-4 py-5 text-[13px] text-bench-muted">
          Servioel. Data toko Anda terpisah dari toko lain, dan pemisahan itu
          ditegakkan di server.
        </div>
      </footer>
    </>
  );
}
