"use client";

import { useDraggable } from "@dnd-kit/core";
import { ServiceCardView } from "./ServiceCardView";
import { stageLabel } from "@/lib/stages";
import type { ServiceOrder } from "@/lib/types";

type Props = {
  order: ServiceOrder;
  onBuka: (id: string) => void;
};

/**
 * Nota yang bisa diangkat dengan mouse sekaligus tombol untuk keyboard.
 * Jarak aktivasi 8px dipasang di sensornya, jadi klik tanpa geser tetap
 * membuka detail dan tidak salah dibaca sebagai seret.
 */
export function DraggableCard({ order, onBuka }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onBuka(order.id)}
      aria-label={`${order.nomor}, ${order.pelanggan}, tahap ${stageLabel(order.stage)}. Buka detail.`}
      className={[
        "block w-full cursor-grab rounded-ticket text-left",
        isDragging ? "opacity-40" : "",
      ].join(" ")}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
    >
      <ServiceCardView order={order} />
    </button>
  );
}
