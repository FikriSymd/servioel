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
  const {
    mode,
    setMode,
    status,
    orders,
    muatUlang,
    pindahTahap,
    tambahKartu,
  } = useBoard();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [formBuka, setFormBuka] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");

  const sensors = useSensors(
    // Jarak 8px: klik tanpa geser tetap membuka detail, bukan dianggap drag.
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
      o.stage !== "sudah-diambil" && hariDiTahap(o.masukTahapPada) >= AMBANG_NYANGKUT_HARI,
  ).length;

  const detail = orders.find((o) => o.id === detailId) ?? null;
  const sedangDrag = orders.find((o) => o.id === dragId) ?? null;

  function onDragStart(e: DragStartEvent) {
    setDragId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setDragId(null);
    const { active, over } = e;
    if (!over) return;
    const ke = over.id as StageId;
    const kartu = orders.find((o) => o.id === String(active.id));
    pindahTahap(String(active.id), ke);
    if (kartu && kartu.stage !== ke) {
      const tujuan = STAGES.find((s) => s.id === ke)?.label ?? ke;
      setPesan(`${kartu.nomor} dipindahkan ke tahap ${tujuan}.`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-card border border-line-strong bg-tint px-3 py-2 text-xs">
        <span className="font-bold">Data contoh.</span> Papan ini belum tersambung
        database, jadi semua kartu di bawah bukan data toko nyata.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Papan servis</h1>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {status === "siap"
              ? `${orders.length} unit di papan, ${jumlahNyangkut} nyangkut lebih dari ${AMBANG_NYANGKUT_HARI} hari.`
              : "\u00A0"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFormBuka(true)}
            className="min-h-11 rounded-control bg-accent px-4 text-sm font-semibold text-paper"
          >
            Kartu servis baru
          </button>
          <StatePreview mode={mode} setMode={setMode} />
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {pesan}
      </p>

      {status === "memuat" && (
        <div aria-busy="true" className="flex flex-col gap-3">
          <p role="status" className="text-sm text-muted">
            Memuat papan servis.
          </p>
          <div className="flex gap-3 overflow-hidden">
            {STAGES.map((s) => (
              <div
                key={s.id}
                className="w-[272px] shrink-0 rounded-card border border-line bg-tint p-3"
              >
                <div className="h-4 w-28 animate-pulse rounded bg-line" />
                <div className="mt-3 flex flex-col gap-2">
                  <div className="h-20 animate-pulse rounded-card bg-line" />
                  <div className="h-20 animate-pulse rounded-card bg-line" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "gagal" && (
        <div
          role="alert"
          className="rounded-card border border-line-strong bg-surface px-4 py-6 text-center"
        >
          <h2 className="text-base font-bold">Papan gagal dimuat</h2>
          <p className="mt-1 text-sm text-muted">
            Data papan tidak terbaca. Biasanya karena koneksi terputus. Coba muat
            ulang; kalau tetap gagal, papan belum bisa dipakai.
          </p>
          <button
            type="button"
            onClick={muatUlang}
            className="mt-4 min-h-11 rounded-control border border-line-strong px-4 text-sm font-semibold"
          >
            Coba lagi
          </button>
        </div>
      )}

      {status === "siap" && orders.length === 0 && (
        <div className="rounded-card border border-line-strong bg-surface px-4 py-10 text-center">
          <h2 className="text-base font-bold">Papan masih kosong</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Belum ada unit servis yang dicatat. Mulai dari unit yang paling baru
            diterima di meja.
          </p>
          <button
            type="button"
            onClick={() => setFormBuka(true)}
            className="mt-4 min-h-11 rounded-control bg-accent px-4 text-sm font-semibold text-paper"
          >
            Buat kartu servis pertama
          </button>
        </div>
      )}

      {status === "siap" && orders.length > 0 && (
        <>
          <MobileStageList orders={orders} onBuka={setDetailId} />

          <div className="hidden lg:block">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3">
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

              {/* Satu-satunya bayangan di papan: kartu yang sedang diangkat.
                  Alasan: menandai bahwa kartu ini lepas dari papannya. */}
              <DragOverlay>
                {sedangDrag ? (
                  <div className="w-[272px] rotate-1 shadow-2xl">
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
            const kartu = orders.find((o) => o.id === id);
            pindahTahap(id, ke);
            if (kartu) {
              const tujuan = STAGES.find((s) => s.id === ke)?.label ?? ke;
              setPesan(`${kartu.nomor} dipindahkan ke tahap ${tujuan}.`);
            }
          }}
        />
      )}

      {formBuka && (
        <NewCardForm
          onTutup={() => setFormBuka(false)}
          onSimpan={(data) => {
            const baru = tambahKartu(data);
            setFormBuka(false);
            setPesan(`Kartu ${baru.nomor} dibuat di tahap Barang Masuk.`);
          }}
        />
      )}
    </div>
  );
}
