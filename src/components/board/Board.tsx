"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { CardDetail } from "./CardDetail";
import { Column } from "./Column";
import { MobileStageList } from "./MobileStageList";
import { NewCardForm } from "./NewCardForm";
import { ServiceCardView } from "./ServiceCardView";
import { StatePreview } from "./StatePreview";
import { keyboardPindahKolom } from "./keyboardCoordinates";
import { useBoard } from "@/lib/board-store";
import { AMBANG_NYANGKUT_HARI, STAGES, hariDiTahap } from "@/lib/stages";
import type { StageId } from "@/lib/types";

export function Board() {
  const { mode, setMode, status, orders, muatUlang, pindahTahap, tambahKartu } =
    useBoard();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [formBuka, setFormBuka] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");

  const sensors = useSensors(
    // Jarak 8px: klik tanpa geser tetap membuka detail, bukan dibaca sebagai seret.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardPindahKolom }),
  );

  const perTahap = useMemo(() => {
    const peta = new Map<StageId, typeof orders>();
    for (const s of STAGES) peta.set(s.id, []);
    for (const o of orders) peta.get(o.stage)?.push(o);
    return peta;
  }, [orders]);

  const jumlahNyangkut = orders.filter(
    (o) =>
      o.stage !== "sudah-diambil" &&
      hariDiTahap(o.masukTahapPada) >= AMBANG_NYANGKUT_HARI,
  ).length;

  const detail = orders.find((o) => o.id === detailId) ?? null;
  const sedangDrag = orders.find((o) => o.id === dragId) ?? null;

  function catatPesan(nomor: string, ke: StageId) {
    const tujuan = STAGES.find((s) => s.id === ke)?.label ?? ke;
    setPesan(`${nomor} dipindahkan ke tahap ${tujuan}.`);
  }

  function onDragEnd(e: DragEndEvent) {
    setDragId(null);
    const { active, over } = e;
    if (!over) return;
    const ke = over.id as StageId;
    const nota = orders.find((o) => o.id === String(active.id));
    pindahTahap(String(active.id), ke);
    if (nota && nota.stage !== ke) catatPesan(nota.nomor, ke);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-bench-text">
            Papan servis
          </h1>
          <p className="mt-1 text-sm text-bench-muted" aria-live="polite">
            {status === "siap"
              ? `${orders.length} unit di papan, ${jumlahNyangkut} menginap lebih dari ${AMBANG_NYANGKUT_HARI} hari.`
              : "\u00A0"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setFormBuka(true)}
            className="min-h-11 rounded-control bg-signal px-4 text-sm font-bold text-ink"
          >
            Nota servis baru
          </button>
          <StatePreview mode={mode} setMode={setMode} />
        </div>
      </div>

      <p className="border-t border-bench-line pt-3 text-[13px] text-bench-muted">
        <span className="font-semibold text-bench-text">Data contoh.</span> Papan ini
        belum tersambung database, jadi semua nota di bawah bukan data toko nyata.
      </p>

      <p className="sr-only" role="status" aria-live="polite">
        {pesan}
      </p>

      {status === "memuat" && (
        <div aria-busy="true" className="flex flex-col gap-3">
          <p role="status" className="text-sm text-bench-muted">
            Memuat papan servis.
          </p>
          <div className="flex gap-4 overflow-hidden">
            {STAGES.map((s) => (
              <div key={s.id} className="w-[268px] shrink-0">
                <div className="h-4 w-28 animate-pulse rounded bg-bench-line" />
                <div className="mt-3 flex flex-col gap-2">
                  <div className="h-20 animate-pulse rounded-ticket bg-bench-panel" />
                  <div className="h-20 animate-pulse rounded-ticket bg-bench-panel" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "gagal" && (
        <div
          role="alert"
          className="border border-bench-line px-4 py-10 text-center"
        >
          <h2 className="font-display text-lg font-bold text-bench-text">
            Papan gagal dimuat
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-bench-muted">
            Data papan tidak terbaca. Biasanya karena koneksi terputus. Coba muat
            ulang; kalau tetap gagal, papan belum bisa dipakai.
          </p>
          <button
            type="button"
            onClick={muatUlang}
            className="mt-4 min-h-11 rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
          >
            Coba lagi
          </button>
        </div>
      )}

      {status === "siap" && orders.length === 0 && (
        <div className="border border-bench-line px-4 py-14 text-center">
          <h2 className="font-display text-lg font-bold text-bench-text">
            Papan masih kosong
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-bench-muted">
            Belum ada unit servis yang dicatat. Mulai dari unit yang paling baru
            diterima di meja.
          </p>
          <button
            type="button"
            onClick={() => setFormBuka(true)}
            className="mt-4 min-h-11 rounded-control bg-signal px-4 text-sm font-bold text-ink"
          >
            Tulis nota pertama
          </button>
        </div>
      )}

      {status === "siap" && orders.length > 0 && (
        <>
          <MobileStageList orders={orders} onBuka={setDetailId} />

          <div className="hidden lg:block">
            <DndContext
              sensors={sensors}
              onDragStart={(e: DragStartEvent) => setDragId(String(e.active.id))}
              onDragEnd={onDragEnd}
            >
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4">
                  {STAGES.map((s) => (
                    <Column
                      key={s.id}
                      stage={s}
                      orders={perTahap.get(s.id) ?? []}
                      onBuka={setDetailId}
                    />
                  ))}
                </div>
              </div>

              {/* Satu-satunya bayangan di papan: nota yang sedang diangkat. */}
              <DragOverlay>
                {sedangDrag ? (
                  <div className="w-[268px] rotate-1 shadow-2xl">
                    <ServiceCardView order={sedangDrag} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </>
      )}

      {detail && (
        <CardDetail
          order={detail}
          onTutup={() => setDetailId(null)}
          onPindah={(id, ke) => {
            const nota = orders.find((o) => o.id === id);
            pindahTahap(id, ke);
            if (nota) catatPesan(nota.nomor, ke);
          }}
        />
      )}

      {formBuka && (
        <NewCardForm
          onTutup={() => setFormBuka(false)}
          onSimpan={(data) => {
            const baru = tambahKartu(data);
            setFormBuka(false);
            setPesan(`Nota ${baru.nomor} dibuat di tahap Barang Masuk.`);
          }}
        />
      )}
    </div>
  );
}
