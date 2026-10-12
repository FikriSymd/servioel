import "dotenv/config";
import { db } from "../src/lib/db";
import { buatPesanan, daftarPesanan, pindahTahap, arsipkanPesananLama } from "../src/lib/orders";
import { daftarStaf, daftarToko, tambahStaf } from "../src/lib/toko";

/*
  Uji pemisahan data antar toko, dijalankan langsung ke fungsi server, bukan
  lewat tampilan. Tampilan bisa saja menyembunyikan tombol, jadi yang diuji di
  sini adalah jawaban servernya kalau id toko lain ditebak benar.

  Jalankan: npx tsx --conditions=react-server scripts/check-isolasi.ts
*/

const cap = Date.now();
let gagal = 0;

function periksa(nama: string, lulus: boolean, catatan = "") {
  console.log(`${lulus ? "LULUS" : "GAGAL"}  ${nama}${catatan ? `  (${catatan})` : ""}`);
  if (!lulus) gagal += 1;
}

async function main() {
  const a = await daftarToko({
    namaToko: "Uji Toko A",
    namaPemilik: "Pemilik A",
    email: `a-${cap}@uji.test`,
    kataSandi: "rahasia123",
  });
  const b = await daftarToko({
    namaToko: "Uji Toko B",
    namaPemilik: "Pemilik B",
    email: `b-${cap}@uji.test`,
    kataSandi: "rahasia123",
  });
  if (!a.ok || !b.ok) throw new Error("gagal membuat toko uji");

  const tokoA = (await db.user.findUnique({ where: { id: a.data.userId }, select: { tokoId: true } }))!.tokoId;
  const tokoB = (await db.user.findUnique({ where: { id: b.data.userId }, select: { tokoId: true } }))!.tokoId;

  // Toko B juga punya satu staf sendiri, untuk memastikan daftar staf tidak bocor.
  await tambahStaf(tokoB, {
    nama: "Staf B",
    email: `staf-b-${cap}@uji.test`,
    peran: "kasir",
    kataSandi: "rahasia123",
  });

  const dibuat = await buatPesanan(tokoA, a.data.userId, {
    perangkat: "Unit uji A",
    pelanggan: "Pelanggan A",
    telepon: "0812-0000-0000",
    keluhan: "Uji pemisahan data.",
  });
  periksa("nota toko A dibuat", dibuat.ok, dibuat.pesan);

  const notaA = (await db.serviceOrder.findFirst({ where: { tokoId: tokoA }, select: { id: true, nomor: true } }))!;

  const daftarB = await daftarPesanan(tokoB);
  periksa("toko B tidak melihat nota toko A", daftarB.every((o) => o.id !== notaA.id), `toko B melihat ${daftarB.length} nota`);

  const daftarA = await daftarPesanan(tokoA);
  periksa("toko A melihat notanya sendiri", daftarA.some((o) => o.id === notaA.id));

  // Serangan: toko B memakai id nota toko A yang benar.
  const curang = await pindahTahap(tokoB, b.data.userId, notaA.id, "selesai");
  periksa("toko B tidak bisa memindahkan nota toko A", !curang.ok, curang.pesan);

  const sesudah = await db.serviceOrder.findUnique({ where: { id: notaA.id }, select: { stage: true } });
  periksa("tahap nota toko A tidak berubah", sesudah?.stage === "barang-masuk", `tahap sekarang ${sesudah?.stage}`);

  const riwayatCurang = await db.stageMove.count({ where: { pesananId: notaA.id, tokoId: tokoB } });
  periksa("tidak ada riwayat palsu tercatat", riwayatCurang === 0);

  // Arsip: toko B mengarsipkan, tidak boleh menyentuh nota toko A.
  await db.serviceOrder.update({ where: { id: notaA.id }, data: { stage: "sudah-diambil", masukTahapPada: new Date(Date.now() - 40 * 86_400_000) } });
  await arsipkanPesananLama(tokoB);
  const notaASetelahArsip = await db.serviceOrder.findUnique({ where: { id: notaA.id }, select: { diarsipPada: true } });
  periksa("arsip toko B tidak menyentuh nota toko A", notaASetelahArsip?.diarsipPada === null);

  // Staf: daftar staf toko B tidak memuat pemilik toko A.
  const stafB = await daftarStaf(tokoB);
  periksa("daftar staf toko B tidak memuat orang toko A", stafB.every((s) => s.email !== `a-${cap}@uji.test`), `${stafB.length} akun`);

  // Nomor servis tidak boleh bertabrakan antar toko: dua toko sama-sama mulai dari 0001.
  const notaB = await buatPesanan(tokoB, b.data.userId, { perangkat: "Unit uji B", pelanggan: "Pelanggan B", telepon: "0813-0000-0000", keluhan: "Uji nomor." });
  const nomorB = (await db.serviceOrder.findFirst({ where: { tokoId: tokoB }, select: { nomor: true } }))!.nomor;
  periksa("nomor servis toko B mulai dari 0001 sendiri", nomorB.endsWith("0001"), `${notaA.nomor} vs ${nomorB}`);

  // Bersihkan semua data uji, urut dari yang paling bergantung.
  // Riwayat sengaja tidak ikut terhapus saat akun dihapus, jadi di sini harus
  // dihapus lebih dulu. Itu memang yang diinginkan: catatan kerja tidak hilang
  // hanya karena akunnya dihapus.
  const idToko = [tokoA, tokoB];
  await db.stageMove.deleteMany({ where: { tokoId: { in: idToko } } });
  await db.sesi.deleteMany({ where: { user: { tokoId: { in: idToko } } } });
  await db.serviceOrder.deleteMany({ where: { tokoId: { in: idToko } } });
  await db.penghitung.deleteMany({
    where: { OR: [{ kunci: { startsWith: tokoA } }, { kunci: { startsWith: tokoB } }] },
  });
  await db.user.deleteMany({ where: { tokoId: { in: idToko } } });
  await db.toko.deleteMany({ where: { id: { in: idToko } } });
  const sisa = await db.toko.count({ where: { id: { in: idToko } } });
  periksa("data uji dibersihkan", sisa === 0);

  console.log(gagal === 0 ? "\nSEMUA LULUS" : `\n${gagal} PEMERIKSAAN GAGAL`);
  await db.$disconnect();
  process.exit(gagal === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("Gagal menjalankan uji:", e);
  await db.$disconnect();
  process.exit(1);
});
