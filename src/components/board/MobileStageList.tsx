"use client";

import { useEffect, useRef, useState } from "react";
import { ServiceCardView } from "./ServiceCardView";
import { STAGES, stageLabel } from "@/lib/stages";
import type { ServiceOrder, StageId } from "@/lib/types";

type Props = {
  orders: ServiceOrder[];
  onBuka: (id: string) => void;
  /** Kueri pencarian yang sedang aktif. Dipakai untuk melompat ke hasil. */
  kueri?: string;
};

/**
 * Papan versi HP: satu tahap tampil penuh, tahap lain jadi pemilih yang bisa
 * digeser ke samping. Enam lajur tidak mungkin berdampingan di layar HP, dan
 * menyeret di layar kecil tidak nyaman, jadi jalur utama di sini adalah buka
 * notanya lalu pindah tahap dari tombol di dalamnya.
 *
 * Saat mencari, hasilnya bisa ada di tahap lain. Daripada menyuruh orang
 * menebak tab mana, tahap yang dibuka ikut melompat ke tahap pertama yang punya
 * hasil, dan itu hanya terjadi saat kuerinya berubah. Kalau tidak begitu, menekan
 * tab yang kosong saat mencari akan langsung terlempar balik, dan itu bikin bingung.
 */
export function MobileStageList({ orders, onBuka, kueri = "" }: Props) {
  const [aktif, setAktif] = useState<StageId>("barang-masuk");
  const kueriSebelumnya = useRef(kueri);

  useEffect(() => {
    if (kueri === kueriSebelumnya.current) return;
    kueriSebelumnya.current = kueri;
    setAktif((lama) => {
      if (orders.some((o) => o.stage === lama)) return lama;
      return STAGES.find((s) => orders.some((o) => o.stage === s.id))?.id ?? lama;
    });
  }, [kueri, orders]);

  const tahap = STAGES.find((s) => s.id === aktif)!;
  const isi = orders.filter((o) => o.stage === aktif);
  const sedangCari = kueri.trim().length > 0;

  return (
    <div className="lg:hidden">
      <div
        role="group"
        aria-label="Pilih tahap"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-2"
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
                "flex min-h-11 shrink-0 items-center gap-2 rounded-control border px-3 text-sm",
                terpilih
                  ? "border-signal bg-signal font-bold text-ink"
                  : "border-bench-line text-bench-muted",
              ].join(" ")}
            >
              {s.label}
              <span className="angka text-[12px] opacity-75">{jumlah}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <p className="text-[13px] text-bench-muted">{tahap.arti}</p>

        {isi.length === 0 ? (
          <p className="mt-3 rounded-ticket border border-dashed border-bench-line px-4 py-8 text-center text-sm text-bench-muted">
            {sedangCari
              ? `Tidak ada unit yang cocok di tahap ${tahap.label}.`
              : `Belum ada unit di tahap ${tahap.label}. Buka nota dari tahap lain lalu pindahkan ke sini.`}
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {isi.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => onBuka(o.id)}
                  aria-label={`${o.nomor}, ${o.perangkat}, ${o.pelanggan}, tahap ${stageLabel(o.stage)}. Buka detail.`}
                  className="block min-h-11 w-full rounded-ticket text-left"
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
