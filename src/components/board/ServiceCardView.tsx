"use client";

import { hariDiTahap, AMBANG_NYANGKUT_HARI } from "@/lib/stages";
import type { ServiceOrder } from "@/lib/types";

type Props = {
  order: ServiceOrder;
  /** Angka lama di tahap dihitung dari waktu sekarang; dimatikan saat pratinjau statis. */
  hitungUmur?: boolean;
};

/**
 * Tampilan satu kartu servis. Murni presentasi, tanpa perilaku.
 * Nomor servis jadi penanda utama kartu (motif identitas di docs/DESIGN.md).
 */
export function ServiceCardView({ order, hitungUmur = true }: Props) {
  const hari = hitungUmur ? hariDiTahap(order.masukTahapPada) : 0;
  const nyangkut = hitungUmur && hari >= AMBANG_NYANGKUT_HARI;

  return (
    <article className="rounded-card border border-line-strong bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="angka text-base font-extrabold tracking-tight">
          {order.nomor}
        </span>
      </div>

      <p className="mt-1.5 text-sm font-semibold">{order.pelanggan}</p>

      <p className="mt-1 line-clamp-2 text-sm text-muted">{order.keluhan}</p>

      <p className="angka mt-2 text-xs text-muted">{order.telepon}</p>

      {hitungUmur && hari >= 1 && (
        <p
          className={
            nyangkut
              ? "mt-2 text-xs font-semibold text-accent"
              : "mt-2 text-xs text-muted"
          }
        >
          {nyangkut ? `${hari} hari nyangkut di tahap ini` : `${hari} hari di tahap ini`}
        </p>
      )}
    </article>
  );
}
