"use client";

import { useDroppable } from "@dnd-kit/core";
import { DraggableCard } from "./DraggableCard";
import type { Stage } from "@/lib/stages";
import type { ServiceOrder } from "@/lib/types";

type Props = {
  stage: Stage;
  orders: ServiceOrder[];
  onBuka: (id: string) => void;
};

/**
 * Satu lajur tahap. Sengaja bukan kotak: lajur dipisahkan garis tegak, seperti
 * rak di dinding. Yang berubah saat nota melintas di atasnya cuma warna garis
 * kepala lajur, dan itu memang keadaan nyata, bukan hiasan.
 */
export function Column({ stage, orders, onBuka }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <section
      ref={setNodeRef}
      aria-label={`Tahap ${stage.label}, ${orders.length} unit`}
      className="flex w-[268px] shrink-0 flex-col"
    >
      <header
        className={[
          "flex items-baseline justify-between gap-2 border-b-2 pb-2",
          isOver ? "border-signal" : "border-bench-line",
        ].join(" ")}
      >
        <h2 className="font-display text-sm font-bold text-bench-text">{stage.label}</h2>
        <span className="angka font-display text-sm font-bold text-bench-muted">
          {orders.length}
        </span>
      </header>

      <p className="pt-2 text-[11px] leading-snug text-bench-muted">{stage.arti}</p>

      <div className="mt-2.5 flex flex-1 flex-col gap-2">
        {orders.length === 0 ? (
          <p
            className={[
              "rounded-ticket border border-dashed px-3 py-6 text-center text-[11px] leading-snug",
              isOver
                ? "border-signal text-bench-text"
                : "border-bench-line text-bench-muted",
            ].join(" ")}
          >
            Belum ada unit. Jatuhkan nota di sini untuk memindahkannya.
          </p>
        ) : (
          orders.map((o) => <DraggableCard key={o.id} order={o} onBuka={onBuka} />)
        )}
      </div>
    </section>
  );
}
