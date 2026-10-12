"use client";

import { useEffect, useRef } from "react";
import { STAGES, hariDiTahap, stageLabel } from "@/lib/stages";
import type { ServiceOrder, StageId } from "@/lib/types";

type Props = {
  order: ServiceOrder;
  onTutup: () => void;
  onPindah: (id: string, ke: StageId) => void;
};

function umurRelatif(iso: string): string {
  const hari = hariDiTahap(iso);
  if (hari === 0) return "hari ini";
  return `${hari} hari lalu`;
}

/**
 * Detail kartu. Di laptop tampil sebagai panel samping, di HP sebagai
 * lembaran bawah. Di sinilah jalur pindah tahap untuk HP dan keyboard:
 * tombol per tahap, jadi tidak bergantung pada drag.
 */
export function CardDetail({ order, onTutup, onPindah }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const tombolTutupRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sebelumnya = document.activeElement as HTMLElement | null;
    tombolTutupRef.current?.focus();
    return () => sebelumnya?.focus?.();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onTutup();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const fokusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (fokusable.length === 0) return;
      const pertama = fokusable[0];
      const terakhir = fokusable[fokusable.length - 1];
      if (e.shiftKey && document.activeElement === pertama) {
        e.preventDefault();
        terakhir.focus();
      } else if (!e.shiftKey && document.activeElement === terakhir) {
        e.preventDefault();
        pertama.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onTutup]);

  const hari = hariDiTahap(order.masukTahapPada);
  const riwayatTerbaru = [...order.riwayat].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-stretch">
      <button
        type="button"
        aria-label="Tutup detail"
        onClick={onTutup}
        className="absolute inset-0 bg-ink/40"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail ${order.nomor}`}
        className="relative flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-card border border-line-strong bg-paper shadow-2xl sm:max-h-none sm:h-full sm:w-[26rem] sm:rounded-none sm:border-y-0 sm:border-r-0"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="angka text-xl font-extrabold tracking-tight">
              {order.nomor}
            </p>
            <p className="mt-0.5 text-sm text-muted">
              Tahap sekarang: <span className="font-semibold text-ink">{stageLabel(order.stage)}</span>
              {hari >= 1 && <> , {hari} hari di tahap ini</>}
            </p>
          </div>
          <button
            ref={tombolTutupRef}
            type="button"
            onClick={onTutup}
            className="min-h-11 shrink-0 rounded-control border border-line-strong px-3 text-sm font-semibold"
          >
            Tutup
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-4">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted">
              Pelanggan
            </h3>
            <p className="mt-1 text-base font-semibold">{order.pelanggan}</p>
            <p className="angka mt-0.5 text-sm text-muted">{order.telepon}</p>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted">
              Keluhan
            </h3>
            <p className="mt-1 text-sm">{order.keluhan}</p>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted">
              Pindah tahap
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {STAGES.map((s) => {
                const sekarang = s.id === order.stage;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      disabled={sekarang}
                      aria-current={sekarang ? "step" : undefined}
                      onClick={() => onPindah(order.id, s.id)}
                      className={[
                        "flex min-h-11 w-full items-center justify-between gap-3 rounded-control border px-3 text-left text-sm",
                        sekarang
                          ? "border-struct bg-struct font-semibold text-paper"
                          : "border-line-strong bg-surface font-medium hover:border-accent",
                      ].join(" ")}
                    >
                      <span>{s.label}</span>
                      {sekarang && <span className="text-xs">sekarang</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted">
              Riwayat perpindahan
            </h3>
            <ol className="mt-2 flex flex-col gap-2">
              {riwayatTerbaru.map((m) => (
                <li
                  key={m.id}
                  className="rounded-card border border-line bg-surface px-3 py-2 text-xs"
                >
                  <p className="font-semibold">
                    {m.dari ? `${stageLabel(m.dari)} ke ${stageLabel(m.ke)}` : `Masuk ke ${stageLabel(m.ke)}`}
                  </p>
                  <p className="mt-0.5 text-muted">
                    {umurRelatif(m.pada)}, dicatat oleh {m.oleh}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
