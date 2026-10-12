import "dotenv/config";
import { randomBytes } from "node:crypto";
import { db } from "../src/lib/db";
import { buatPesanan, pindahTahap } from "../src/lib/orders";
import { daftarToko } from "../src/lib/toko";
import type { StageId } from "../src/lib/types";

/*
  Menyiapkan satu toko contoh supaya bisa langsung dicoba.

  Kata sandinya dibuat acak dan dicetak sekali di sini, bukan ditulis tetap di
  dalam kode. Akun contoh dengan sandi yang bisa ditebak adalah pintu terbuka
  kalau aplikasinya dipasang di internet.

  Jalankan: npm run db:seed
*/

const EMAIL = "contoh@servioel.test";

async function main() {
  const sudahAda = await db.user.findUnique({ where: { email: EMAIL }, select: { id: true } });
  if (sudahAda) {
    console.log(`Akun ${EMAIL} sudah ada. Tidak ada yang diubah.`);
    await db.$disconnect();
    return;
  }

  const kataSandi = `sv-${randomBytes(6).toString("hex")}`;
  const hasil = await daftarToko({
    namaToko: "Toko Contoh",
    namaPemilik: "Pemilik Toko Contoh",
    email: EMAIL,
    kataSandi,
  });
  if (!hasil.ok) throw new Error(hasil.pesan);

  const { tokoId } = (await db.user.findUnique({ where: { id: hasil.data.userId }, select: { tokoId: true } }))!;

  const nota: { perangkat: string; pelanggan: string; telepon: string; keluhan: string; ke: StageId }[] = [
    { perangkat: "Samsung Galaxy A54", pelanggan: "Rina", telepon: "0812-3456-7890", keluhan: "Layar bergaris setelah terjatuh.", ke: "diagnosa" },
    { perangkat: "iPhone 12", pelanggan: "Yusuf", telepon: "0813-2222-1111", keluhan: "Tidak mau menyala, kena air.", ke: "nunggu-sparepart" },
    { perangkat: "Xiaomi Redmi Note 11", pelanggan: "Dewi", telepon: "0857-8888-9999", keluhan: "Baterai cepat habis dan panas.", ke: "dikerjakan" },
    { perangkat: "Laptop Asus VivoBook 14", pelanggan: "Bagas", telepon: "0821-4444-5555", keluhan: "Tombol volume tidak berfungsi.", ke: "barang-masuk" },
  ];

  for (const n of nota) {
    const dibuat = await buatPesanan(tokoId, hasil.data.userId, {
      perangkat: n.perangkat,
      pelanggan: n.pelanggan,
      telepon: n.telepon,
      keluhan: n.keluhan,
    });
    if (!dibuat.ok) throw new Error(dibuat.pesan);
    const id = (await db.serviceOrder.findFirst({
      where: { tokoId, pelanggan: n.pelanggan },
      select: { id: true },
    }))!.id;
    if (n.ke !== "barang-masuk") {
      const pindah = await pindahTahap(tokoId, hasil.data.userId, id, n.ke);
      if (!pindah.ok) throw new Error(pindah.pesan);
    }
  }

  console.log("\nToko contoh siap.\n");
  console.log(`  Alamat masuk : ${EMAIL}`);
  console.log(`  Kata sandi   : ${kataSandi}`);
  console.log("\nKata sandi ini hanya muncul sekali. Catat dulu sebelum menutup terminal.\n");

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error("Seed gagal:", e);
  await db.$disconnect();
  process.exit(1);
});
