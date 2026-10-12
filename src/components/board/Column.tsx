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
 * Satu kolom tahap. Jadi sasaran drop sekaligus menampilkan isinya.
 * Cincin aksen saat ada kartu di atasnya menandai keadaan nyata (kartu siap
 * dijatuhkan di sini), bukan hiasan.
 */
export function Column({ stage, orders, onBuka }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <section
      ref={setNodeRef}
      aria-label={`Tahap ${stage.label}, ${orders.length} unit`}
      className={[
        "flex w-[272px] shrink-0 flex-col rounded-card border bg-tint",
        isOver ? "border-accent ring-2 ring-accent" : "border-line",
      ].join(" ")}
    >
      <header className="border-b border-line px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-bold">{stage.label}</h2>
          <span className="angka text-xs font-semibold text-muted">
            {orders.length}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted">{stage.arti}</p>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-2">
        {orders.length === 0 ? (
          <p className="rounded-card border border-dashed border-line px-3 py-4 text-center text-xs text-muted">
            Belum ada unit di tahap ini. Tarik kartu ke sini untuk memindahkannya.
          </p>
        ) : (
          orders.map((o) => <DraggableCard key={o.id} order={o} onBuka={onBuka} />)
        )}
      </div>
    </section>
  );
}
