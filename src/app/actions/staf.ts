"use server";

import { revalidatePath } from "next/cache";
import { sesiUntukAksi } from "@/lib/dal";
import { daftarStaf, setelUlangKataSandi, tambahStaf, ubahAktifStaf } from "@/lib/toko";
import type { StafRingkas } from "@/lib/toko";

export type HasilStaf = {
  ok: boolean;
  pesan: string;
  staf: StafRingkas[];
};

const TIDAK_MASUK: HasilStaf = {
  ok: false,
  pesan: "Sesi Anda sudah berakhir. Masuk ulang untuk melanjutkan.",
  staf: [],
};

/**
 * Semua aksi staf memeriksa peran di server. Pemilik toko saja yang boleh
 * mengelola akun. Pemeriksaan ini tidak bergantung pada tampilan, jadi
 * menyembunyikan tombol bukan satu-satunya pengaman.
 */
async function sesiPemilik() {
  const sesi = await sesiUntukAksi();
  if (!sesi) return { sesi: null, galat: TIDAK_MASUK } as const;
  if (sesi.user.peran !== "owner") {
    return {
      sesi: null,
      galat: {
        ok: false,
        pesan: "Hanya pemilik toko yang bisa mengelola akun staf.",
        staf: await daftarStaf(sesi.toko.id),
      },
    } as const;
  }
  return { sesi, galat: null } as const;
}

export async function aksiTambahStaf(data: {
  nama: string;
  email: string;
  peran: string;
  kataSandi: string;
}): Promise<HasilStaf> {
  const { sesi, galat } = await sesiPemilik();
  if (!sesi) return galat;

  const hasil = await tambahStaf(sesi.toko.id, data);
  revalidatePath("/app/staf");
  return { ok: hasil.ok, pesan: hasil.pesan, staf: await daftarStaf(sesi.toko.id) };
}

export async function aksiUbahAktifStaf(
  stafId: string,
  aktif: boolean,
): Promise<HasilStaf> {
  const { sesi, galat } = await sesiPemilik();
  if (!sesi) return galat;

  const hasil = await ubahAktifStaf(sesi.toko.id, stafId, aktif);
  revalidatePath("/app/staf");
  return { ok: hasil.ok, pesan: hasil.pesan, staf: await daftarStaf(sesi.toko.id) };
}

export async function aksiSetelUlangSandi(
  stafId: string,
  kataSandiBaru: string,
): Promise<HasilStaf> {
  const { sesi, galat } = await sesiPemilik();
  if (!sesi) return galat;

  const hasil = await setelUlangKataSandi(sesi.toko.id, stafId, kataSandiBaru);
  revalidatePath("/app/staf");
  return { ok: hasil.ok, pesan: hasil.pesan, staf: await daftarStaf(sesi.toko.id) };
}
