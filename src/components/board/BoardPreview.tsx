import { ServiceCardView } from "./ServiceCardView";
import { STAGES } from "@/lib/stages";
import type { ServiceOrder } from "@/lib/types";

/**
 * Papan statis untuk halaman depan. Tanpa interaksi: yang ditampilkan memang
 * tampilan papannya, cuma tidak bisa digeser. Bukan tangkapan layar palsu.
 */
export function BoardPreview({ orders }: { orders: ServiceOrder[] }) {
  return (
    <div className="overflow-x-auto rounded-control border border-bench-line bg-bench-panel p-3">
      <div className="flex gap-4">
        {STAGES.map((s) => {
          const isi = orders.filter((o) => o.stage === s.id);
          return (
            <div key={s.id} className="w-[196px] shrink-0">
              <div className="flex items-baseline justify-between gap-2 border-b border-bench-line pb-1.5">
                <h3 className="font-display text-[12px] font-bold text-bench-text">
                  {s.label}
                </h3>
                <span className="angka text-[12px] font-bold text-bench-muted">
                  {isi.length}
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                {isi.length === 0 ? (
                  <p className="rounded-ticket border border-dashed border-bench-line px-2 py-3 text-center text-[11px] text-bench-muted">
                    belum ada unit
                  </p>
                ) : (
                  isi.map((o) => (
                    <ServiceCardView key={o.id} order={o} hitungUmur={false} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
