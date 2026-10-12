"use client";

import { AMBANG_NYANGKUT_HARI, hariDiTahap, stageLabel } from "@/lib/stages";
import type { ServiceOrder } from "@/lib/types";

type Props = {
  order: ServiceOrder;
  /** Umur dihitung dari waktu sekarang. Papan statis di halaman depan mematikan ini. */
  hitungUmur?: boolean;
};

/**
 * Satu nota servis. Ini unit tampilan terkecil dan yang paling sering dilihat.
 *
 * Susunannya meniru nota kertas: kepala berisi nomor, perforasi, lalu isi.
 * Kepala nota jadi penanda keadaan. Nota biasa berkepala tinta; nota yang
 * menginap di satu tahap berkepala kuning. Warnanya satu-satunya bedanya, jadi
 * kelihatan sambil menyapu pandangan, tanpa perlu membaca.
 *
 * Di isinya, perangkat ditulis paling tebal karena papan ini papan unit: yang
 * dicari teknisi lebih dulu adalah "ini barang apa", bukan "ini punya siapa".
 * Nama pelanggan menyusul di baris berikutnya.
 */
export function ServiceCardView({ order, hitungUmur = true }: Props) {
  const hari = hariDiTahap(order.masukTahapPada);
  const nyangkut =
    hitungUmur && hari >= AMBANG_NYANGKUT_HARI && order.stage !== "sudah-diambil";
  // Nota yang dibuat sebelum kolom perangkat ada tidak punya isinya. Nota
  // seperti itu kembali memakai susunan lama, bukan menampilkan baris kosong.
  const adaPerangkat = order.perangkat.trim().length > 0;

  return (
    <article className="overflow-hidden rounded-ticket border border-ink/15 bg-paper text-ink">
      <div
        className={[
          "flex items-baseline justify-between gap-2 px-3 py-1.5",
          nyangkut ? "bg-stuck" : "bg-ink text-paper",
        ].join(" ")}
      >
        <span className="angka font-display text-[13px] font-extrabold tracking-tight">
          {order.nomor}
        </span>
        <span
          className={[
            "angka text-[11px] font-semibold",
            nyangkut ? "text-ink" : "text-paper/80",
          ].join(" ")}
        >
          {hitungUmur ? `${hari} hari` : stageLabel(order.stage)}
        </span>
      </div>

      <div className="border-t border-dashed border-ink/30" />

      <div className="px-3 py-2.5">
        {adaPerangkat ? (
          <>
            <p className="truncate text-sm font-semibold leading-snug">{order.perangkat}</p>
            <p className="mt-0.5 truncate text-[13px] leading-snug text-ink/85">
              {order.pelanggan}
            </p>
          </>
        ) : (
          <p className="truncate text-sm font-semibold leading-snug">{order.pelanggan}</p>
        )}
        <p className="angka mt-0.5 text-[12px] text-ink-muted">{order.telepon}</p>
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink/85">
          {order.keluhan}
        </p>
      </div>
    </article>
  );
}
