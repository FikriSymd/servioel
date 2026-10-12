import Link from "next/link";

/**
 * Halaman yang tidak ditemukan.
 *
 * Dipakai antara lain kalau tautan status pelanggan salah ketik atau sudah
 * tidak berlaku. Pesannya sengaja tidak membocorkan apa pun: tidak ada
 * keterangan apakah nomornya pernah ada, cuma bahwa halaman ini tidak ada.
 */
export default function TidakDitemukan() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <p className="angka font-display text-[13px] font-bold text-bench-muted">
          404
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-bench-text">
          Halaman ini tidak ada
        </h1>
        <p className="mt-2 text-sm text-bench-muted">
          Alamatnya mungkin salah ketik, atau tautannya sudah tidak dipakai lagi.
          Kalau ini tautan status dari nota servis, periksa lagi alamat yang
          tertulis di notanya.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
        >
          Kembali ke halaman depan
        </Link>
      </div>
    </main>
  );
}
