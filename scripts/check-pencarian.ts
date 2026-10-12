/*
  Uji logika pencarian papan. Murni, tidak menyentuh basis data, jadi bisa
  dijalankan kapan saja.

  Jalankan: npx tsx scripts/check-pencarian.ts
*/

import { cocokCari, saringPesanan, samakan } from "../src/lib/pencarian";
import type { ServiceOrder } from "../src/lib/types";

let gagal = 0;

function periksa(nama: string, lulus: boolean, catatan = "") {
  console.log(`${lulus ? "LULUS" : "GAGAL"}  ${nama}${catatan ? `  (${catatan})` : ""}`);
  if (!lulus) gagal += 1;
}

function nota(isi: Partial<ServiceOrder>): ServiceOrder {
  return {
    id: isi.id ?? "x",
    nomor: isi.nomor ?? "SV-2026-0001",
    perangkat: isi.perangkat ?? "Samsung Galaxy A54",
    pelanggan: isi.pelanggan ?? "Budi Santoso",
    telepon: isi.telepon ?? "0812-3456-7890",
    keluhan: isi.keluhan ?? "Layar retak.",
    stage: isi.stage ?? "barang-masuk",
    masukTahapPada: isi.masukTahapPada ?? new Date().toISOString(),
    dibuatPada: isi.dibuatPada ?? new Date().toISOString(),
    riwayat: isi.riwayat ?? [],
  };
}

const data = [
  nota({ id: "a", nomor: "SV-2026-0001", perangkat: "Samsung Galaxy A54", pelanggan: "Budi Santoso", telepon: "0812-3456-7890", stage: "barang-masuk" }),
  nota({ id: "b", nomor: "SV-2026-0002", perangkat: "iPhone 12", pelanggan: "Rina Wati", telepon: "0813-2222-1111", stage: "diagnosa" }),
  nota({ id: "c", nomor: "SV-2026-0003", perangkat: "Laptop Lenovo Ideapad 3", pelanggan: "Yusuf", telepon: "0857-8888-9999", stage: "dikerjakan" }),
];

// Normalisasi
periksa("spasi dan tanda hubung dibuang", samakan("0812-3456 7890") === "081234567890", samakan("0812-3456 7890"));
periksa("huruf besar-kecil diabaikan", samakan("BUDI") === "budi");
periksa("tanda kurung dan titik dibuang", samakan("(0812) 345.67") === "081234567");

// Pencarian per nama
periksa("cari nama pelanggan utuh", saringPesanan(data, "Rina Wati").length === 1);
periksa("cari potongan nama pelanggan", saringPesanan(data, "wati").map((o) => o.id).join() === "b");
periksa("cari nama tanpa memperhatikan huruf besar", saringPesanan(data, "BUDI").map((o) => o.id).join() === "a");
periksa("cari nama tanpa spasi tetap cocok", saringPesanan(data, "budisan").map((o) => o.id).join() === "a");

// Pencarian per nomor HP, dengan bentuk tulisan berbeda
periksa("cari nomor HP apa adanya", saringPesanan(data, "0812-3456-7890").map((o) => o.id).join() === "a");
periksa("cari nomor HP tanpa tanda hubung", saringPesanan(data, "081234567890").map((o) => o.id).join() === "a");
periksa("cari nomor HP dengan spasi", saringPesanan(data, "0812 3456").map((o) => o.id).join() === "a");
periksa("cari potongan nomor HP", saringPesanan(data, "2222").map((o) => o.id).join() === "b");

// Pencarian per perangkat
periksa("cari perangkat utuh", saringPesanan(data, "iPhone 12").map((o) => o.id).join() === "b");
periksa("cari merek perangkat", saringPesanan(data, "lenovo").map((o) => o.id).join() === "c");
periksa("cari tipe perangkat", saringPesanan(data, "ideapad").map((o) => o.id).join() === "c");

// Pencarian per nomor nota
periksa("cari nomor nota", saringPesanan(data, "SV-2026-0002").map((o) => o.id).join() === "b");
periksa("cari potongan nomor nota", saringPesanan(data, "0003").map((o) => o.id).join() === "c");

// Kueri kosong tidak menyembunyikan apa pun
periksa("kueri kosong mengembalikan semua", saringPesanan(data, "").length === 3);
periksa("kueri hanya spasi mengembalikan semua", saringPesanan(data, "   ").length === 3);

// Yang tidak ketemu memang tidak ketemu
periksa("kueri tanpa hasil mengembalikan kosong", saringPesanan(data, "zzzz").length === 0);
periksa("kueri tidak cocok ke keluhan (memang tidak dicari)", saringPesanan(data, "layar retak").length === 0);

// Pencocokan langsung
periksa("cocokCari pada satu nota", cocokCari(data[0], "081234567890") && !cocokCari(data[1], "081234567890"));

console.log(gagal === 0 ? "\nSEMUA LULUS" : `\n${gagal} PEMERIKSAAN GAGAL`);
process.exit(gagal === 0 ? 0 : 1);
