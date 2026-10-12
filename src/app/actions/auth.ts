"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatSesi, hapusSesi } from "@/lib/auth";
import { daftarToko, masukDenganKataSandi } from "@/lib/toko";

/**
 * Bentuk keadaan yang dikembalikan form. Dipakai `useActionState` supaya pesan
 * galat muncul di form yang sama, tanpa memuat ulang halaman.
 */
export type FormState = { pesan: string } | undefined;

function teks(formData: FormData, nama: string): string {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai : "";
}

export async function aksiMasuk(_state: FormState, formData: FormData): Promise<FormState> {
  const email = teks(formData, "email");
  const kataSandi = teks(formData, "kataSandi");

  if (!email.trim()) return { pesan: "Email belum diisi." };
  if (!kataSandi) return { pesan: "Kata sandi belum diisi." };

  const hasil = await masukDenganKataSandi(email, kataSandi);
  if (!hasil.ok) return { pesan: hasil.pesan };

  await buatSesi(hasil.data.userId);
  revalidatePath("/", "layout");
  redirect("/app");
}

export async function aksiDaftar(_state: FormState, formData: FormData): Promise<FormState> {
  const namaToko = teks(formData, "namaToko");
  const namaPemilik = teks(formData, "namaPemilik");
  const email = teks(formData, "email");
  const kataSandi = teks(formData, "kataSandi");
  const ulangi = teks(formData, "ulangiKataSandi");

  if (!namaToko.trim()) return { pesan: "Nama toko belum diisi." };
  if (!namaPemilik.trim()) return { pesan: "Nama Anda belum diisi." };
  if (!email.trim()) return { pesan: "Email belum diisi." };
  if (kataSandi !== ulangi) return { pesan: "Kata sandi dan ulangannya tidak sama." };

  const hasil = await daftarToko({ namaToko, namaPemilik, email, kataSandi });
  if (!hasil.ok) return { pesan: hasil.pesan };

  await buatSesi(hasil.data.userId);
  revalidatePath("/", "layout");
  redirect("/app");
}

export async function aksiKeluar(): Promise<void> {
  await hapusSesi();
  revalidatePath("/", "layout");
  redirect("/masuk");
}
