"use client";

import { Board } from "./Board";
import { StatePreview } from "./StatePreview";
import { useBoard } from "@/lib/board-store";
import { STAGES } from "@/lib/stages";
import type { StageId } from "@/lib/types";

/**
 * Papan contoh di halaman depan. Datanya dari data contoh, dan alat pratinjau
 * status cuma ada di sini. Papan di dalam aplikasi memakai komponen Board yang
 * sama, jadi yang bisa dicoba pengunjung memang tampilan yang dipakai kerja.
 */
export function BoardContoh() {
  const { mode, setMode, status, orders, muatUlang, pindahTahap, tambahKartu } =
    useBoard();

  return (
    <Board
      orders={orders}
      status={status}
      onPindah={(id, ke) => {
        const nota = orders.find((o) => o.id === id);
        pindahTahap(id, ke);
        if (!nota || nota.stage === ke) return "";
        const tujuan = STAGES.find((s) => s.id === ke)?.label ?? ke;
        return `${nota.nomor} dipindahkan ke tahap ${tujuan}.`;
      }}
      onTambah={(data) => {
        const baru = tambahKartu(data);
        return `Nota ${baru.nomor} dibuat di tahap Barang Masuk.`;
      }}
      onMuatUlang={muatUlang}
      kepala={<StatePreview mode={mode} setMode={setMode} />}
      catatan={
        <p className="border-t border-bench-line pt-3 text-[13px] text-bench-muted">
          <span className="font-semibold text-bench-text">Data contoh.</span> Papan
          ini belum tersambung database, jadi semua nota di bawah bukan data toko
          nyata. Untuk papan yang benar-benar menyimpan, masuk ke akun toko.
        </p>
      }
    />
  );
}
