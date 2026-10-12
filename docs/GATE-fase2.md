# Delivery Gate: Fase 2 (backend)

Tanggal: 2026-10-12
Mode antislop: `during` (aktif terus-menerus)
Tautan publik: `https://vienna-exists-dance-legislation.trycloudflare.com`

Aturan yang dipegang di laporan ini: tiap klaim di bawah punya perintah atau
hasil pengukuran yang bisa diulang. Yang belum diuji tidak ditulis di sini.

---

## 1. Yang dibangun

Papan contoh dari Fase 1 tidak diubah tampilannya. Yang berubah: sumber datanya.
Sekarang ada dua papan, satu komponen yang sama.

| Bagian | Berkas | Isi |
|---|---|---|
| Skema database | `prisma/schema.prisma` | 6 tabel: `toko`, `pengguna`, `sesi`, `pesanan_servis`, `gerakan_tahap`, `penghitung` |
| Koneksi | `src/lib/db.ts` | Prisma 7 + driver adapter `pg`, satu koneksi per proses |
| Kata sandi | `src/lib/password.ts` | scrypt dari Node sendiri, garam acak per akun, perbandingan waktu tetap |
| Sesi | `src/lib/auth.ts` | token 32 bita acak, yang disimpan hanya hash-nya, cookie HttpOnly |
| Pemeriksaan sesi | `src/lib/dal.ts` | `wajibMasuk()`, `wajibPeran()`, di-cache per permintaan |
| Peran | `src/lib/peran.ts` | `owner`, `teknisi`, `kasir`; label dan wewenang |
| Urusan papan | `src/lib/orders.ts` | daftar, buat, pindah tahap, arsip, riwayat |
| Urusan toko | `src/lib/toko.ts` | daftar toko, masuk, tambah staf, setel ulang sandi, aktif/nonaktif |
| Server Actions | `src/app/actions/*.ts` | `auth.ts`, `papan.ts`, `staf.ts` |
| Penjaga rute | `src/proxy.ts` | pengalihan kasar sebelum halaman dimuat; penegakan sebenarnya ada di `dal.ts` |
| Halaman | `src/app/{masuk,daftar,app,app/staf}/` | masuk, daftar toko, papan kerja, kelola staf |
| Keadaan gagal | `src/app/error.tsx` | batas kegagalan akar, berbahasa Indonesia, ada tombol coba lagi |
| Uji | `scripts/check-isolasi.ts` | uji pemisahan data antar toko, dijalankan ke fungsi server |

Yang **tidak** dibangun di fase ini, dan itu disengaja: verifikasi email, lupa
kata sandi, cetak nota, pembayaran, notifikasi, laporan, harga.

---

## 2. Keputusan yang diambil tanpa jawaban pemilik produk

Empat pertanyaan di PRD bertanda "sebelum Fase 2" tidak sempat dijawab. Supaya
pekerjaan tidak berhenti, dipilih nilai bawaan berikut. Semuanya murah diubah,
dan tempatnya sudah disiapkan di skema.

| Pertanyaan | Nilai yang dipakai | Kalau mau diubah |
|---|---|---|
| Berapa lama "Sudah Diambil" disimpan | 30 hari, dihitung dari saat masuk tahap itu | `AMBANG_ARSIP_HARI` di `src/lib/orders.ts` |
| Bukti bayar / DP | Belum ada | Tambah kolom di `ServiceOrder`, lalu migrasi |
| Verifikasi email saat daftar | Belum ada, akun langsung aktif | Tambah `emailTerverifikasi` di `User` |
| Papan contoh tetap terbuka | Ya, `/papan` pakai data contoh; papan asli di `/app` di balik masuk | Hapus `/papan` kalau tidak mau |

---

## 3. Cara tiap klaim dibuktikan

| Klaim | Cara bukti | Hasil |
|---|---|---|
| Toko bisa mendaftar sendiri lalu langsung masuk | Isi formulir `/daftar` lewat peramban, catat URL setelahnya | **Lolos.** Pindah ke `/app`, kepala halaman menyebut nama toko yang didaftarkan |
| Sesi bertahan setelah server dinyalakan ulang | Masuk, `systemctl --user restart servioel.service`, buka `/app` lagi | **Lolos.** Tetap di `/app` tanpa masuk ulang. Sesi disimpan di tabel `sesi`, bukan di memori proses |
| Nota tersimpan, bukan di memori | Buat nota, muat ulang halaman, cek lewat `psql` | **Lolos.** `SV-2026-0001` ada di `pesanan_servis` setelah muat ulang |
| Nomor servis tidak terpakai ulang | Buat beberapa nota, cek urutannya | **Lolos.** `SV-2026-0001` sampai `0004` berurutan, naik dari baris `penghitung` di dalam transaksi |
| Tiap perpindahan tercatat lengkap | Pindah tahap, baca `gerakan_tahap` | **Lolos.** Tercatat "Masuk ke Barang Masuk" lalu "Barang Masuk ke Diagnosa", beserta pelakunya |
| Tiga peran punya wewenang berbeda | Masuk sebagai teknisi, buka `/app/staf` langsung | **Lolos.** Dialihkan ke `/app?ditolak=peran`. Menu Staf tidak muncul untuk teknisi. Tombol arsip tidak muncul |
| **Data satu toko tidak bocor ke toko lain** | Jalankan `npm run check:isolasi`: dua toko, toko B menebak id nota toko A | **Lolos, 10 dari 10.** Lihat bagian 4 |
| Arsip hanya menyentuh toko sendiri | Toko B menjalankan arsip saat toko A punya nota tua | **Lolos.** `diarsipPada` nota toko A tetap kosong |
| Nomor servis tidak bertabrakan antar toko | Dua toko, masing-masing mulai dari 1 | **Lolos.** Keduanya `SV-2026-0001`, dipisah kunci penghitung per toko |
| Database mati tidak jadi halaman Inggris | Matikan PostgreSQL, buka `/app` | **Lolos.** Muncul "Halaman ini tidak bisa dibuka" berbahasa Indonesia, ada tombol Coba lagi |
| Pemulihan setelah database hidup lagi | Nyalakan PostgreSQL, tekan "Coba lagi" | **Lolos.** Papan langsung termuat |
| Halaman tanpa izin tidak menampilkan data | Buka `/app` tanpa cookie | **Lolos.** `307` ke `/masuk` |
| Kontras lolos ambang | Ukur tiap pasangan warna di DOM, dan script resmi | **Lolos.** 15 pasangan dihitung ulang, 0 gagal. Nilai terendah yang dipakai sebagai batas elemen: `garis-meja/panel` 3.05 (ambang 3.0) |
| Tidak ada pola tampilan terlarang | Audit DOM: gradien, kaca, bayangan, garis tepi kiri, emoji, sudut besar | **Lolos.** Semuanya nol di `/`, `/papan`, `/masuk`, `/daftar` |
| HP 390px tanpa scroll horizontal, target ketuk cukup | Ukur `scrollWidth` dan ukuran tiap kontrol di iframe 390px | **Lolos.** `overflow false`, target di bawah 44px: nol, di keempat halaman |
| Konsol bersih | Baca `window.__errs` setelah tiap halaman | **Lolos.** Nol di semua halaman |
| Alur lengkap jalan lewat internet, bukan cuma localhost | Daftar toko, buat nota, pindah tahap, muat ulang, semuanya lewat URL publik | **Lolos.** Toko "Servis Melati" didaftarkan lewat tunnel, nota dibuat dan dipindah ke Diagnosa, masih di Diagnosa setelah muat ulang |

---

## 4. Hasil uji pemisahan data

Perintah: `npm run check:isolasi`

Uji ini tidak lewat tampilan. Tampilan bisa saja menyembunyikan tombol, jadi yang
diuji adalah jawaban servernya kalau id milik toko lain ditebak dengan benar.

```
LULUS  nota toko A dibuat
LULUS  toko B tidak melihat nota toko A
LULUS  toko A melihat notanya sendiri
LULUS  toko B tidak bisa memindahkan nota toko A  (Nota tidak ditemukan di toko ini.)
LULUS  tahap nota toko A tidak berubah
LULUS  tidak ada riwayat palsu tercatat
LULUS  arsip toko B tidak menyentuh nota toko A
LULUS  daftar staf toko B tidak memuat orang toko A
LULUS  nomor servis toko B mulai dari 0001 sendiri
LULUS  data uji dibersihkan

SEMUA LULUS
```

---

## 5. Yang belum diuji, dan itu jujur

- **Beban.** Belum diuji dengan banyak toko sekaligus atau papan berisi ratusan
  nota. Angka "papan 200 kartu tetap responsif" di PRD masih belum dibuktikan.
- **Peramban asli di HP.** Uji HP dilakukan lewat iframe selebar 390px di
  peramban desktop, bukan di Android/iOS sungguhan.
- **Pulih setelah crash.** Belum diuji mematikan proses di tengah penulisan.
- **Rate limit.** Belum ada. Halaman masuk bisa dicoba berulang tanpa batas.
- **Email.** Belum ada layanan email, jadi lupa kata sandi belum bisa. Pemilik
  toko menyetel ulang sandi stafnya dari halaman Staf.
- **Peringatan `npm audit`.** 4 peringatan tingkat tinggi, semuanya dari pohon
  dependensi Prisma CLI sendiri: `mysql2` (pengendali MySQL) dan `deepmerge-ts`
  (penggabung konfigurasi). Aplikasi ini memakai PostgreSQL lewat
  `@prisma/adapter-pg`, dan keduanya tidak ikut jalan saat melayani permintaan.
  `npm audit fix --force` akan menurunkan Prisma ke 6.x, itu perubahan besar,
  jadi tidak dilakukan. Dicatat di sini supaya tidak jadi kejutan.
