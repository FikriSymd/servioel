"use client";

import type { PreviewMode } from "@/lib/board-store";

const PILIHAN: { id: PreviewMode; label: string }[] = [
  { id: "normal", label: "Terisi" },
  { id: "kosong", label: "Kosong" },
  { id: "memuat", label: "Memuat" },
  { id: "gagal", label: "Gagal" },
];

/**
 * Alat bantu review Fase 1: memaksa papan menampilkan salah satu status layar,
 * supaya status kosong, memuat, dan gagal bisa diperiksa tanpa menunggu
 * backend. Alat ini dihapus di Fase 2.
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
      <span className="text-xs font-semibold text-muted">
        Pratinjau status (Fase 1)
      </span>
      <div
        role="group"
        aria-label="Pratinjau status layar"
        className="flex flex-wrap gap-1"
      >
        {PILIHAN.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={mode === p.id}
            onClick={() => setMode(p.id)}
            className={[
              "min-h-11 rounded-control border px-2.5 text-xs font-semibold",
              mode === p.id
                ? "border-struct bg-struct text-paper"
                : "border-line-strong bg-surface",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
