import type { Metadata } from "next";
import { PapanApp } from "@/components/app/PapanApp";
import { wajibMasuk } from "@/lib/dal";
import { daftarPesanan } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Papan servis, Servioel",
};

export default async function PapanKerjaPage() {
  const sesi = await wajibMasuk();
  const orders = await daftarPesanan(sesi.toko.id);

  return <PapanApp ordersAwal={orders} peran={sesi.user.peran} />;
}
