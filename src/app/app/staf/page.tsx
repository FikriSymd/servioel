import type { Metadata } from "next";
import { KelolaStaf } from "@/components/app/KelolaStaf";
import { wajibPeran } from "@/lib/dal";
import { daftarStaf } from "@/lib/toko";

export const metadata: Metadata = {
  title: "Staf, Servioel",
};

/**
 * Halaman ini hanya untuk pemilik toko. Pemeriksaannya di server lewat
 * wajibPeran, jadi menghapus tautannya dari tampilan tidak membuka akses.
 */
export default async function StafPage() {
  const sesi = await wajibPeran(["owner"]);
  const staf = await daftarStaf(sesi.toko.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-bench-text">
          Staf
        </h1>
        <p className="mt-1 text-sm text-bench-muted">
          Akun yang boleh memakai papan toko {sesi.toko.nama}.
        </p>
      </div>
      <KelolaStaf stafAwal={staf} />
    </div>
  );
}
