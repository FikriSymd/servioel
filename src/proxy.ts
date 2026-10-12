import { NextResponse, type NextRequest } from "next/server";

/**
 * Di Next 16, berkas ini dulu bernama `middleware.ts`. Namanya sekarang `proxy.ts`
 * dan fungsinya `proxy`. Kalau namanya masih middleware, berkasnya diabaikan
 * tanpa peringatan, dan pengamanan rute diam-diam berhenti bekerja.
 *
 * Yang dikerjakan di sini cuma pemeriksaan cepat: ada tidaknya cookie sesi.
 * Ini bukan pengaman yang sebenarnya, cuma supaya pengunjung yang belum masuk
 * tidak melihat kerangka aplikasi dulu. Pemeriksaan yang sungguhan ada di
 * src/lib/dal.ts, di dekat datanya, dan tiap query tetap disaring per toko.
 */
const RUTE_PRIBADI = ["/app"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const perluMasuk = RUTE_PRIBADI.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!perluMasuk) return NextResponse.next();

  const adaCookie = Boolean(req.cookies.get("servioel_sesi")?.value);
  if (adaCookie) return NextResponse.next();

  const url = new URL("/masuk", req.nextUrl);
  url.searchParams.set("lanjut", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Semua rute, kecuali berkas statis dan gambar, supaya pemeriksaannya murah.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
