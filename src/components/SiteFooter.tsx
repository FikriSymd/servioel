import Link from "next/link";

// Satu kolom, bukan empat kolom template. Isinya hanya tautan yang benar-benar ada.
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted">
          <span className="font-semibold text-ink">Servioel</span>{" "}
          papan servis untuk toko HP dan elektronik.
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link
            href="/papan"
            className="inline-flex min-h-11 min-w-11 items-center font-medium hover:underline"
          >
            Papan contoh
          </Link>
          <Link
            href="/masuk"
            className="inline-flex min-h-11 min-w-11 items-center font-medium hover:underline"
          >
            Masuk
          </Link>
          <span className="inline-flex min-h-11 items-center text-muted">
            Kontak: <span className="ml-1 font-semibold">[EMAIL KONTAK]</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
