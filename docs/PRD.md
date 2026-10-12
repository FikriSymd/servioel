# PRD: Servioel

Papan servis untuk toko servis HP/elektronik. Produk SaaS, dijual ke banyak toko.

Status: **draft untuk disetujui**. Belum ada kode.
Versi: 0.1. Tanggal: 2026-10-12.

---

## 1. Overview

### Problem Statement

Toko servis HP/elektronik kecil mencatat servisan di nota kertas atau grup WhatsApp. Akibatnya pemilik tidak tahu berapa unit yang sedang dikerjakan, berapa yang nyangkut nunggu sparepart, dan berapa lama satu unit sudah menginap di toko. Saat pelanggan menelpon, jawabannya dicari dengan membalik tumpukan kertas atau bertanya ke teknisi.

### Proposed Solution

Servioel mengganti nota kertas dengan papan kanban alur servis. Tiap unit servis jadi satu kartu, dan kartu itu bergerak antar tahap dengan drag-and-drop (atau ketuk, untuk HP). Papan menampilkan alur nyata toko servis: Barang Masuk, Diagnosa, Nunggu Sparepart, Dikerjakan, Selesai, Sudah Diambil. Setiap perpindahan tahap dicatat, jadi riwayat unit bisa ditelusuri.

### Success Metrics

Produk baru, jadi belum ada baseline. Semua angka di bawah adalah **target yang harus diukur**, bukan hasil yang sudah terjadi. Cara mengukurnya diisi di kolom terakhir saat fase pengukuran.

| Metrik | Baseline | Target | Kenapa ini yang diukur | Cara ukur |
|---|---|---|---|---|
| Waktu cari status satu unit | belum ada (kertas) | di bawah 10 detik dari buka papan | Ini masalah utamanya: pelanggan nunggu sambil dicari | Ukur manual, 5 unit acak |
| Kartu nyangkut di "Nunggu Sparepart" lebih dari 3 hari | belum ada | terlihat di layar tanpa dicari | Nyangkut diam-diam adalah penyebab komplain | Hitung dari tanggal masuk tahap |
| Toko yang menyelesaikan onboarding (daftar sampai kartu pertama dibuat) | belum ada | 1 dari 1 toko uji | Kalau orang bingung pas daftar, sisanya tidak penting | Uji langsung ke pemilik toko |
| Guardrail: kartu hilang atau dobel | belum ada | 0 | Papan yang datanya bisa hilang lebih buruk dari kertas | Bandingkan jumlah kartu vs jumlah unit nyata |

---

## 2. Context & Background

### Why Now

Papan ini dikerjakan sekarang karena mau dijadikan produk jualan, bukan alat internal. Fase pertama fokus ke tampilan (frontend) supaya bisa dilihat dan direvisi cepat lewat tautan internet, sebelum backend diinvestasikan.

### Target User

- **Pemilik toko (owner).** Mau tahu kondisi toko tanpa harus ada di tempat. Umumnya bukan orang teknis, pakai HP.
- **Teknisi.** Yang benar-benar mengerjakan unit. Tangannya sering kotor atau pegang alat, jadi HP lebih masuk akal dari laptop. Yang paling sering pakai papan.
- **Kasir / front desk.** Yang menerima pelanggan dan barang. Yang bikin kartu baru dan menyerahkan unit yang sudah selesai.

### Kondisi Sekarang

Nota kertas, buku catatan, atau grup WhatsApp. Tidak ada satu tempat yang menunjukkan semua unit dan posisinya.

---

## 3. User Stories & Use Cases

**US1. Terima barang (kasir)**
Sebagai kasir, saya mau membuat kartu servis baru saat pelanggan menyerahkan unit, supaya unit itu langsung terlihat di papan.
- Kartu baru masuk ke tahap "Barang Masuk".
- Isi kartu: nama perangkat (merek dan tipe), nama pelanggan, nomor HP pelanggan, keluhan/kerusakan yang dilaporkan.
- Nomor servis dibuat otomatis dan tidak boleh dobel.
- Setelah simpan, kartu langsung muncul di papan tanpa muat ulang.

**US2. Pindahkan tahap (teknisi, di HP)**
Sebagai teknisi, saya mau memindahkan kartu ke tahap berikutnya sambil kerja, supaya status unit selalu benar.
- Bisa dengan drag-and-drop di laptop.
- Bisa dengan ketuk kartu lalu pilih tahap di HP (drag di layar kecil tidak nyaman dan tidak selalu jalan).
- Bisa dengan keyboard di laptop (Tab ke kartu, lalu pindah tahap lewat tombol).
- Perpindahan tercatat: siapa, kapan, dari tahap mana ke tahap mana.

**US3. Lihat kondisi papan (owner)**
Sebagai pemilik, saya mau melihat seluruh unit dan tahapnya dalam satu layar, supaya tahu mana yang perlu dikejar.
- Tiap kolom menampilkan jumlah kartunya.
- Kartu yang sudah lama di satu tahap terlihat berbeda, tanpa perlu diklik.
- Bisa dibuka dari HP.

**US4. Kelola akun staf (owner)**
Sebagai pemilik, saya mau menambah akun teknisi dan kasir dari dalam aplikasi, supaya staf bisa login sendiri.
- Owner bisa membuat akun staf dengan peran teknisi atau kasir.
- Akun satu toko tidak bisa melihat data toko lain.

**US5. Lihat detail unit (semua peran)**
Sebagai pengguna, saya mau membuka satu kartu dan melihat isinya, supaya bisa menjawab pertanyaan pelanggan.
- Detail menampilkan perangkat, data pelanggan, keluhan, tahap sekarang, dan riwayat perpindahan.

---

## 4. Requirements

### Functional, P0 (wajib ada di V1)

- Daftar toko baru (email + password). Tiap toko datanya terpisah total.
- Login dan logout. Sesi bertahan.
- Tiga peran: owner, teknisi, kasir. Owner bisa membuat akun staf.
- Papan kanban 6 tahap: Barang Masuk, Diagnosa, Nunggu Sparepart, Dikerjakan, Selesai, Sudah Diambil.
- Pencarian unit di papan: nomor HP, nama pelanggan, nama perangkat, atau nomor nota. Bentuk tulisan tidak perlu persis (spasi, tanda hubung, besar-kecil huruf diabaikan).
- Buat kartu servis baru (perangkat, nama, nomor HP, keluhan).
- Betulkan isi nota (perangkat, nama, nomor HP, keluhan). Nomor servis dan tahap tidak ikut berubah. Tercatat siapa yang membetulkan dan kapan.
- Pindah kartu antar tahap lewat drag-and-drop (laptop), ketuk (HP), dan keyboard.
- Riwayat perpindahan per kartu (siapa, kapan, dari dan ke tahap mana).
- Detail kartu.
- Nota siap cetak untuk diserahkan ke pelanggan (`/nota/<id>`).
- Tautan status per nota (`/n/<token>`) yang bisa dibuka pelanggan tanpa akun, hanya menampilkan unitnya sudah sampai tahap mana.
- Landing page jualan yang jujur: tidak ada angka karangan, tidak ada testimoni palsu, tidak ada tombol mati.

### Functional, P1 (setelah V1 terbukti)

- Estimasi biaya dan tanggal janji selesai di kartu.
- Catatan teknisi (internal, tidak dilihat pelanggan).
- Tandai teknisi penanggung jawab di kartu.
- Riwayat servis per pelanggan (pernah servis apa saja).
- Alamat dan telepon toko, supaya ikut tercetak di nota.
- Lupa kata sandi lewat email.

### Functional, P2 (nanti)

- Model unit dan IMEI/serial number.
- Invoice dan pembayaran.
- Notifikasi WhatsApp otomatis ke pelanggan saat status berubah.
- Langganan berbayar dan pembatasan jumlah staf per paket.
- Laporan: jumlah servis per bulan, rata-rata lama pengerjaan.
- Multi-cabang dalam satu toko.

### Non-Functional

- **Mobile:** papan harus bisa dipakai penuh di HP. Tidak ada scroll horizontal yang bocor, target ketuk minimal 44x44 px, kolom tidak bertabrakan.
- **Keyboard:** semua kontrol bisa dicapai dengan Tab dan dijalankan dengan Enter/Space. Modal ditutup dengan Escape. Indikator fokus terlihat jelas.
- **Kontras:** teks normal minimal 4.5:1, teks besar dan batas komponen minimal 3:1.
- **Bahasa:** seluruh UI Bahasa Indonesia.
- **Target perangkat:** Chrome/Safari versi terbaru di Android dan iOS, plus desktop.
- **Kinerja:** papan 200 kartu tetap responsif saat drag.
- **Data:** satu toko tidak bisa membaca data toko lain, ditegakkan di server, bukan hanya di tampilan.

---

## 5. Design & UX

### Arah Desain

Ada di `docs/DESIGN.md`. Ringkasnya: dunia visual "meja kerja servis dan nota servis", bukan tampilan SaaS gelap bergradasi ungu. Papan jadi inti, bukan hiasan.

Dua permukaan, dua mode:
- **Landing page** (mode Persuade): meyakinkan pemilik toko bahwa ini lebih baik dari kertas.
- **Papan kerja** (mode Operate): dipakai sambil kerja, yang penting cepat dipindai, bukan yang penting cantik.

### Alur Utama

1. Daftar toko, buat akun pertama sebagai owner, langsung masuk ke papan kosong dengan panduan singkat.
2. Buat kartu servis pertama, kartu muncul di kolom "Barang Masuk".
3. Pindahkan kartu antar tahap sampai "Sudah Diambil".

### Titik yang Paling Rawan Salah

- **Papan di HP.** Enam kolom tidak mungkin berdampingan di layar HP. Rencananya: pemilih tahap di atas (bisa digeser) plus daftar kartu tahap terpilih di bawahnya. Drag tetap ada di laptop, ketuk-untuk-pindah jadi jalur utama di HP.
- **Papan kosong.** Toko baru belum punya kartu. Layar kosong harus menjelaskan dan memberi satu tindakan, bukan "Tidak ada data".
- **Kartu yang nyangkut.** Kalau tidak ada penanda, unit yang menginap lama tidak akan kelihatan.

### Status Layar yang Harus Ada

Kosong, memuat, dan gagal, untuk: papan, daftar staf, dan riwayat kartu. Tiap status menyebut penyebab dan tindakan berikutnya.

---

## 6. Technical Considerations

- **Stack:** Next.js (App Router) + PostgreSQL + Prisma + Tailwind CSS. Drag-and-drop pakai `@dnd-kit` (punya dukungan keyboard dan screen reader bawaan, jadi papan bisa dipakai tanpa mouse).
- **Multi-tenant:** tiap baris data terikat `tokoId`. Setiap query disaring di server berdasarkan sesi, bukan dari parameter yang dikirim klien.
- **PostgreSQL belum terpasang di VM ini.** Versi 16 tersedia dari apt, dipasang native (tidak ada Docker di mesin ini).
- **Fase frontend pakai data contoh yang ditandai jelas sebagai contoh**, supaya bisa direview cepat. Backend menyusul dan menggantikan sumber data tanpa mengubah tampilan.
- **Nomor servis:** dibuat berurutan per toko. SQLite/Postgres tidak boleh mengandalkan hitung jumlah baris (bisa tabrakan dan nomor terpakai ulang setelah hapus). Pakai baris penghitung yang di-increment di dalam transaksi.
- **Tunnel:** Cloudflare quick tunnel (gratis, tanpa domain). Port aplikasi dipisah dari Tumpuk (3200), dan tunnel ini punya logfile serta state file sendiri supaya tidak rebutan dengan tunnel yang sudah ada.

### Risiko

- **Drag-and-drop di HP rapuh.** Mitigasi: jalur ketuk-untuk-pindah wajib ada, drag bukan satu-satunya cara.
- **URL quick tunnel berubah tiap restart.** Mitigasi: kirim ulang tautan otomatis, pakai logfile sendiri.
- **Scope terlalu lebar** (landing + app + auth + 3 peran + multi-tenant). Mitigasi: V1 dibatasi 5 alur di atas, sisanya masuk P1/P2 dengan aturan masuk kembali.

---

## 7. Implementation Plan

### Fase 1: Frontend (fokus sekarang)

Yang jadi: landing page, kerangka aplikasi, papan kanban dengan drag-and-drop, alur pindah tahap, layar detail kartu, papan kosong dan status memuat/gagal. Sumber data masih contoh, ditandai jelas.

Bisa direview lewat tunnel Cloudflare. Revisi dari pemilik produk dikerjakan di fase ini.

### Fase 2: Backend (selesai)

PostgreSQL + Prisma, skema multi-toko, daftar dan login, tiga peran, papan tersambung ke data nyata, riwayat perpindahan tersimpan. Laporan buktinya di `docs/GATE-fase2.md`.

### Fase 3: Kesiapan Jualan

Halaman harga dan langganan, notifikasi, laporan, pengerasan (rate limit, validasi, audit akses antar toko), dan domain tetap supaya alamatnya tidak berganti tiap VM menyala ulang. Cetak nota dan tautan status pelanggan sudah dikerjakan lebih awal, lihat `docs/GATE-fase2.md` bagian 8.

---

## 8. Open Questions

| Pertanyaan | Pemilik | Batas waktu | Biaya kalau salah |
|---|---|---|---|
| Nama produk "Servioel" atau "Servio"? | Pemilik produk | sebelum kode pertama | Ganti nama setelah rilis = ganti domain, aset, dan akun |
| Model harga langganan (per staf? per toko? flat?) | Pemilik produk | sebelum Fase 3 | Landing page harga harus ditulis ulang, dan harga awal sulit dinaikkan |
| Kolom "Sudah Diambil" perlu berapa lama disimpan sebelum diarsip? | Pemilik produk | sebelum Fase 2 | Papan penuh kartu lama, papan jadi lambat dipakai |
| Perlu bukti bayar atau DP saat terima barang? | Pemilik produk | sebelum Fase 2 | Kalau perlu, kartu butuh field pembayaran dan alur baru |
| Di landing page, tulis harga atau "hubungi kami" dulu? | Pemilik produk | sebelum Fase 1 selesai | Harga palsu atau harga kosong dua-duanya merusak kepercayaan |

Dua pertanyaan pertama sudah lewat batas waktunya tanpa jawaban. Supaya Fase 2
tidak berhenti, dipakai nilai bawaan: **arsip 30 hari** dan **belum ada field
pembayaran**. Keduanya ditulis di `docs/GATE-fase2.md` beserta cara mengubahnya.
Kalau pemilik produk memilih lain, perubahannya kecil.

---

## 9. Appendix

### Out of Scope (V1), dengan aturan masuk kembali

- **IMEI, estimasi biaya, tanggal janji, catatan teknisi, penanggung jawab.** Pemilik produk tidak memilih ini di V1. Nama perangkat sudah masuk (merek dan tipe, satu kolom teks), karena tanpa itu nota tidak menjawab "ini barang apa". Sisanya masuk kembali hanya kalau ada toko nyata yang bilang kartunya kurang. Tempatnya disiapkan di struktur data Fase 2 supaya tidak perlu migrasi besar.
- **Cetak nota, invoice, pembayaran.** Masuk kembali hanya setelah V1 dipakai harian di satu toko.
- **Notifikasi WhatsApp.** Masuk kembali setelah papan terbukti dipakai, karena butuh biaya dan akun pihak ketiga.
- **Halaman harga dan billing.** Masuk kembali setelah ada calon pembeli nyata.
- **Multi-cabang dalam satu toko.** Masuk kembali setelah ada toko dengan lebih dari satu lokasi.

### Cara Tiap Klaim Dibuktikan

| Klaim | Cara bukti | Hasil |
|---|---|---|
| Papan bisa dipakai di HP tanpa scroll horizontal | Ukur lebar dokumen vs lebar layar di viewport 390 px | **Lolos.** 390px di ketiga halaman: scrollWidth 375 = clientWidth 375, overflow false. Target ketuk di bawah 44px: nol |
| Seret nota antar tahap jalan | Pindahkan nota antar tahap dengan mouse, catat tiap aksi | **Lolos.** SV-2026-0007 Barang Masuk ke Nunggu Sparepart, dan ke Dikerjakan. Lewat tunnel publik juga jalan |
| Papan bisa dipakai tanpa mouse | Tab ke nota, pindah tahap lewat keyboard | **Lolos.** Tab berhenti di semua kontrol dengan outline terlihat; Space, panah kanan, Space memindahkan nota satu tahap |
| Ketuk nota di HP lalu pindah tahap | Buka detail, tekan tombol tahap | **Lolos.** Di iframe 390px: detail terbuka penuh lebar, fokus pindah ke tombol Tutup, tombol tahap memindahkan nota |
| Kontras teks lolos AA | Hitung rasio tiap pasangan warna | **Lolos.** Audit di DOM: 0 gagal di /, /papan, /masuk. Script resmi, 13 pasangan PASS. Nilai: kertas/meja 14.27, tinta/kertas 16.47, tinta-redup/kertas 5.17, sinyal/meja 5.62, garis/meja 3.45, batas-kertas/kertas 3.48 |
| Tautan publik hidup | Buka tautan tunnel dari luar, cek status HTTP | **Lolos.** /, /papan, /masuk semuanya 200 lewat trycloudflare, dan menyajikan build terbaru |
| Tidak ada pola tampilan terlarang | Audit DOM: gradien, blur, bayangan dekoratif, garis tepi kiri, emoji | **Lolos.** Semuanya nol di ketiga halaman |
| Data satu toko tidak bocor ke toko lain | Panggil fungsi domain langsung dari skrip dengan sesi toko lain | **Lolos.** `npm run check:isolasi`: 10 dari 10 pemeriksaan lolos. Toko B tidak bisa membaca, memindahkan, atau mengarsipkan nota toko A walau id-nya ditebak benar |
| Toko bisa mendaftar sendiri lalu langsung masuk | Isi formulir `/daftar` lewat peramban, catat URL setelahnya | **Lolos.** Pindah ke `/app` dengan nama toko yang didaftarkan. Jalan lewat tunnel publik juga |
| Nota tersimpan di database, bukan di memori | Buat nota, muat ulang, lalu baca `pesanan_servis` lewat `psql` | **Lolos.** Nota masih ada setelah muat ulang dan setelah server dinyalakan ulang |
| Tiga peran punya wewenang berbeda | Masuk sebagai teknisi, buka `/app/staf` langsung | **Lolos.** Dialihkan ke `/app?ditolak=peran`, menu Staf dan tombol arsip tidak muncul |
| Pencarian unit ketemu walau tulisan berbeda | Cari dengan nama, nomor HP tanpa pemisah, perangkat, dan nomor nota | **Lolos.** `npm run check:pencarian`: 21 dari 21 pemeriksaan lolos. Di peramban: "08222222222" dan "0822-2222-2222" sama-sama menemukan nota yang sama; "SITI" dan "siti" sama; kueri kosong tidak menyembunyikan apa pun |
| `/app` bisa dibuka langsung tanpa nyangkut di kerangka memuat | Buka `/app` langsung tiga kali berturut-turut, cek hidrasi | **Lolos.** Cacat lama ketemu dan diperbaiki (lihat `docs/GATE-fase2.md` bagian 7). Hidrasi jalan, kotak pencarian bisa dipakai, tidak ada kerangka memuat tertinggal |
| Database mati tidak jadi halaman berbahasa Inggris | Matikan PostgreSQL, buka `/app`, lalu nyalakan lagi dan tekan Coba lagi | **Lolos.** Muncul pesan Indonesia dengan tindakan, dan papan pulih setelah database hidup |

### Known Gaps

- Fase 1 (frontend) sudah dibangun dan diuji; lihat `docs/GATE.md`.
- Fase 2 (backend) sudah dibangun dan diuji; lihat `docs/GATE-fase2.md`.
- PostgreSQL 16.15 terpasang native di mesin ini (tanpa Docker). Basis data `servioel`, peran `servioel`, kata sandi di `.env` (tidak ikut masuk git).
- Basis data sudah berisi data toko nyata: `evey cell` dan `nin cell`, dua akun, dua nota. Data ini tidak boleh dihapus. Setiap migrasi wajib menambah kolom tanpa mengisi nilai karangan ke baris yang sudah ada.
- Nota yang dibuat sebelum kolom perangkat ada tidak punya isi perangkat. Kartu dan detailnya menulis "Belum dicatat", bukan diisi tebakan.
- Belum ada verifikasi email dan lupa kata sandi. Belum ada rate limit di halaman masuk.
- Harga dan model bisnis belum diputuskan.
