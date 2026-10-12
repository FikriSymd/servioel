import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// scrypt dipakai karena ada di Node sendiri, jadi tidak perlu paket tambahan dan
// tidak ada modul native yang harus dikompilasi. Parameternya di bawah rekomendasi
// OWASP untuk scrypt (N=2^14, r=8, p=1).
const scrypt = promisify(scryptCallback) as (
  sandi: string | Buffer,
  garam: string | Buffer,
  panjang: number,
  opsi: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const PANJANG_KUNCI = 64;
const MAXMEM = 64 * 1024 * 1024;

/**
 * Hasilnya menyimpan parameternya sendiri, jadi kalau parameter dinaikkan nanti,
 * kata sandi lama tetap bisa diverifikasi.
 */
export async function hashKataSandi(sandi: string): Promise<string> {
  const garam = randomBytes(16);
  const kunci = await scrypt(sandi.normalize("NFKC"), garam, PANJANG_KUNCI, {
    N,
    r: R,
    p: P,
    maxmem: MAXMEM,
  });
  return `scrypt$${N}$${R}$${P}$${garam.toString("base64")}$${kunci.toString("base64")}`;
}

export async function cocokKataSandi(sandi: string, tersimpan: string): Promise<boolean> {
  const bagian = tersimpan.split("$");
  if (bagian.length !== 6 || bagian[0] !== "scrypt") return false;

  const [, sN, sR, sP, garamB64, kunciB64] = bagian;
  const garam = Buffer.from(garamB64, "base64");
  const kunciTersimpan = Buffer.from(kunciB64, "base64");
  if (garam.length === 0 || kunciTersimpan.length === 0) return false;

  const kunci = await scrypt(sandi.normalize("NFKC"), garam, kunciTersimpan.length, {
    N: Number(sN),
    r: Number(sR),
    p: Number(sP),
    maxmem: MAXMEM,
  });

  // Dibandingkan dalam waktu tetap supaya lama proses tidak membocorkan isi kunci.
  return kunci.length === kunciTersimpan.length && timingSafeEqual(kunci, kunciTersimpan);
}

/** Syarat kata sandi minimum. Dijalankan di server, bukan hanya di tampilan. */
export function periksaKekuatanSandi(sandi: string): string | null {
  if (sandi.length < 8) return "Kata sandi minimal 8 karakter.";
  if (!/[a-zA-Z]/.test(sandi)) return "Kata sandi harus memuat huruf.";
  if (!/[0-9]/.test(sandi)) return "Kata sandi harus memuat angka.";
  return null;
}
