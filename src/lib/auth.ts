import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { db } from "./db";

const NAMA_COOKIE = "servioel_sesi";
const UMUR_HARI = 30;

/**
 * Token sesi disimpan di cookie, dan yang masuk database cuma hash-nya.
 * Jadi isi database tidak cukup untuk memakai sesi orang lain.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Cookie `secure` hanya dipasang kalau permintaannya memang lewat HTTPS.
 * Di belakang tunnel Cloudflare, `x-forwarded-proto` bernilai https, jadi cookie
 * tetap terkunci ke HTTPS untuk pengguna nyata. Saat diuji lokal lewat http,
 * cookie tidak dikunci supaya sesi masih bisa dipakai.
 */
async function lewatHttps(): Promise<boolean> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return false;
}

export async function buatSesi(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + UMUR_HARI * 86_400_000);

  await db.sesi.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });

  const jar = await cookies();
  jar.set(NAMA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: await lewatHttps(),
    expires: expiresAt,
    path: "/",
  });
}

export async function hapusSesi(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(NAMA_COOKIE)?.value;
  if (token) {
    await db.sesi.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  jar.delete(NAMA_COOKIE);
}

export type SesiAktif = {
  tokenHash: string;
  expiresAt: Date;
  user: {
    id: string;
    tokoId: string;
    nama: string;
    email: string;
    peran: string;
    aktif: boolean;
  };
  toko: { id: string; nama: string };
};

/**
 * Membaca sesi dari cookie lalu mencocokkannya ke database. Ini pemeriksaan
 * yang sebenarnya, bukan cuma melihat ada tidaknya cookie. Cookie yang dibuat
 * di tempat lain, atau sesi yang sudah dicabut, langsung ditolak di sini.
 */
export async function bacaSesi(): Promise<SesiAktif | null> {
  const jar = await cookies();
  const token = jar.get(NAMA_COOKIE)?.value;
  if (!token) return null;

  const sesi = await db.sesi.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        select: {
          id: true,
          tokoId: true,
          nama: true,
          email: true,
          peran: true,
          aktif: true,
          toko: { select: { id: true, nama: true } },
        },
      },
    },
  });

  if (!sesi) return null;
  if (sesi.expiresAt.getTime() <= Date.now()) {
    await db.sesi.delete({ where: { tokenHash: sesi.tokenHash } }).catch(() => {});
    return null;
  }
  if (!sesi.user.aktif) return null;

  return {
    tokenHash: sesi.tokenHash,
    expiresAt: sesi.expiresAt,
    user: {
      id: sesi.user.id,
      tokoId: sesi.user.tokoId,
      nama: sesi.user.nama,
      email: sesi.user.email,
      peran: sesi.user.peran,
      aktif: sesi.user.aktif,
    },
    toko: sesi.user.toko,
  };
}

/** Menghapus sesi kedaluwarsa. Dipanggil sesekali, bukan tiap permintaan. */
export async function bersihkanSesiKedaluwarsa(): Promise<void> {
  await db.sesi.deleteMany({ where: { expiresAt: { lte: new Date() } } });
}
