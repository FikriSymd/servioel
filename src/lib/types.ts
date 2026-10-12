export type StageId =
  | "barang-masuk"
  | "diagnosa"
  | "nunggu-sparepart"
  | "dikerjakan"
  | "selesai"
  | "sudah-diambil";

/** Satu perpindahan tahap. Dipakai untuk riwayat yang bisa ditelusuri. */
export type StageMove = {
  id: string;
  pada: string; // ISO
  dari: StageId | null;
  ke: StageId;
  oleh: string;
};

/** Satu unit servis = satu kartu di papan. */
export type ServiceOrder = {
  id: string;
  nomor: string; // nomor servis, contoh SV-2026-0007
  perangkat: string; // merek dan tipe unit, contoh Samsung Galaxy A54
  pelanggan: string;
  telepon: string;
  keluhan: string;
  stage: StageId;
  masukTahapPada: string; // ISO, kapan masuk tahap yang sekarang
  dibuatPada: string; // ISO
  riwayat: StageMove[];
};

export type BoardStatus = "memuat" | "siap" | "gagal";
