"use client";

import { useEffect, useRef } from "react";
import { BagikanNota } from "./BagikanNota";
import { STAGES, hariDiTahap, stageLabel } from "@/lib/stages";
import type { ServiceOrder, StageId } from "@/lib/types";

type Props = {
  order: ServiceOrder;
  onTutup: () => void;
  onPindah: (id: string, ke: StageId) => void;
  /** Membuka formulir pembetulan. Tidak ada di papan contoh tanpa server. */
  onUbah?: () => void;
  /**
   * Alamat halaman cetak nota ini. Kalau tidak diisi (papan contoh, yang tidak
   * punya baris di database), bagian cetak dan bagi tautan tidak ditampilkan
   * sama sekali, bukan ditampilkan lalu gagal.
   */
  tautanCetak?: string;
};

function umurRelatif(iso: string): string {
  const hari = hariDiTahap(iso);
  if (hari === 0) return "hari ini";
  return `${hari} hari lalu`;
}

/**
 * Nota yang dibuka: lembaran di sisi kanan pada laptop, lembaran bawah pada HP.
 * Di sinilah jalur pindah tahap untuk HP dan keyboard: satu tombol per tahap,
 * jadi tidak bergantung pada seret. Karena panelnya kertas, warna pilihannya
 * memakai tinta, dan cincin fokusnya oranye gelap.
 */
export function CardDetail({ order, onTutup, onPindah, onUbah, tautanCetak }: Props) {
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
        'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])',
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
        className="absolute inset-0 bg-black/60"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail ${order.nomor}`}
        className="on-paper relative flex max-h-[88vh] w-full flex-col overflow-y-auto border-l-2 border-signal bg-paper text-ink sm:max-h-none sm:h-full sm:w-[26rem]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-ink/30 px-4 py-3.5">
          <div>
            <p className="angka font-display text-2xl font-extrabold leading-none tracking-tight">
              {order.nomor}
            </p>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              Sekarang di{" "}
              <span className="font-semibold text-ink">{stageLabel(order.stage)}</span>
              {hari >= 1 && <>, {hari} hari</>}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {onUbah && (
              <button
                type="button"
                onClick={onUbah}
                className="min-h-11 rounded-control border border-paper-edge px-3 text-sm font-semibold hover:border-signal-ink"
              >
                Betulkan
              </button>
            )}
            <button
              ref={tombolTutupRef}
              type="button"
              onClick={onTutup}
              className="min-h-11 shrink-0 rounded-control border border-paper-edge px-3 text-sm font-semibold hover:border-ink"
            >
              Tutup
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4 py-4">
          <section>
            <h3 className="font-display text-[11px] font-bold text-ink-muted">Perangkat</h3>
            {order.perangkat.trim() ? (
              <p className="mt-1 text-base font-semibold">{order.perangkat}</p>
            ) : (
              <p className="mt-1 text-sm text-ink-muted">
                Belum dicatat, nota ini dibuat sebelum kolomnya ada.
              </p>
            )}
          </section>

          <section>
            <h3 className="font-display text-[11px] font-bold text-ink-muted">Pelanggan</h3>
            <p className="mt-1 text-sm font-semibold">{order.pelanggan}</p>
            <p className="angka mt-0.5 text-[13px] text-ink-muted">{order.telepon}</p>
          </section>

          <section>
            <h3 className="font-display text-[11px] font-bold text-ink-muted">Keluhan</h3>
            <p className="mt-1 text-sm leading-relaxed">{order.keluhan}</p>
            {order.diubahPada && (
              <p className="mt-1.5 text-[13px] text-ink-muted">
                Terakhir dibetulkan {umurRelatif(order.diubahPada)}
                {order.diubahOleh ? ` oleh ${order.diubahOleh}` : ""}.
              </p>
            )}
          </section>

          {tautanCetak && (
            <section>
              <h3 className="font-display text-[11px] font-bold text-ink-muted">
                Nota pelanggan
              </h3>
              <a
                href={tautanCetak}
                className="mt-2 inline-flex min-h-11 items-center rounded-control border border-paper-edge px-4 text-sm font-semibold hover:border-ink"
              >
                Buka nota untuk dicetak
              </a>
              <div className="mt-4">
                <BagikanNota token={order.token} />
              </div>
            </section>
          )}

          <section>
            <h3 className="font-display text-[11px] font-bold text-ink-muted">
              Pindah tahap
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5">
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
                          ? "border-ink bg-ink font-semibold text-paper"
                          : "border-paper-edge font-medium hover:border-signal-ink",
                      ].join(" ")}
                    >
                      <span>{s.label}</span>
                      {sekarang && <span className="text-[11px]">sekarang</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className="font-display text-[11px] font-bold text-ink-muted">
              Riwayat perpindahan
            </h3>
            <ol className="mt-2 flex flex-col">
              {riwayatTerbaru.map((m) => (
                <li
                  key={m.id}
                  className="border-t border-dashed border-ink/25 py-2 text-[13px] first:border-t-0"
                >
                  <p className="font-semibold">
                    {m.dari
                      ? `${stageLabel(m.dari)} ke ${stageLabel(m.ke)}`
                      : `Masuk ke ${stageLabel(m.ke)}`}
                  </p>
                  <p className="mt-0.5 text-ink-muted">
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
