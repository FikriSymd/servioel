"use client";

import { useState } from "react";
import { ServiceCardView } from "./ServiceCardView";
import { STAGES, stageLabel } from "@/lib/stages";
import type { ServiceOrder, StageId } from "@/lib/types";

type Props = {
  orders: ServiceOrder[];
  onBuka: (id: string) => void;
};

/**
 * Papan versi HP: satu tahap tampil penuh, tahap lain jadi pemilih yang
 * bisa digeser. Enam kolom tidak mungkin berdampingan di layar HP, dan
 * drag di layar kecil tidak nyaman, jadi jalur utama di sini adalah ketuk
 * kartu lalu pindah tahap dari detail.
 */
export function MobileStageList({ orders, onBuka }: Props) {
  const [aktif, setAktif] = useState<StageId>("barang-masuk");
  const tahap = STAGES.find((s) => s.id === aktif)!;
  const isi = orders.filter((o) => o.stage === aktif);

  return (
    <div className="lg:hidden">
      <div
        role="group"
        aria-label="Pilih tahap"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2"
      >
        {STAGES.map((s) => {
          const jumlah = orders.filter((o) => o.stage === s.id).length;
          const terpilih = s.id === aktif;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={terpilih}
              onClick={() => setAktif(s.id)}
              className={[
                "flex min-h-11 shrink-0 items-center gap-2 rounded-control border px-3 text-sm font-semibold",
                terpilih
                  ? "border-struct bg-struct text-paper"
                  : "border-line-strong bg-surface",
              ].join(" ")}
            >
              {s.label}
              <span className="angka text-xs opacity-80">{jumlah}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <p className="text-sm text-muted">{tahap.arti}</p>

        {isi.length === 0 ? (
          <p className="mt-3 rounded-card border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            Belum ada unit di tahap {tahap.label}. Buka kartu dari tahap lain lalu
            pindahkan ke sini.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {isi.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => onBuka(o.id)}
                  aria-label={`${o.nomor}, ${o.pelanggan}, tahap ${stageLabel(o.stage)}. Buka detail.`}
                  className="block min-h-11 w-full text-left"
                >
                  <ServiceCardView order={o} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
