import { ServiceCardView } from "./ServiceCardView";
import { STAGES } from "@/lib/stages";
import type { ServiceOrder } from "@/lib/types";

/**
 * Papan statis untuk landing page. Sengaja tanpa interaksi: yang ditampilkan
 * memang tampilan aslinya, cuma tidak bisa digeser. Bukan tangkapan layar
 * palsu dan bukan gambar dekoratif.
 */
export function BoardPreview({ orders }: { orders: ServiceOrder[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper p-3">
      <div className="flex gap-3">
        {STAGES.map((s) => {
          const isi = orders.filter((o) => o.stage === s.id);
          return (
            <div
              key={s.id}
              className="w-[220px] shrink-0 rounded-card border border-line bg-tint p-2"
            >
              <div className="flex items-baseline justify-between gap-2 px-1 pb-2">
                <h3 className="text-xs font-bold">{s.label}</h3>
                <span className="angka text-xs text-muted">{isi.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {isi.length === 0 ? (
                  <p className="px-1 py-3 text-center text-xs text-muted">
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
