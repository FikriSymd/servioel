import "dotenv/config";
import { db } from "../src/lib/db";
import { buatPesanan, notaDariToken, pindahTahap } from "../src/lib/orders";
import { daftarToko } from "../src/lib/toko";

/*
  Uji tautan nota pelanggan.

  Halaman /n/<token> adalah satu-satunya halaman yang bisa dibuka tanpa masuk,
  jadi yang diuji di sini bukan tampilannya, tapi batas datanya: apa yang
  benar-benar diambil dari database untuk halaman itu.

  Jalankan: npm run check:nota
*/

const cap = Date.now();
let gagal = 0;

function periksa(nama: string, lulus: boolean, catatan = "") {
  console.log(`${lulus ? "LULUS" : "GAGAL"}  ${nama}${catatan ? `  (${catatan})` : ""}`);
  if (!lulus) gagal += 1;
}

/** Kolom yang boleh sampai ke halaman pelanggan. Sengaja ditulis lengkap. */
const KOLOM_BOLEH = ["diperbaruiPada", "namaToko", "nomor", "pelanggan", "perangkat", "stage"];

async function main() {
  const a = await daftarToko({
    namaToko: "Uji Nota A",
    namaPemilik: "Pemilik Nota A",
    email: `nota-a-${cap}@uji.test`,
    kataSandi: "rahasia123",
  });
  const b = await daftarToko({
    namaToko: "Uji Nota B",
    namaPemilik: "Pemilik Nota B",
    email: `nota-b-${cap}@uji.test`,
    kataSandi: "rahasia123",
  });
  if (!a.ok || !b.ok) throw new Error("gagal membuat toko uji");

  const tokoA = (await db.user.findUnique({ where: { id: a.data.userId }, select: { tokoId: true } }))!.tokoId;
  const tokoB = (await db.user.findUnique({ where: { id: b.data.userId }, select: { tokoId: true } }))!.tokoId;

  const dibuat = await buatPesanan(tokoA, a.data.userId, {
    perangkat: "Unit nota A",
    pelanggan: "Pelanggan Nota A",
    telepon: "0899-1111-2222",
    keluhan: "Keluhan rahasia yang tidak boleh ikut ke halaman publik.",
  });
  periksa("nota uji dibuat", dibuat.ok, dibuat.pesan);

  const notaA = (await db.serviceOrder.findFirst({
    where: { tokoId: tokoA },
    select: { id: true, tokenPublik: true },
  }))!;

  const dibuatB = await buatPesanan(tokoB, b.data.userId, {
    perangkat: "Unit nota B",
    pelanggan: "Pelanggan Nota B",
    telepon: "0899-3333-4444",
    keluhan: "Keluhan toko B.",
  });
  periksa("nota toko B dibuat", dibuatB.ok, dibuatB.pesan);

  const notaB = (await db.serviceOrder.findFirst({
    where: { tokoId: tokoB },
    select: { tokenPublik: true },
  }))!;

  // Bentuk token
  periksa("token 32 huruf heksadesimal", /^[0-9a-f]{32}$/.test(notaA.tokenPublik), notaA.tokenPublik.slice(0, 12) + "...");
  periksa("token tiap nota berbeda", notaA.tokenPublik !== notaB.tokenPublik);

  // Token benar
  const lihat = await notaDariToken(notaA.tokenPublik);
  periksa("token benar mengembalikan notanya", lihat !== null);
  periksa("nomor dan perangkat ikut", lihat?.nomor.startsWith("SV-") === true && lihat?.perangkat === "Unit nota A", lihat?.nomor);
  periksa("nama tokonya benar", lihat?.namaToko === "Uji Nota A", lihat?.namaToko);

  // Batas data: hanya kolom yang diizinkan yang sampai ke halaman publik.
  const kolom = lihat ? Object.keys(lihat).sort() : [];
  periksa(
    "hanya kolom yang diizinkan yang dikirim",
    JSON.stringify(kolom) === JSON.stringify(KOLOM_BOLEH),
    kolom.join(", "),
  );
  periksa(
    "nomor HP tidak ikut ke halaman publik",
    !JSON.stringify(lihat ?? {}).includes("0899"),
  );
  periksa(
    "isi keluhan tidak ikut ke halaman publik",
    !JSON.stringify(lihat ?? {}).includes("rahasia"),
  );

  // Token toko A tidak boleh mengembalikan apa pun milik toko B.
  const lihatB = await notaDariToken(notaB.tokenPublik);
  periksa("token toko B mengembalikan toko B saja", lihatB?.namaToko === "Uji Nota B", lihatB?.namaToko);
  periksa("token toko A tidak menyentuh data toko B", lihat?.namaToko !== lihatB?.namaToko);

  // Token yang tidak ada atau bentuknya salah.
  const acak = "0123456789abcdef0123456789abcdef";
  periksa("token acak yang tidak terpakai mengembalikan kosong", (await notaDariToken(acak)) === null);
  periksa("token kosong ditolak", (await notaDariToken("")) === null);
  periksa("token terlalu pendek ditolak", (await notaDariToken("abc")) === null);
  periksa("token 31 huruf ditolak", (await notaDariToken(notaA.tokenPublik.slice(0, 31))) === null);
  periksa("token 33 huruf ditolak", (await notaDariToken(notaA.tokenPublik + "a")) === null);
  periksa("token huruf besar ditolak (tidak cocok)", (await notaDariToken("ABCDEF0123456789ABCDEF0123456789")) === null);
  periksa("token berisi huruf di luar heksadesimal ditolak", (await notaDariToken("z".repeat(32))) === null);
  periksa("id nota bukan pengganti token", (await notaDariToken(notaA.id)) === null);

  // Status mengikuti perpindahan tahap.
  const sebelum = await notaDariToken(notaA.tokenPublik);
  const pindah = await pindahTahap(tokoA, a.data.userId, notaA.id, "dikerjakan");
  periksa("nota dipindah untuk uji status", pindah.ok, pindah.pesan);
  const sesudah = await notaDariToken(notaA.tokenPublik);
  periksa("status di halaman publik ikut berubah", sesudah?.stage === "dikerjakan", sesudah?.stage);
  periksa(
    "waktu pembaruan maju",
    new Date(sesudah!.diperbaruiPada).getTime() >= new Date(sebelum!.diperbaruiPada).getTime(),
  );

  // Nota yang diarsipkan: tautannya tidak boleh mati diam-diam.
  await db.serviceOrder.update({ where: { id: notaA.id }, data: { diarsipPada: new Date() } });
  periksa("tautan nota yang diarsipkan masih hidup", (await notaDariToken(notaA.tokenPublik)) !== null);

  // Bersihkan.
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
