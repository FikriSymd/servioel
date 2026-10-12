"use client";

import Link from "next/link";
import { useActionState } from "react";
import { aksiDaftar, type FormState } from "@/app/actions/auth";

const kelasIsian =
  "mt-1.5 min-h-11 w-full rounded-control border border-paper-edge bg-paper px-3 text-sm text-ink";

export function FormDaftar() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    aksiDaftar,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="d-toko" className="text-sm font-semibold">
          Nama toko
        </label>
        <input
          id="d-toko"
          name="namaToko"
          autoComplete="organization"
          required
          className={kelasIsian}
        />
        <p className="mt-1 text-[12px] text-ink-muted">
          Nama yang dilihat staf Anda di kepala halaman.
        </p>
      </div>

      <div>
        <label htmlFor="d-nama" className="text-sm font-semibold">
          Nama Anda
        </label>
        <input id="d-nama" name="namaPemilik" autoComplete="name" required className={kelasIsian} />
      </div>

      <div>
        <label htmlFor="d-email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="d-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={kelasIsian}
        />
      </div>

      <div>
        <label htmlFor="d-sandi" className="text-sm font-semibold">
          Kata sandi
        </label>
        <input
          id="d-sandi"
          name="kataSandi"
          type="password"
          autoComplete="new-password"
          required
          className={kelasIsian}
        />
        <p className="mt-1 text-[12px] text-ink-muted">
          Minimal 8 karakter, harus ada huruf dan angka.
        </p>
      </div>

      <div>
        <label htmlFor="d-sandi2" className="text-sm font-semibold">
          Ulangi kata sandi
        </label>
        <input
          id="d-sandi2"
          name="ulangiKataSandi"
          type="password"
          autoComplete="new-password"
          required
          className={kelasIsian}
        />
      </div>

      {state?.pesan && (
        <p role="alert" className="text-[13px] font-semibold text-signal-ink">
          {state.pesan}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "Sedang membuat toko..." : "Buat toko"}
      </button>

      <Link
        href="/masuk"
        className="inline-flex min-h-11 items-center justify-center rounded-control border border-paper-edge px-4 text-sm font-semibold text-ink hover:border-ink"
      >
        Sudah punya akun? Masuk
      </Link>
    </form>
  );
}
