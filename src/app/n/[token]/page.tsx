import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { notaDariToken } from "@/lib/orders";
import { STAGES, stageIndex, stageLabel } from "@/lib/stages";
import { tanggalJam } from "@/lib/tanggal";

export const metadata: Metadata = {
  title: "Status servis, Servioel",
  // Tautan ini untuk satu pelanggan. Jangan diindeks mesin pencari.
  robots: { index: false, follow: false },
};

/**
 * Halaman status untuk pelanggan. Ini satu-satunya halaman yang boleh dibuka
 * tanpa masuk, dan itu disengaja: yang memegang tautannya adalah pelanggan yang
 * ingin tahu barangnya sudah sampai mana, dan memaksa mereka membuat akun cuma
 * untuk itu akan membuat mereka menelpon tokonya lagi.
 *
 * Isinya dibatasi pada yang perlu diketahui pelanggan: nomor, perangkat, nama,
 * tahap, dan kapan terakhir berubah. Nomor HP, isi keluhan, riwayat lengkap, dan
 * data toko lain tidak diambil dari database sama sekali, bukan cuma
 * disembunyikan di tampilan.
 *
 * Karena tautannya bisa diteruskan ke siapa saja, yang ditampilkan hanya
 * "barang ini sudah sampai mana". Kalau nanti ada permintaan menampilkan nota
 * lengkap di sini, itu keputusan baru, bukan kelanjutan otomatis.
 */
export default async function HalamanStatus({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const nota = await notaDariToken(token);
  if (!nota) notFound();

  const sekarang = stageIndex(nota.stage);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-lg px-4 py-8">
        <article className="on-paper bg-paper px-5 py-6 text-ink">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-base font-extrabold tracking-tight">
                {nota.namaToko}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-muted">Status servis</p>
            </div>
            <p className="angka font-display text-xl font-extrabold leading-none tracking-tight">
              {nota.nomor}
            </p>
          </header>

          <div className="mt-4 border-t border-dashed border-ink/30" />

          <section className="mt-4">
            <h1 className="font-display text-[11px] font-bold text-ink-muted">
              Perangkat
            </h1>
            <p className="mt-1 text-lg font-semibold">
              {nota.perangkat.trim() || "Belum dicatat"}
            </p>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              Atas nama {nota.pelanggan}
            </p>
          </section>

          <section className="mt-5">
            <h2 className="font-display text-[11px] font-bold text-ink-muted">
              Sekarang di
            </h2>
            <p className="mt-1 text-xl font-extrabold">{stageLabel(nota.stage)}</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              Diperbarui {tanggalJam(nota.diperbaruiPada)}
            </p>
          </section>

          <section className="mt-5">
            <h2 className="font-display text-[11px] font-bold text-ink-muted">
              Urutan pengerjaan
            </h2>
            <ol className="mt-2 flex flex-col">
              {STAGES.map((s, i) => {
                const lewat = i < sekarang;
                const kini = i === sekarang;
                return (
                  <li
                    key={s.id}
                    aria-current={kini ? "step" : undefined}
                    className={[
                      "flex items-baseline justify-between gap-3 border-t border-dashed border-ink/25 py-1.5 text-sm first:border-t-0",
                      kini ? "font-bold" : "",
                      lewat || kini ? "text-ink" : "text-ink-muted",
                    ].join(" ")}
                  >
                    <span>{s.label}</span>
                    <span className="shrink-0 text-[12px]">
                      {kini ? "sekarang" : lewat ? "sudah lewat" : "belum"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <footer className="mt-5 border-t border-ink/20 pt-3 text-[13px] text-ink-muted">
            <p>
              Halaman ini diperbarui sendiri setiap tokonya memindahkan unit ini.
              Kalau ada yang perlu ditanyakan, hubungi tokonya langsung.
            </p>
          </footer>
        </article>

        <p className="mt-4 text-center text-[13px] text-bench-muted">
          Halaman ini hanya menampilkan status unit, bukan nota lengkap. Jangan
          diteruskan ke orang lain kalau tidak perlu.
        </p>
      </div>
    </main>
  );
}
