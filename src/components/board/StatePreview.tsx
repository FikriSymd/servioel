"use client";

import type { PreviewMode } from "@/lib/board-store";

const PILIHAN: { id: PreviewMode; label: string }[] = [
  { id: "normal", label: "Terisi" },
  { id: "kosong", label: "Kosong" },
  { id: "memuat", label: "Memuat" },
  { id: "gagal", label: "Gagal" },
];

/**
 * Alat bantu review Fase 1: memaksa papan menampilkan salah satu keadaan layar,
 * supaya keadaan kosong, memuat, dan gagal bisa diperiksa tanpa menunggu
 * backend. Alat ini dibuang di Fase 2.
 */
export function StatePreview({
  mode,
  setMode,
}: {
  mode: PreviewMode;
  setMode: (m: PreviewMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-bench-muted">Pratinjau keadaan</span>
      <div role="group" aria-label="Pratinjau keadaan layar" className="flex flex-wrap gap-1.5">
        {PILIHAN.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={mode === p.id}
            onClick={() => setMode(p.id)}
            className={[
              "min-h-11 rounded-control border px-3 text-[13px]",
              mode === p.id
                ? "border-signal bg-signal font-bold text-ink"
                : "border-bench-line text-bench-muted hover:text-bench-text",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
