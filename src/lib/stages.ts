import type { StageId } from "./types";

export type Stage = {
  id: StageId;
  label: string;
  /** Kalimat pendek: apa artinya kalau unit ada di sini. Dipakai di petunjuk kolom. */
  arti: string;
};

// Urutan mengikuti alur kerja nyata toko servis, bukan tiga kolom template.
export const STAGES: Stage[] = [
  {
    id: "barang-masuk",
    label: "Barang Masuk",
    arti: "Unit sudah diterima, belum diperiksa.",
  },
  {
    id: "diagnosa",
    label: "Diagnosa",
    arti: "Sedang dicari tahu kerusakannya.",
  },
  {
    id: "nunggu-sparepart",
    label: "Nunggu Sparepart",
    arti: "Sudah ketahuan rusaknya, tinggal nunggu part datang.",
  },
  {
    id: "dikerjakan",
    label: "Dikerjakan",
    arti: "Part ada, unit sedang diperbaiki.",
  },
  {
    id: "selesai",
    label: "Selesai",
    arti: "Sudah beres, menunggu pelanggan ambil.",
  },
  {
    id: "sudah-diambil",
    label: "Sudah Diambil",
    arti: "Sudah diserahkan ke pelanggan.",
  },
];

const BY_ID = new Map(STAGES.map((s) => [s.id, s]));

export function stageLabel(id: StageId): string {
  return BY_ID.get(id)?.label ?? id;
}

export function stageIndex(id: StageId): number {
  return STAGES.findIndex((s) => s.id === id);
}

/** Ambang "nyangkut": lewat ini, kartu ditandai supaya kelihatan tanpa dicari. */
export const AMBANG_NYANGKUT_HARI = 3;

export function hariDiTahap(masukTahapPada: string, sekarang = new Date()): number {
  const ms = sekarang.getTime() - new Date(masukTahapPada).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
