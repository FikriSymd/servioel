import { STAGES } from "@/lib/stages";

/**
 * Keadaan memuat papan. Dipakai Next saat halaman papan sedang diambil dari
 * server, jadi yang terlihat bukan layar kosong.
 */
export default function MemuatPapan() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div>
        <div className="h-7 w-44 animate-pulse rounded bg-bench-line" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-bench-line" />
      </div>
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
  );
}
