import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BoardPreview } from "@/components/board/BoardPreview";
import { buatPratinjauSingkat } from "@/lib/sample-data";
import { STAGES } from "@/lib/stages";

export default function Beranda() {
  const pratinjau = buatPratinjauSingkat();

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:py-16">
            <div>
              <p className="text-sm font-semibold text-accent">
                Untuk toko servis HP dan elektronik
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Ganti nota kertas dengan papan servis yang bisa dilihat semua orang
                di toko
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted">
                Satu unit servis jadi satu kartu. Kartunya bergerak dari barang
                masuk sampai sudah diambil, dan tiap perpindahan tercatat. Saat
                pelanggan menelpon, statusnya kelihatan tanpa membalik tumpukan
                nota.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/papan"
                  className="inline-flex min-h-11 items-center justify-center rounded-control bg-accent px-5 text-sm font-semibold text-paper"
                >
                  Buka papan contoh
                </Link>
                <Link
                  href="#tahap"
                  className="inline-flex min-h-11 items-center justify-center rounded-control border border-line-strong px-5 text-sm font-semibold"
                >
                  Lihat alur tahapnya
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted">
                Papan contoh memakai data contoh, bukan data toko nyata.
              </p>
            </div>

            <div className="min-w-0 lg:pl-4">
              <BoardPreview orders={pratinjau} />
              <p className="mt-2 text-xs text-muted">
                Tampilan papan sebenarnya. Bisa digeser ke samping untuk melihat
                tahap lain.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Kenapa kertas dan grup chat bikin repot
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-base font-bold">Yang terjadi sekarang</h3>
                <ul className="mt-3 flex flex-col gap-3 text-sm">
                  <li className="border-l-2 border-line-strong pl-3">
                    Unit yang nyangkut nunggu sparepart tidak kelihatan, jadi
                    diam-diam menginap berminggu-minggu.
                  </li>
                  <li className="border-l-2 border-line-strong pl-3">
                    Pemilik tidak tahu berapa unit yang sedang dikerjakan tanpa
                    bertanya ke teknisi.
                  </li>
                  <li className="border-l-2 border-line-strong pl-3">
                    Nota hilang atau tulisan tidak terbaca, dan riwayat unit
                    lenyap bersamanya.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-bold">Yang jadi kalau pakai papan</h3>
                <ul className="mt-3 flex flex-col gap-3 text-sm">
                  <li className="border-l-2 border-accent pl-3">
                    Semua unit dan tahapnya kelihatan dalam satu layar, termasuk
                    yang sudah lama tidak bergerak.
                  </li>
                  <li className="border-l-2 border-accent pl-3">
                    Tiap perpindahan tahap dicatat: siapa yang mindahin dan kapan.
                  </li>
                  <li className="border-l-2 border-accent pl-3">
                    Teknisi memindahkan kartu langsung dari HP sambil bekerja.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="tahap" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Enam tahap, mengikuti alur kerja nyata
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Bukan tiga kolom template. Tahapnya dibuat dari cara unit servis
              benar-benar berpindah tangan.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STAGES.map((s, i) => (
                <li
                  key={s.id}
                  className="rounded-card border border-line bg-surface p-4"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="angka text-xs font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-bold">{s.label}</h3>
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{s.arti}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Yang belum jadi
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Bagian ini ditulis apa adanya supaya tidak ada yang dikira sudah ada
              padahal belum.
            </p>
            <ul className="mt-5 grid gap-3 text-sm md:grid-cols-2">
              {[
                "Penyimpanan permanen: papan masih memakai data contoh dan belum tersambung database.",
                "Daftar toko dan login belum ada, jadi belum ada pemisahan data antar toko.",
                "Akun staf (teknisi dan kasir) belum bisa dibuat.",
                "Cetak nota, invoice, dan pembayaran belum ada.",
                "Notifikasi WhatsApp ke pelanggan belum ada.",
                "Harga dan langganan belum diputuskan.",
              ].map((t) => (
                <li
                  key={t}
                  className="rounded-card border border-dashed border-line-strong px-4 py-3 text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="rounded-card border border-line-strong bg-tint px-5 py-8 sm:px-8">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Cobain papannya dulu
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Papan contoh bisa dibuka tanpa daftar. Pindahkan kartu, buat kartu
                baru, dan lihat riwayat perpindahannya.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/papan"
                  className="inline-flex min-h-11 items-center justify-center rounded-control bg-accent px-5 text-sm font-semibold text-paper"
                >
                  Buka papan contoh
                </Link>
                <Link
                  href="/masuk"
                  className="inline-flex min-h-11 items-center justify-center rounded-control border border-line-strong bg-surface px-5 text-sm font-semibold"
                >
                  Lihat status daftar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
