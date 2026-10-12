# Delivery Gate: Fase 1 Servioel

Tanggal: 2026-10-12. Mode antislop: during (preferensi global).
Tautan publik: https://vienna-exists-dance-legislation.trycloudflare.com

Laporan ini bukti, bukan klaim. Tiap baris PASS punya hasil nyata dari menjalankan
aplikasi dan mengklik tiap kontrol.

Revisi ini menggantikan laporan sebelumnya. Arah desain pertama ditolak pemilik
produk karena masih terasa seperti templat, lalu seluruh permukaan dibangun ulang
ke dunia meja kerja gelap dan nota kertas. Semua uji di bawah dijalankan ulang
setelah pembangunan ulang.

---

## Block 1: Hard Gate

- R-02 em dash: **PASS.** `grep` karakter em dash dan en dash di `src/` dan `docs/` bersih.
- R-03 mobile: **PASS.** 390px di `/`, `/papan`, `/masuk`: overflow false, target ketuk di bawah 44px nol.
- R-17 angka tanpa sumber: **PASS.** Angka yang tampil hanya hitungan data contoh, dan itu ditandai "Data contoh".
- R-18 testimoni: **PASS.** Tidak ada bagian testimoni.
- R-23 aset tanpa izin: **PASS.** Tidak ada logo, avatar, atau statistik karangan. Nama toko ditulis sebagai teks.
- R-24 tautan navigasi mati: **PASS.** Tautan navbar hanya `/` dan `/papan`; keduanya ada. Tautan `#nota` ada di landing.
- R-25 kontras: **PASS.** Audit DOM: 0 gagal di tiga halaman. Script resmi mengonfirmasi 13 pasangan lolos.
- R-26 kontrol mati: **PASS.** Semua tombol punya perilaku nyata (lihat klik-through). Tidak ada tombol placeholder.
- R-27 status UI: **PASS.** Kosong, memuat, gagal ada dan bisa dipratinjau. Ketiganya diuji.
- R-28 FAQ: **PASS.** Tidak ada FAQ.
- R-32 keyboard: **PASS.** Tab berhenti di semua kontrol, outline terlihat, Escape menutup dialog, Space dan panah memindahkan nota.
- R-33 patch via script: **PASS.** Tidak ada skrip yang menulis ulang CSS atau sumber.
- R-34 tema: **PASS.** Satu tema (gelap). Tidak ada toggle yang bisa rusak.
- R-35 verifikasi: **PASS.** Aplikasi dijalankan dan tiap kontrol diklik; hasilnya di bawah.
- R-36 klaim palsu: **PASS.** Tidak ada klaim keamanan, sertifikasi, atau kinerja.
- R-37 arah desain: **PASS.** `docs/DESIGN.md` ada, dan berisi alasan tiap keputusan.
- R-38 konten karangan: **PASS.** Nota contoh ditandai; tidak ada data yang menyamar sebagai nyata.

## Block 2: Purpose-Gate

- R-01 gradient/glow: **PASS.** Audit DOM: gradient 0, blur 0. Tidak ada glow.
- R-04 ikon: **PASS.** Tidak ada ikon. Label teks yang bekerja.
- R-06 tipografi: **PASS.** Archivo untuk kepala dan angka, Barlow untuk isi. Alasan ditulis di DESIGN.md. Tanpa monospace raksasa, tanpa label HURUF BESAR berjarak lebar.
- R-07 latar pola: **PASS.** Tidak ada grid, titik, atau blueprint.
- R-08 panah tombol: **PASS.** Tidak ada panah dekoratif.
- R-09 badge: **PASS.** Tidak ada badge kapsul. Tidak ada pil di atas judul.
- R-10 glassmorphism: **PASS.** backdrop-filter 0.
- R-12 shadow: **PASS.** Satu bayangan saja: nota yang sedang diangkat. Alasannya ditulis di kode.
- R-13 glow: **PASS.** Tidak ada.
- R-14 kartu seragam: **PASS.** Nota papan memang harus seragam (itu daftar kerja), bukan kartu fitur.
- R-19 animasi: **PASS.** Gerak hanya di transisi hover/fokus dan denyut rangka saat memuat. Tidak ada animasi jalan sendiri.
- R-22 ilustrasi: **PASS.** Tidak ada ilustrasi stok.

## Block 3: Liveliness

- Dial eksplisit: **PASS.** ENERGY 2 / RHYTHM 2 / MOTION 1, di DESIGN.md.
- Konsisten dengan dial: **PASS.** Papan kalem, landing sedikit lebih hidup. Tanpa animasi jalan sendiri.
- Satu titik fokus per layar: **PASS.** Papan: nota yang diangkat. Landing: judul lalu papan pratinjau.
- Ruang kosong sebagai struktur: **PASS.** Pemisah antar bagian, bukan sisa tempat.
- Satu aksen sengaja: **PASS.** Oranye hanya untuk tindakan utama, keadaan terpilih, dan penanda nota menginap. Tidak di ikon, garis, atau latar.
- Motif identitas: **PASS.** Nomor servis sebagai stempel di kepala tiap nota, di detail, dan di pratinjau.

## Block 4: Craftsmanship & Quality Locks

- C-1 alasan "bawaan AI": **PASS.** Tiap keputusan visual ada alasannya di DESIGN.md atau komentar kode.
- C-2 kontrol tanpa label: **PASS.** Tidak ada.
- C-3 bagian pengisi template: **PASS.** Tidak ada bagian harga, testimoni, FAQ, atau logo klien. Bagian "Yang belum jadi" menggantikan klaim palsu.
- C-4 rusak di suatu state: **PASS.** Kosong, memuat, gagal, 390px, dan keyboard semua diuji.
- C-5 klaim karangan: **PASS.** Tidak ada.
- R-05 tata letak template: **PASS.** Enam tahap dari alur kerja, bukan tiga kolom template. Tanpa baris statistik, bento, terminal palsu, footer empat kolom, kartu fitur bernomor, dan blok ajakan berbingkai.
- R-11 radius: **PASS.** Dua radius: 2px nota, 2px kontrol. Tidak ada yang pil.
- R-15 CTA generik: **PASS.** "Buka papan contoh", "Nota servis baru", "Lihat status daftar".
- R-16 buzzword: **PASS.** Tidak ada.
- R-20 identitas: **PASS.** Tukar nama, karakter "meja kerja dan nota servis" tetap kelihatan.
- R-21 tema: **PASS.** Gelap dipilih karena papan dilihat sepanjang hari dan nota kertas jadi terang sendiri di atasnya. Tidak ada mode terang yang ditunda.
- R-29 palet: **PASS.** Dua bahan (meja gelap, kertas) plus satu aksen plus netral.
- R-30 klon produk: **PASS.** Bukan tiruan Linear, Vercel, Stripe, atau Notion.
- R-31 alasan satu baris: **PASS.** Ada di DESIGN.md dan komentar kode.

---

## Klik-through (bukti R-35)

Dijalankan lewat lokal dan lewat URL publik.

| Kontrol | Hasil nyata |
|---|---|
| `Buka papan contoh` (landing) | Pindah ke `/papan` |
| `Lihat isi satu nota` (landing) | Menggulir ke `#nota`, ada |
| Seret nota (mouse) | SV-2026-0007 dari Barang Masuk ke Nunggu Sparepart; pengumuman "dipindahkan ke tahap Nunggu Sparepart" |
| Keyboard: Tab, Space, panah, Space | SV-2026-0007 berpindah satu tahap tanpa seret |
| Klik nota | Detail terbuka, fokus pindah ke tombol Tutup |
| Riwayat di detail | Tiga baris berurutan, terbaru di atas |
| Tombol tahap di detail | Memindahkan nota; tahap sekarang jadi nonaktif dan ditandai "sekarang" |
| Escape | Dialog tertutup |
| `Nota servis baru` | Form terbuka, fokus ke kolom nama |
| Submit kosong | Tiga pesan galat muncul, `aria-invalid` terpasang |
| Submit terisi | Nota baru dibuat di Barang Masuk |
| Pratinjau `Kosong` | "Papan masih kosong" plus tombol "Tulis nota pertama" |
| Pratinjau `Memuat` | `aria-busy=true`, rangka denyut dan teks "Memuat papan servis" |
| Pratinjau `Gagal` | role=alert "Papan gagal dimuat" plus tombol "Coba lagi" yang memuat ulang |
| Tab tahap di HP | Tab aktif berpindah, daftar nota ikut berubah |
| Detail di HP | Terbuka sebagai lembaran penuh lebar layar |
| Tautan footer | `/papan` hidup |

Konsol: 0 error di ketiga halaman.

## Hasil audit terhitung

- Kontras: 0 gagal di `/`, `/papan`, `/masuk` (audit DOM, termasuk latar sebenarnya per elemen).
- Script kontras resmi: 13 pasangan PASS.
- Pola terlarang: gradien 0, blur 0, bayangan dekoratif 0, garis tepi kiri 0, emoji 0, kartu berbingkai penuh di lajur papan 0.
- Radius di atas 8px: 1, yaitu titik sinyal di kepala halaman (memang bulat, 10px).

## Sisa yang bukan temuan gagal

- Belum ada data nyata. Ini fase frontend, jadi memang begitu.
- PostgreSQL belum dipasang. Fase 2.
- Lambang toko belum ada, jadi nama ditulis sebagai teks.
- Alamat kontak dibiarkan kosong atas permintaan pemilik produk.
