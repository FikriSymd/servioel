import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BoardPreview } from "@/components/board/BoardPreview";
import { ServiceCardView } from "@/components/board/ServiceCardView";
import { buatDataContoh, buatPratinjauSingkat } from "@/lib/sample-data";
import { AMBANG_NYANGKUT_HARI, STAGES } from "@/lib/stages";

export default function Beranda() {
  const pratinjau = buatPratinjauSingkat();
  const semua = buatDataContoh();
  const notaNyangkut = semua.find((o) => o.stage === "nunggu-sparepart")!;
  const notaJalan = semua.find((o) => o.stage === "dikerjakan")!;

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Pembuka: papannya sendiri jadi kepala halaman, bukan tangkapan layar hiasan. */}
        <section className="border-b border-bench-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:py-16">
            <div>
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-bench-text sm:text-5xl">
                Satu unit, satu nota, satu tempat di papan
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-bench-text/85">
                Servioel mengganti tumpukan nota kertas di toko servis HP dan
                elektronik. Tiap unit jadi satu nota bernomor yang bergerak dari
                Barang Masuk sampai Sudah Diambil, dan tiap perpindahan dicatat
                beserta siapa yang memindahkan.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/daftar"
                  className="inline-flex min-h-11 items-center justify-center rounded-control bg-signal px-5 text-sm font-bold text-ink"
                >
                  Daftarkan toko
                </Link>
                <Link
                  href="/papan"
                  className="inline-flex min-h-11 items-center justify-center rounded-control border border-bench-line px-5 text-sm font-semibold text-bench-text hover:border-signal"
                >
                  Coba papan contoh dulu
                </Link>
              </div>
              <p className="mt-3 text-[13px] text-bench-muted">
                Papan contoh tidak perlu akun, dan isinya data contoh.
              </p>
            </div>

            <div className="min-w-0">
              <BoardPreview orders={pratinjau} />
              <p className="mt-2.5 text-[13px] text-bench-muted">
                Tampilan papan yang sebenarnya, bisa digeser ke samping.
              </p>
            </div>
          </div>
        </section>

        {/* Satu nota, dibedah. Bukan grid kartu fitur. */}
        <section id="nota" className="border-b border-bench-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16 lg:py-16">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
                Isi satu nota
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-bench-text/85">
                Notanya kecil karena yang dibaca sambil berdiri di meja kerja cuma
                empat hal: unit apa, punya siapa, rusaknya apa, dan sudah berapa
                lama.
              </p>

              <dl className="mt-8 flex flex-col">
                {[
                  ["Nomor servis", "Penanda unit. Dibuat otomatis dan tidak dipakai ulang."],
                  ["Perforasi", "Garis putus antara kepala nota dan isinya."],
                  ["Nama dan nomor HP", "Untuk menelpon balik kalau ada yang perlu ditanya."],
                  ["Keluhan", "Ditulis seperti kata pelanggan, bukan istilah teknisi."],
                ].map(([istilah, arti]) => (
                  <div key={istilah} className="border-t border-bench-line py-4 first:border-t-0 first:pt-0">
                    <dt className="font-display text-sm font-bold text-bench-text">{istilah}</dt>
                    <dd className="mt-1 text-sm text-bench-muted">{arti}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="self-start">
              <div className="max-w-[17rem]">
                <ServiceCardView order={notaJalan} />
              </div>
              <p className="mt-3 text-[13px] text-bench-muted">Nota contoh, dari data contoh.</p>
            </div>
          </div>
        </section>

        {/* Bedanya nota biasa dan nota yang menginap, ditunjukkan bukan dijelaskan. */}
        <section className="border-b border-bench-line">
          <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
              Yang menginap kelihatan sendiri
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-bench-text/85">
              Kerugian terbesar toko servis bukan unit yang lama dikerjakan, tapi
              unit yang diam-diam menunggu sparepart berhari-hari tanpa ada yang
              sadar. Lewat {AMBANG_NYANGKUT_HARI} hari, kepala notanya berubah
              kuning dan angkanya menyebut sudah berapa lama.
            </p>

            <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="max-w-[17rem]">
                <ServiceCardView order={notaJalan} />
                <p className="mt-3 text-[13px] text-bench-muted">
                  Berjalan normal. Kepala nota tetap tinta.
                </p>
              </div>
              <div className="max-w-[17rem]">
                <ServiceCardView order={notaNyangkut} />
                <p className="mt-3 text-[13px] text-bench-muted">
                  Menginap. Kepala nota kuning, angkanya menyebut berapa hari.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alur tahap sebagai satu deret yang bisa digeser, bukan kartu bernomor. */}
        <section className="border-b border-bench-line">
          <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
              Alur yang dipakai toko servis
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-bench-text/85">
              Enam tahap, mengikuti cara unit benar-benar berpindah tangan. Bukan
              tiga kolom template.
            </p>

            <ol className="mt-8 -mx-4 flex gap-4 overflow-x-auto border-t border-bench-line px-4 pt-4">
              {STAGES.map((s) => (
                <li key={s.id} className="w-[14rem] shrink-0">
                  <h3 className="font-display text-sm font-bold text-bench-text">{s.label}</h3>
                  <p className="mt-2 text-[13px] leading-snug text-bench-muted">{s.arti}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Kalau dipakai kerja: apa yang berubah setelah ada akun toko. */}
        <section className="border-b border-bench-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16 lg:py-16">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
                Kalau dipakai kerja
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-bench-text/85">
                Papan contoh hanya untuk mencoba. Yang dipakai kerja adalah papan
                di dalam akun toko Anda, dan di sana tiap perubahan tersimpan.
              </p>
            </div>

            <dl className="flex flex-col">
              {[
                [
                  "Satu akun, satu toko",
                  "Toko mendaftar sendiri, lalu akun teknisi dan kasir dibuat pemilik dari dalam aplikasi. Data antar toko dipisahkan di server, bukan cuma disembunyikan di tampilan.",
                ],
                [
                  "Tiga peran",
                  "Pemilik mengelola akun dan mengarsipkan unit lama. Teknisi dan kasir memakai papan: menulis nota baru dan memindahkan tahap.",
                ],
                [
                  "Riwayat yang bisa ditelusuri",
                  "Tiap perpindahan tercatat lengkap: dari tahap mana, ke tahap mana, kapan, dan oleh siapa. Bukan cuma tahap terakhirnya.",
                ],
                [
                  "Papan tidak menumpuk selamanya",
                  "Unit yang sudah diambil dan lewat 30 hari dikeluarkan dari papan oleh pemilik toko. Datanya tetap tersimpan, cuma tidak lagi menutupi yang masih jalan.",
                ],
              ].map(([istilah, arti]) => (
                <div key={istilah} className="border-t border-bench-line py-4 first:border-t-0 first:pt-0">
                  <dt className="font-display text-sm font-bold text-bench-text">{istilah}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-bench-muted">{arti}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Bagian jujur: yang belum jadi, ditulis apa adanya. */}
        <section className="border-b border-bench-line">
          <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
                Yang belum jadi
              </h2>
              <ul className="flex flex-col">
                {[
                  "Cetak nota, invoice, dan pembayaran belum ada.",
                  "Notifikasi WhatsApp ke pelanggan belum ada.",
                  "Laporan bulanan dan rata-rata lama pengerjaan belum ada.",
                  "Lupa kata sandi belum ada. Kalau staf lupa, pemilik toko menyetel ulang sandinya dari halaman Staf.",
                  "Toko yang mendaftar langsung aktif, belum ada verifikasi email.",
                  "Field unit dan IMEI, estimasi biaya, dan tanggal janji belum ada di kartu.",
                  "Harga dan langganan belum diputuskan.",
                ].map((t) => (
                  <li
                    key={t}
                    className="border-t border-bench-line py-4 text-sm text-bench-muted first:border-t-0 first:pt-0"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-bench-text">
              Mulai dari toko Anda
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-bench-text/85">
              Daftarkan tokonya, tulis nota pertama, lalu pindahkan sampai Sudah
              Diambil. Papan contoh tetap bisa dibuka tanpa akun.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/daftar"
                className="inline-flex min-h-11 items-center justify-center rounded-control bg-signal px-5 text-sm font-bold text-ink"
              >
                Daftarkan toko
              </Link>
              <Link
                href="/masuk"
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-bench-line px-5 text-sm font-semibold text-bench-text hover:border-signal"
              >
                Masuk kalau sudah punya akun
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
