import Link from "next/link";

/** Satu baris, bukan empat kolom. Isinya cuma tautan yang benar-benar ada. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-bench-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-[13px] text-bench-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Servioel. Papan servis untuk toko HP dan elektronik.{" "}
          <span className="text-bench-text">Masih tahap contoh.</span>
        </p>
        <Link
          href="/papan"
          className="inline-flex min-h-11 min-w-11 items-center text-bench-text underline decoration-bench-line underline-offset-4"
        >
          Buka papan contoh
        </Link>
      </div>
    </footer>
  );
}
