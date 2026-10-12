"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardCode,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMemo, useState, type ReactNode } from "react";
import { CardDetail } from "./CardDetail";
import { Column } from "./Column";
import { MobileStageList } from "./MobileStageList";
import { NewCardForm, type IsiNota } from "./NewCardForm";
import { ServiceCardView } from "./ServiceCardView";
import { keyboardPindahKolom } from "./keyboardCoordinates";
import { AMBANG_NYANGKUT_HARI, STAGES, hariDiTahap } from "@/lib/stages";
import { saringPesanan } from "@/lib/pencarian";
import type { BoardStatus, ServiceOrder, StageId } from "@/lib/types";

/**
 * Papan kerja. Komponen ini tidak tahu dari mana datanya datang: papan contoh di
 * halaman depan mengisinya dari data contoh, papan di dalam aplikasi mengisinya
 * dari database. Tampilan dan ketiga jalur pindahnya (seret, ketuk, keyboard)
 * sama persis, jadi yang diuji di halaman contoh memang yang dipakai kerja.
 *
 * Tiap aksi mengembalikan pesan untuk diumumkan pembaca layar. Pesannya datang
 * dari server, jadi yang diucapkan adalah hasil sebenarnya.
 *
 * Pencarian menyaring di peramban, bukan lewat server: seluruh nota papan sudah
 * ada di sini, jadi hasilnya muncul sambil mengetik tanpa menunggu jaringan.
 */
type Props = {
  orders: ServiceOrder[];
  status: BoardStatus;
  judul?: string;
  onPindah: (id: string, ke: StageId) => Promise<string | void> | string | void;
  onTambah: (data: IsiNota) => Promise<string | void> | string | void;
  /** Membetulkan isi nota. Tidak ada di papan contoh yang tanpa server. */
  onUbah?: (id: string, data: IsiNota) => Promise<string | void> | string | void;
  /**
   * Alamat halaman cetak satu nota. Kalau tidak diisi, tombol cetak dan bagi
   * tautan tidak muncul: papan contoh tidak punya baris di database, jadi
   * tautannya akan menuju halaman kosong.
   */
  tautanCetak?: (order: ServiceOrder) => string;
  onMuatUlang: () => void;
  /** Kontrol tambahan di samping judul: pratinjau status, atau tombol arsip. */
  kepala?: ReactNode;
  /** Catatan di bawah judul: penanda data contoh, atau keadaan sambungan. */
  catatan?: ReactNode;
  /** Sedang menunggu server. Papan tetap bisa dipakai, cuma ditandai sibuk. */
  sibuk?: boolean;
};

export function Board({
  orders,
  status,
  judul = "Papan servis",
  onPindah,
  onTambah,
  onUbah,
  tautanCetak,
  onMuatUlang,
  kepala,
  catatan,
  sibuk = false,
}: Props) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [formBuka, setFormBuka] = useState(false);
  const [ubahId, setUbahId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");
  const [cari, setCari] = useState("");

  const sensors = useSensors(
    // Jarak 8px: klik tanpa geser tetap membuka detail, bukan dibaca sebagai seret.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: keyboardPindahKolom,
      /*
        Bawaannya dnd-kit memakai Space DAN Enter untuk mulai mengangkat nota.
        Karena kartunya juga tombol "buka detail", Enter jadi rebutan, dan dnd-kit
        yang menang: tekan Enter, notanya terangkat, detailnya tidak pernah
        terbuka. Akibatnya seluruh isi panel detail (pindah tahap, betulkan nota,
        cetak, bagi tautan) tidak terjangkau keyboard.

        Jadi pembagiannya dibuat tegas: Enter membuka detail, Space mengangkat
        nota untuk digeser. Dua-duanya tetap ada, tidak ada yang dikorbankan.
      */
      keyboardCodes: {
        start: [KeyboardCode.Space],
        cancel: [KeyboardCode.Esc],
        end: [KeyboardCode.Space, KeyboardCode.Enter],
      },
    }),
  );

  const terfilter = useMemo(() => saringPesanan(orders, cari), [orders, cari]);
  const sedangCari = terfilter.length !== orders.length;

  const perTahap = useMemo(() => {
    const peta = new Map<StageId, ServiceOrder[]>();
    for (const s of STAGES) peta.set(s.id, []);
    for (const o of terfilter) peta.get(o.stage)?.push(o);
    return peta;
  }, [terfilter]);

  const jumlahNyangkut = orders.filter(
    (o) =>
      o.stage !== "sudah-diambil" &&
      hariDiTahap(o.masukTahapPada) >= AMBANG_NYANGKUT_HARI,
  ).length;

  const detail = orders.find((o) => o.id === detailId) ?? null;
  const sedangUbah = orders.find((o) => o.id === ubahId) ?? null;
  const sedangDrag = orders.find((o) => o.id === dragId) ?? null;

  async function pindahDanUmumkan(id: string, ke: StageId) {
    const hasil = await onPindah(id, ke);
    if (typeof hasil === "string") setPesan(hasil);
  }

  async function onDragEnd(e: DragEndEvent) {
    setDragId(null);
    const { active, over } = e;
    if (!over) return;
    await pindahDanUmumkan(String(active.id), over.id as StageId);
  }

  const adaIsi = status === "siap" && orders.length > 0;

  return (
    <div className="flex flex-col gap-6" aria-busy={sibuk}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-bench-text">
            {judul}
          </h1>
          <p className="mt-1 text-sm text-bench-muted" aria-live="polite">
            {status !== "siap"
              ? "\u00A0"
              : sedangCari
                ? `${terfilter.length} dari ${orders.length} unit cocok dengan pencarian.`
                : `${orders.length} unit di papan, ${jumlahNyangkut} menginap lebih dari ${AMBANG_NYANGKUT_HARI} hari.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setFormBuka(true)}
            className="min-h-11 rounded-control bg-signal px-4 text-sm font-bold text-ink"
          >
            Nota servis baru
          </button>
          {kepala}
        </div>
      </div>

      {adaIsi && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="cari-unit"
              className="text-[13px] font-semibold text-bench-text"
            >
              Cari unit
            </label>
            <input
              id="cari-unit"
              type="text"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Nama, nomor HP, perangkat, atau nomor nota"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && cari) {
                  e.stopPropagation();
                  setCari("");
                }
              }}
              className="mt-1.5 min-h-11 w-full rounded-control border border-bench-line bg-bench-panel px-3 text-sm text-bench-text placeholder:text-bench-muted"
            />
          </div>

          {cari && (
            <button
              type="button"
              onClick={() => setCari("")}
              className="min-h-11 shrink-0 rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
            >
              Bersihkan
            </button>
          )}
        </div>
      )}

      {catatan}

      <p className="sr-only" role="status" aria-live="polite">
        {pesan}
      </p>

      {status === "memuat" && (
        <div className="flex flex-col gap-3">
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
      )}

      {status === "gagal" && (
        <div role="alert" className="border border-bench-line px-4 py-10 text-center">
          <h2 className="font-display text-lg font-bold text-bench-text">
            Papan gagal dimuat
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-bench-muted">
            Data papan tidak terbaca. Biasanya karena koneksi terputus. Coba muat
            ulang; kalau tetap gagal, papan belum bisa dipakai.
          </p>
          <button
            type="button"
            onClick={onMuatUlang}
            className="mt-4 min-h-11 rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
          >
            Coba lagi
          </button>
        </div>
      )}

      {status === "siap" && orders.length === 0 && (
        <div className="border border-bench-line px-4 py-14 text-center">
          <h2 className="font-display text-lg font-bold text-bench-text">
            Papan masih kosong
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-bench-muted">
            Belum ada unit servis yang dicatat. Mulai dari unit yang paling baru
            diterima di meja.
          </p>
          <button
            type="button"
            onClick={() => setFormBuka(true)}
            className="mt-4 min-h-11 rounded-control bg-signal px-4 text-sm font-bold text-ink"
          >
            Tulis nota pertama
          </button>
        </div>
      )}

      {adaIsi && terfilter.length === 0 && (
        <div className="border border-bench-line px-4 py-14 text-center">
          <h2 className="font-display text-lg font-bold text-bench-text">
            Tidak ada unit yang cocok
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-bench-muted">
            Tidak ada nota di papan yang cocok dengan pencarian itu. Coba potongan
            nama yang lain, atau nomor HP tanpa tanda pemisah.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-bench-muted">
            Unit yang sudah diarsipkan belum ikut dicari.
          </p>
          <button
            type="button"
            onClick={() => setCari("")}
            className="mt-4 min-h-11 rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
          >
            Bersihkan pencarian
          </button>
        </div>
      )}

      {adaIsi && terfilter.length > 0 && (
        <>
          <MobileStageList orders={terfilter} onBuka={setDetailId} kueri={cari} />

          <div className="hidden lg:block">
            <p className="sr-only">
              Papan bisa dipakai tanpa mouse. Tab untuk berpindah antar nota,
              Enter untuk membuka detail nota, Space untuk mengangkat nota lalu
              panah kiri dan kanan untuk memindahkannya ke tahap lain.
            </p>
            <DndContext
              sensors={sensors}
              onDragStart={(e: DragStartEvent) => setDragId(String(e.active.id))}
              onDragEnd={onDragEnd}
            >
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-4">
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

              {/* Satu-satunya bayangan di papan: nota yang sedang diangkat. */}
              <DragOverlay>
                {sedangDrag ? (
                  <div className="w-[268px] rotate-1 shadow-2xl">
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
          onPindah={pindahDanUmumkan}
          /*
            Panel detail ditutup dulu sebelum formulir pembetulan dibuka. Dua
            lapisan yang sama-sama mengunci fokus akan saling tarik, dan yang
            di depan belum tentu yang terakhir dibuka.
          */
          onUbah={
            onUbah
              ? () => {
                  setUbahId(detail.id);
                  setDetailId(null);
                }
              : undefined
          }
          tautanCetak={tautanCetak?.(detail)}
        />
      )}

      {sedangUbah && (
        <NewCardForm
          awal={sedangUbah}
          onTutup={() => setUbahId(null)}
          onSimpan={async (data) => {
            const id = sedangUbah.id;
            setUbahId(null);
            const hasil = await onUbah?.(id, data);
            if (typeof hasil === "string") setPesan(hasil);
            // Dibuka lagi supaya yang membetulkan langsung melihat hasilnya,
            // bukan menebak apakah perubahannya tersimpan.
            setDetailId(id);
          }}
        />
      )}

      {formBuka && (
        <NewCardForm
          onTutup={() => setFormBuka(false)}
          onSimpan={async (data) => {
            setFormBuka(false);
            const hasil = await onTambah(data);
            if (typeof hasil === "string") setPesan(hasil);
          }}
        />
      )}
    </div>
  );
}
