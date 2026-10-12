"use client";

import Link from "next/link";
import { useActionState } from "react";
import { aksiMasuk, type FormState } from "@/app/actions/auth";

const kelasIsian =
  "mt-1.5 min-h-11 w-full rounded-control border border-paper-edge bg-paper px-3 text-sm text-ink";

export function FormMasuk() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    aksiMasuk,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="m-email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="m-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={kelasIsian}
        />
      </div>

      <div>
        <label htmlFor="m-sandi" className="text-sm font-semibold">
          Kata sandi
        </label>
        <input
          id="m-sandi"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
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
        {pending ? "Sedang masuk..." : "Masuk"}
      </button>

      <Link
        href="/daftar"
        className="inline-flex min-h-11 items-center justify-center rounded-control border border-paper-edge px-4 text-sm font-semibold text-ink hover:border-ink"
      >
        Belum punya akun toko? Daftarkan toko
      </Link>
    </form>
  );
}
