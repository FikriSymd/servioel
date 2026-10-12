# Delivery Gate: Fase 1 Servioel

Tanggal: 2026-10-12. Mode antislop: during (preferensi global).
Tautan publik: https://vienna-exists-dance-legislation.trycloudflare.com

Laporan ini bukti, bukan klaim. Tiap baris PASS punya hasil nyata dari menjalankan
aplikasi dan mengklik tiap kontrol.

---

## Block 1: Hard Gate

- R-02 em dash: **PASS.** `grep -P '[\x{2014}\x{2013}]'` di PRD.md dan DESIGN.md bersih.
- R-03 mobile: **PASS.** 390px di `/`, `/papan`, `/masuk`: overflow false, target ketuk di bawah 44px nol.
- R-17 angka tanpa sumber: **PASS.** Angka yang tampil hanya hitungan data contoh, dan itu ditandai "Data contoh".
- R-18 testimoni: **PASS.** Tidak ada bagian testimoni.
- R-23 aset tanpa izin: **PASS.** Tidak ada logo/avatar/statistik karangan. Wordmark teks, kontak `[EMAIL KONTAK]`.
- R-24 tautan navigasi mati: **PASS.** Tautan navbar hanya `/`, `/papan`, `/masuk`; semua halaman ada. `#tahap` ada di landing.
- R-25 kontras: **PASS.** Audit DOM: 0 gagal di tiga halaman. Script resmi mengonfirmasi semua pasangan lolos.
- R-26 kontrol mati: **PASS.** Semua tombol punya perilaku nyata (klik-through di bawah). Tidak ada tombol placeholder.
- R-27 status UI: **PASS.** Kosong, memuat, gagal ada dan bisa dipratinjau. Ketiganya diuji.
- R-28 FAQ: **PASS.** Tidak ada FAQ.
- R-32 keyboard: **PASS.** Tab berhenti di semua kontrol, outline terlihat, Escape menutup dialog, Space/panah memindahkan kartu.
- R-33 patch via script: **PASS.** Tidak ada skrip yang menulis ulang CSS/sumber.
- R-34 tema: **PASS.** Hanya satu tema (terang). Tidak ada toggle yang bisa rusak.
- R-35 verifikasi: **PASS.** Aplikasi dijalankan dan tiap kontrol diklik; hasilnya di bawah.
- R-36 klaim palsu: **PASS.** Tidak ada klaim keamanan/sertifikasi/kinerja.
- R-37 arah desain: **PASS.** `docs/DESIGN.md` ada dan disetujui pemilik produk.
- R-38 konten karangan: **PASS.** Kartu contoh bernama "Pelanggan A..H" dan ditandai; tidak ada data yang menyamar sebagai nyata.

## Block 2: Purpose-Gate

- R-01 gradient/glow: **PASS.** Audit DOM: gradient 0, blur 0. Tidak ada glow.
- R-04 ikon: **PASS.** Tidak ada ikon sama sekali. Label teks yang bekerja.
- R-06 tipografi: **PASS.** Plus Jakarta Sans, alasan ditulis di DESIGN.md. Tanpa monospace raksasa dan tanpa label HURUF BESAR jarak lebar.
- R-07 latar pola: **PASS.** Tidak ada grid/dot/blueprint.
- R-08 panah tombol: **PASS.** Tidak ada panah dekoratif.
- R-09 badge: **PASS.** Tidak ada badge kapsul. Tidak ada pil di atas H1.
- R-10 glassmorphism: **PASS.** backdrop-filter 0.
- R-12 shadow: **PASS.** Satu bayangan saja: kartu yang sedang diangkat. Alasannya ditulis di kode.
- R-13 glow: **PASS.** Tidak ada.
- R-14 kartu seragam: **PASS.** Kartu papan memang harus seragam (itu daftar kerja), bukan kartu fitur.
- R-19 animasi: **PASS.** Gerak hanya di transisi hover/fokus dan denyut skeleton saat memuat. Tidak ada animasi jalan sendiri.
- R-22 ilustrasi: **PASS.** Tidak ada ilustrasi stok.

## Block 3: Liveliness

- Dial eksplisit: **PASS.** ENERGY 2 / RHYTHM 2 / MOTION 1, di DESIGN.md.
- Konsisten dengan dial: **PASS.** Papan kalem, landing sedikit lebih hidup. Tanpa animasi jalan sendiri.
- Satu titik fokus per layar: **PASS.** Papan: kartu yang diangkat. Landing: H1 lalu papan pratinjau.
- Ruang kosong sebagai struktur: **PASS.** Pemisah antar bagian, bukan sisa tempat.
- Satu aksen sengaja: **PASS.** Oranye hanya untuk tindakan utama dan penanda nyangkut. Tidak di ikon, garis, atau latar.
- Motif identitas: **PASS.** Nomor servis besar sebagai penanda di kartu, detail, dan pratinjau.

## Block 4: Craftsmanship & Quality Locks

- C-1 alasan "bawaan AI": **PASS.** Tiap keputusan visual ada alasannya di DESIGN.md atau komentar kode.
- C-2 kontrol tanpa label: **PASS.** Tidak ada.
- C-3 bagian pengisi template: **PASS.** Tidak ada bagian harga, testimoni, FAQ, atau logo klien. Bagian "Yang belum jadi" menggantikan klaim palsu.
- C-4 rusak di suatu state: **PASS.** Kosong/memuat/gagal, 390px, dan keyboard semua diuji.
- C-5 klaim karangan: **PASS.** Tidak ada.
- R-05 tata letak template: **PASS.** Enam tahap dari alur kerja, bukan tiga kolom template. Tidak ada baris statistik, bento, terminal palsu, atau footer empat kolom.
- R-11 radius: **PASS.** Dua radius: 4px kartu, 6px kontrol. Tidak ada yang pil.
- R-15 CTA generik: **PASS.** "Buka papan contoh", "Buat kartu servis pertama", "Lihat status daftar".
- R-16 buzzword: **PASS.** Tidak ada.
- R-20 identitas: **PASS.** Tukar logo dan nama, karakter "nota servis" tetap kelihatan.
- R-21 tema: **PASS.** Terang dipilih karena alat kerja siang hari. Tidak ada dark mode dipaksakan, tidak ada toggle yang ditunda.
- R-29 palet: **PASS.** Dua warna inti plus satu aksen plus netral.
- R-30 klon produk: **PASS.** Bukan tiruan Linear/Vercel/Stripe/Notion.
- R-31 alasan satu baris: **PASS.** Ada di DESIGN.md dan komentar kode.

---

## Klik-through (bukti R-35)

Semua dijalankan lewat URL publik dan lewat lokal.

| Kontrol | Hasil nyata |
|---|---|
| `Buka papan contoh` (landing) | Pindah ke `/papan` |
| `Lihat alur tahapnya` (landing) | Menggulir ke `#tahap`, ada |
| Drag kartu (mouse) | SV-2026-0007 Barang Masuk ke Dikerjakan; pengumuman "dipindahkan ke tahap Dikerjakan" |
| Drag kartu lewat tunnel publik | SV-2026-0008 Barang Masuk ke Diagnosa |
| Keyboard: Tab, Space, panah kanan, Space | SV-2026-0008 Barang Masuk ke Diagnosa, tanpa drag |
| Klik kartu | Detail terbuka, fokus pindah ke tombol Tutup |
| Tombol tahap di detail | Memindahkan kartu; tahap sekarang ikut berubah |
| Escape | Dialog tertutup |
| `Kartu servis baru` | Form terbuka |
| Submit kosong | Tiga pesan galat muncul, `aria-invalid` terpasang |
| Submit terisi | Kartu SV-2026-0009 dibuat di Barang Masuk |
| Pratinjau `Kosong` | "Papan masih kosong" plus tombol "Buat kartu servis pertama" |
| Pratinjau `Memuat` | `aria-busy=true`, skeleton dan teks "Memuat papan servis" |
| Pratinjau `Gagal` | role=alert "Papan gagal dimuat" plus tombol "Coba lagi" yang memuat ulang |
| Menu di HP | Terbuka dan tertutup |
| Ganti tab tahap di HP | Tab aktif berpindah, daftar kartu ikut berubah |
| Tautan footer | `/papan` dan `/masuk` keduanya hidup |

Konsol: 0 error di ketiga halaman.

## Sisa yang bukan temuan gagal

- Blok "Kontak: [EMAIL KONTAK]" adalah placeholder bertanda, menunggu email asli.
- Belum ada data nyata. Ini fase frontend, jadi memang begitu.
- PostgreSQL belum dipasang. Fase 2.
