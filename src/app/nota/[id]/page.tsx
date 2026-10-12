import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { TombolCetak } from "@/components/nota/TombolCetak";
import { wajibMasuk } from "@/lib/dal";
import { ambilPesanan } from "@/lib/orders";
import { hariDiTahap, stageLabel } from "@/lib/stages";
import { tanggalJam, tanggalPanjang } from "@/lib/tanggal";

export const metadata: Metadata = {
  title: "Nota servis, Servioel",
  // Nota kerja tidak perlu muncul di hasil pencarian.
  robots: { index: false, follow: false },
};

/**
 * Alamat lengkap untuk tautan pelanggan.
 *
 * Harus lengkap, bukan cuma `/n/xxx`, karena nota ini dicetak dan dibaca di
 * luar aplikasi. Alamatnya dibaca dari permintaan yang sedang berjalan, jadi
 * yang tercetak adalah alamat yang benar-benar sedang dipakai toko: alamat
 * publik saat dipakai kerja, alamat lokal saat diuji.
 */
async function alamatTautan(token: string): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  if (!host) return `/n/${token}`;
  const proto = h.get("x-forwarded-proto")?.split(",")[0].trim() || "http";
  return `${proto}://${host}/n/${token}`;
}

/**
 * Nota satu unit, siap dicetak.
 *
 * Halaman ini sengaja berdiri sendiri, di luar kerangka area kerja: yang dicetak
 * cuma notanya, bukan menu dan tombolnya. Notanya tetap kertas di atas meja
 * gelap, jadi tampilannya sama dengan nota di papan.
 *
 * Isinya dirender di server, jadi notanya sudah lengkap di HTML pertama dan
 * masih bisa dicetak lewat Ctrl+P kalau JavaScript belum jalan.
 *
 * Catatan: alamat dan telepon toko belum ada di nota, karena datanya memang
 * belum ada. Bagian itu dibiarkan kosong, bukan diisi contoh karangan.
 */
export default async function HalamanNota({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sesi = await wajibMasuk();
  const nota = await ambilPesanan(sesi.toko.id, id);
  if (!nota) notFound();

  const hari = hariDiTahap(nota.masukTahapPada);
  const sudahDiambil = nota.stage === "sudah-diambil";
  const tautan = await alamatTautan(nota.token);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-6 print:max-w-none print:p-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/app"
            className="inline-flex min-h-11 items-center rounded-control border border-bench-line px-4 text-sm font-semibold text-bench-text hover:border-signal"
          >
            Kembali ke papan
          </Link>
          <TombolCetak />
        </div>

        <article className="on-paper bg-paper px-6 py-6 text-ink print:px-0 print:py-0">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg font-extrabold tracking-tight">
                {sesi.toko.nama}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-muted">Nota servis</p>
            </div>
            <div className="text-right">
              <p className="angka font-display text-3xl font-extrabold leading-none tracking-tight">
                {nota.nomor}
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">
                Diterima {tanggalPanjang(nota.dibuatPada)}
              </p>
            </div>
          </header>

          <div className="mt-5 border-t border-dashed border-ink/30" />

          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 print:grid-cols-2">
            <div className="sm:col-span-2 print:col-span-2">
              <dt className="font-display text-[11px] font-bold text-ink-muted">
                Perangkat
              </dt>
              <dd className="mt-1 text-lg font-semibold">
                {nota.perangkat.trim() || "Belum dicatat"}
              </dd>
            </div>

            <div>
              <dt className="font-display text-[11px] font-bold text-ink-muted">
                Pelanggan
              </dt>
              <dd className="mt-1 text-sm font-semibold">{nota.pelanggan}</dd>
              <dd className="angka mt-0.5 text-[13px] text-ink-muted">{nota.telepon}</dd>
            </div>

            <div>
              <dt className="font-display text-[11px] font-bold text-ink-muted">
                Tahap sekarang
              </dt>
              <dd className="mt-1 text-sm font-semibold">{stageLabel(nota.stage)}</dd>
              {!sudahDiambil && hari >= 1 && (
                <dd className="mt-0.5 text-[13px] text-ink-muted">
                  {hari} hari di tahap ini
                </dd>
              )}
            </div>

            <div className="sm:col-span-2 print:col-span-2">
              <dt className="font-display text-[11px] font-bold text-ink-muted">
                Keluhan yang dilaporkan
              </dt>
              <dd className="mt-1 text-sm leading-relaxed">{nota.keluhan}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-dashed border-ink/30" />

          <section className="mt-5">
            <h2 className="font-display text-[11px] font-bold text-ink-muted">
              Cek status sendiri
            </h2>
            <p className="angka mt-1 break-all text-sm font-semibold">{tautan}</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              Buka alamat itu di HP untuk melihat unit ini sudah sampai tahap mana,
              tanpa perlu menelpon toko.
            </p>
          </section>

          <section className="mt-6">
            <h2 className="font-display text-[11px] font-bold text-ink-muted">
              Riwayat perpindahan
            </h2>
            <ol className="mt-2 flex flex-col">
              {nota.riwayat.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-dashed border-ink/25 py-1.5 text-[13px] first:border-t-0"
                >
                  <span className="font-semibold">
                    {m.dari
                      ? `${stageLabel(m.dari)} ke ${stageLabel(m.ke)}`
                      : `Masuk ke ${stageLabel(m.ke)}`}
                  </span>
                  <span className="text-ink-muted">{tanggalJam(m.pada)}</span>
                </li>
              ))}
            </ol>
          </section>

          <footer className="mt-6 border-t border-ink/20 pt-3 text-[13px] text-ink-muted">
            <p>Simpan nota ini. Ambil unit dengan menunjukkan nomor servis di atas.</p>
            {nota.diubahPada && (
              <p className="mt-1">
                Isi nota ini pernah dibetulkan
                {nota.diubahOleh ? ` oleh ${nota.diubahOleh}` : ""} pada{" "}
                {tanggalJam(nota.diubahPada)}.
              </p>
            )}
          </footer>
        </article>
      </div>
    </main>
  );
}
