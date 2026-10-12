/**
 * Peran pengguna. Ditaruh di modul terpisah tanpa `server-only` supaya komponen
 * tampilan bisa memakai labelnya, sementara pemeriksaan wewenangnya tetap
 * dijalankan di server.
 */
export const PERAN = ["owner", "teknisi", "kasir"] as const;
export type Peran = (typeof PERAN)[number];

export function isPeran(nilai: unknown): nilai is Peran {
  return typeof nilai === "string" && (PERAN as readonly string[]).includes(nilai);
}

export function labelPeran(peran: string): string {
  if (peran === "owner") return "Pemilik";
  if (peran === "teknisi") return "Teknisi";
  if (peran === "kasir") return "Kasir";
  return peran;
}

/** Peran yang boleh membuat dan memindahkan nota. Ketiganya boleh. */
export function bolehKelolaPapan(peran: string): boolean {
  return isPeran(peran);
}

/** Peran yang boleh mengelola akun staf dan mengarsipkan. */
export function bolehKelolaToko(peran: string): boolean {
  return peran === "owner";
}
