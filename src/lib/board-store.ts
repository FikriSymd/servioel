"use client";

import { useCallback, useEffect, useState } from "react";
import { buatDataContoh } from "./sample-data";
import type { BoardStatus, ServiceOrder, StageId } from "./types";

/** Pratinjau status layar. Hanya ada di Fase 1 supaya status kosong, memuat,
 *  dan gagal bisa dilihat tanpa menunggu backend. Hilang di Fase 2. */
export type PreviewMode = "normal" | "kosong" | "memuat" | "gagal";

/** Belum ada login di Fase 1, jadi nama pencatat dibuat jujur seperti ini. */
const PENGGUNA_CONTOH = "Kasir (contoh)";

let urutLokal = 0;
function idBaru(prefix: string): string {
  urutLokal += 1;
  return `${prefix}-baru-${urutLokal}`;
}

export function useBoard() {
  const [mode, setMode] = useState<PreviewMode>("normal");
  const [status, setStatus] = useState<BoardStatus>("memuat");
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [nomorBerikut, setNomorBerikut] = useState(9);

  const muatUlang = useCallback(() => {
    setStatus("memuat");
    const t = setTimeout(() => {
      setOrders(buatDataContoh());
      setStatus("siap");
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (mode === "memuat") {
      setStatus("memuat");
      return;
    }
    if (mode === "gagal") {
      setStatus("memuat");
      const t = setTimeout(() => setStatus("gagal"), 450);
      return () => clearTimeout(t);
    }
    setStatus("memuat");
    const t = setTimeout(() => {
      setOrders(mode === "kosong" ? [] : buatDataContoh());
      setStatus("siap");
    }, 500);
    return () => clearTimeout(t);
  }, [mode]);

  const pindahTahap = useCallback((id: string, ke: StageId) => {
    setOrders((lama) =>
      lama.map((o) => {
        if (o.id !== id || o.stage === ke) return o;
        const dari = o.stage;
        return {
          ...o,
          stage: ke,
          masukTahapPada: new Date().toISOString(),
          riwayat: [
            ...o.riwayat,
            {
              id: idBaru("rw"),
              pada: new Date().toISOString(),
              dari,
              ke,
              oleh: PENGGUNA_CONTOH,
            },
          ],
        };
      }),
    );
  }, []);

  const tambahKartu = useCallback(
    (data: { pelanggan: string; telepon: string; keluhan: string }) => {
      const nomor = `SV-2026-${String(nomorBerikut).padStart(4, "0")}`;
      setNomorBerikut((n) => n + 1);
      const sekarang = new Date().toISOString();
      const baru: ServiceOrder = {
        id: idBaru("so"),
        nomor,
        pelanggan: data.pelanggan.trim(),
        telepon: data.telepon.trim(),
        keluhan: data.keluhan.trim(),
        stage: "barang-masuk",
        masukTahapPada: sekarang,
        dibuatPada: sekarang,
        riwayat: [
          {
            id: idBaru("rw"),
            pada: sekarang,
            dari: null,
            ke: "barang-masuk",
            oleh: PENGGUNA_CONTOH,
          },
        ],
      };
      setOrders((lama) => [baru, ...lama]);
      return baru;
    },
    [nomorBerikut],
  );

  return {
    mode,
    setMode,
    status,
    orders,
    muatUlang,
    pindahTahap,
    tambahKartu,
  };
}
