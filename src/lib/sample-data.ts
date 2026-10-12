import type { ServiceOrder, StageMove, StageId } from "./types";

/*
  DATA CONTOH, bukan data toko nyata.
  Dipakai supaya papan dan drag-and-drop bisa dicoba sebelum masuk ke akun toko.
  Nama pelanggan sengaja generik ("Pelanggan A") supaya tidak terbaca sebagai
  pelanggan sungguhan. Papan yang dipakai kerja mengambil datanya dari
  PostgreSQL, bukan dari berkas ini.
*/

const HARI = 86_400_000;

function iso(hariLalu: number): string {
  return new Date(Date.now() - hariLalu * HARI).toISOString();
}

let urutRiwayat = 0;
function langkah(dari: StageId | null, ke: StageId, hariLalu: number): StageMove {
  urutRiwayat += 1;
  return {
    id: `rw-${urutRiwayat}`,
    pada: iso(hariLalu),
    dari,
    ke,
    oleh: "Kasir (contoh)",
  };
}

function kartu(
  n: number,
  perangkat: string,
  pelanggan: string,
  telepon: string,
  keluhan: string,
  stage: StageId,
  masukTahapHariLalu: number,
  dibuatHariLalu: number,
  riwayat: StageMove[],
): ServiceOrder {
  return {
    id: `so-${n}`,
    nomor: `SV-2026-${String(n).padStart(4, "0")}`,
    perangkat,
    pelanggan,
    telepon,
    keluhan,
    stage,
    masukTahapPada: iso(masukTahapHariLalu),
    dibuatPada: iso(dibuatHariLalu),
    riwayat,
  };
}

export function buatDataContoh(): ServiceOrder[] {
  urutRiwayat = 0;
  return [
    kartu(
      8,
      "Samsung Galaxy A54",
      "Pelanggan A",
      "0812-0000-0008",
      "Layar retak, bagian sentuh bawah tidak responsif.",
      "barang-masuk",
      0,
      0,
      [langkah(null, "barang-masuk", 0)],
    ),
    kartu(
      7,
      "Xiaomi Redmi Note 12",
      "Pelanggan B",
      "0812-0000-0007",
      "Baterai cepat habis, badan hangat saat dicas.",
      "barang-masuk",
      1,
      1,
      [langkah(null, "barang-masuk", 1)],
    ),
    kartu(
      6,
      "iPhone 11",
      "Pelanggan C",
      "0812-0000-0006",
      "Tidak mau menyala, dicas tidak ada tanda apa pun.",
      "diagnosa",
      1,
      2,
      [langkah(null, "barang-masuk", 2), langkah("barang-masuk", "diagnosa", 1)],
    ),
    kartu(
      5,
      "Oppo A57",
      "Pelanggan D",
      "0812-0000-0005",
      "Suara panggilan masuk tidak terdengar.",
      "diagnosa",
      2,
      3,
      [langkah(null, "barang-masuk", 3), langkah("barang-masuk", "diagnosa", 2)],
    ),
    kartu(
      4,
      "Realme C55",
      "Pelanggan E",
      "0812-0000-0004",
      "Sudah ketahuan: modul cas rusak. Part dipesan.",
      "nunggu-sparepart",
      5,
      8,
      [
        langkah(null, "barang-masuk", 8),
        langkah("barang-masuk", "diagnosa", 7),
        langkah("diagnosa", "nunggu-sparepart", 5),
      ],
    ),
    kartu(
      3,
      "Vivo Y17",
      "Pelanggan F",
      "0812-0000-0003",
      "Kamera belakang buram, kaca kamera tergores.",
      "dikerjakan",
      2,
      6,
      [
        langkah(null, "barang-masuk", 6),
        langkah("barang-masuk", "diagnosa", 4),
        langkah("diagnosa", "dikerjakan", 2),
      ],
    ),
    kartu(
      2,
      "Asus Zenfone 8",
      "Pelanggan G",
      "0812-0000-0002",
      "Ganti konektor cas, unit sudah bisa dicas normal.",
      "selesai",
      1,
      5,
      [
        langkah(null, "barang-masuk", 5),
        langkah("barang-masuk", "diagnosa", 3),
        langkah("diagnosa", "dikerjakan", 2),
        langkah("dikerjakan", "selesai", 1),
      ],
    ),
    kartu(
      1,
      "Laptop Lenovo Ideapad 3",
      "Pelanggan H",
      "0812-0000-0001",
      "Ganti LCD, sudah diserahkan dan dibayar.",
      "sudah-diambil",
      0,
      4,
      [
        langkah(null, "barang-masuk", 4),
        langkah("barang-masuk", "diagnosa", 3),
        langkah("diagnosa", "dikerjakan", 2),
        langkah("dikerjakan", "selesai", 1),
        langkah("selesai", "sudah-diambil", 0),
      ],
    ),
  ];
}

/** Dipakai di landing page sebagai pratinjau papan, tanpa interaksi. */
export function buatPratinjauSingkat(): ServiceOrder[] {
  const semua = buatDataContoh();
  const pilih: Record<StageId, number> = {
    "barang-masuk": 2,
    diagnosa: 1,
    "nunggu-sparepart": 1,
    dikerjakan: 1,
    selesai: 1,
    "sudah-diambil": 0,
  };
  return semua.filter((o) => {
    if (pilih[o.stage] > 0) {
      pilih[o.stage] -= 1;
      return true;
    }
    return false;
  });
}
