"use client";

import { useState, useTransition } from "react";
import { Board } from "@/components/board/Board";
import {
  aksiArsipkan,
  aksiBuatPesanan,
  aksiPindahTahap,
  type HasilPapan,
} from "@/app/actions/papan";
import type { ServiceOrder, StageId } from "@/lib/types";

type Props = {
  ordersAwal: ServiceOrder[];
  peran: string;
};

/**
 * Papan yang tersambung database.
 *
 * Daftar pesanannya dipegang di sini supaya perpindahan terasa langsung, tapi
 * setiap perubahan tetap dikirim ke server lebih dulu, dan yang ditampilkan
 * setelahnya adalah daftar yang dikembalikan server. Jadi tampilan tidak pernah
 * menyimpang dari isi database.
 */
export function PapanApp({ ordersAwal, peran }: Props) {
  const [orders, setOrders] = useState(ordersAwal);
  const [galat, setGalat] = useState("");
  const [kabar, setKabar] = useState("");
  const [sibuk, mulai] = useTransition();

  function jalankan(aksi: () => Promise<HasilPapan>): Promise<string> {
    return new Promise((selesai) => {
      mulai(async () => {
        const hasil = await aksi();
        setOrders(hasil.orders);
        setGalat(hasil.ok ? "" : hasil.pesan);
        setKabar(hasil.ok ? hasil.pesan : "");
        selesai(hasil.pesan);
      });
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {galat && (
        <p
          role="alert"
          className="border border-signal px-3 py-2 text-[13px] text-bench-text"
        >
          <span className="font-semibold">Tidak berhasil.</span> {galat}
        </p>
      )}

      {kabar && (
        <p role="status" className="text-[13px] text-bench-muted">
          {kabar}
        </p>
      )}

      <Board
        orders={orders}
        status="siap"
        judul="Papan servis"
        sibuk={sibuk}
        onPindah={(id: string, ke: StageId) =>
          jalankan(() => aksiPindahTahap(id, ke))
        }
        onTambah={(data) => jalankan(() => aksiBuatPesanan(data))}
        onMuatUlang={() => window.location.reload()}
        kepala={
          peran === "owner" ? (
            <button
              type="button"
              onClick={() => {
                void jalankan(() => aksiArsipkan());
              }}
              className="min-h-11 rounded-control border border-bench-line px-3 text-[13px] font-semibold text-bench-muted hover:border-signal hover:text-bench-text"
            >
              Arsipkan yang lama
            </button>
          ) : null
        }
        catatan={
          <p className="border-t border-bench-line pt-3 text-[13px] text-bench-muted">
            <span className="font-semibold text-bench-text">Tersambung database.</span>{" "}
            Tiap perpindahan langsung tersimpan, dan tercatat siapa yang
            memindahkan.
          </p>
        }
      />
    </div>
  );
}
