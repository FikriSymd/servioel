# DESIGN: Servioel

Arah desain. Ini yang bikin hasilnya punya karakter sendiri, bukan tampilan yang bisa ditukar logonya.

Status: **dipakai di Fase 1**. Revisi terakhir 2026-10-12, setelah arah pertama ditolak pemilik produk karena masih terasa seperti templat.

---

## Kenapa arah pertama dibuang

Arah pertama memakai kertas krem, hijau tua, dan oranye terakota. Itu bukan pilihan yang buruk, tapi terlalu mudah: pasangan krem-terakota itu sudah jadi klise, dan hasilnya jatuh ke pola pendaratan yang bisa ditukar logo: teks pengantar kecil di atas judul, tiga kartu fitur bernomor, blok ajakan berbingkai, dan setiap bagian bersusun sama.

Yang juga ikut dibuang: Plus Jakarta Sans (sudah jadi pilihan bawaan), garis warna di tepi kiri daftar, dan nomor bagian 01/02/03 yang tidak membawa informasi.

---

## Dunia Visual

Dua bahan, satu motif.

**Bahan pertama: meja kerja.** Permukaan gelap hijau-arang tempat papan dipasang. Dipilih gelap bukan supaya terlihat teknologi, tapi karena papan ini dilihat di meja kerja sepanjang hari, dan karena nota kertas di atasnya jadi terang sendiri tanpa perlu hiasan.

**Bahan kedua: kertas nota.** Kertas tetap terang, dan bukan putih murni, supaya tidak menyilaukan di bawah lampu ruang.

**Motif: nomor servis.** Tiap unit punya satu nomor, dan nomor itu dicetak di kepala tiap nota seperti stempel. Motif yang sama diulang di kepala halaman, panel detail, dan formulir nota baru. Kalau logonya ditukar, nomor stempel ini tetap bikin halaman ini kelihatan punya pemilik.

Yang ditolak: gradien, kaca/blur, bayangan dekoratif, emoji, sudut membulat besar, dan kartu-kartu yang mengapung di atas latar abu.

---

## Palet

Semua pasangan dihitung rasio kontrasnya sebelum dipakai. Angka di bawah hasil hitungan, bukan perkiraan.

| Peran | Warna | Kontras terukur | Alasan satu baris |
|---|---|---|---|
| Meja | `#1A241F` | kertas di atasnya 14.27 | Permukaan kerja, gelap tapi hijau, bukan hitam |
| Panel meja | `#222E28` | teks redup di atasnya 6.51 | Sedikit lebih terang dari meja, untuk blok yang perlu dibedakan |
| Garis meja | `#647A6D` | 3.45 di meja, 3.05 di panel | Garis struktur harus lolos 3:1 supaya terbaca, bukan cuma kelihatan |
| Teks meja | `#EDE8DC` | 13.05 di meja | Teks utama di permukaan gelap |
| Teks meja redup | `#A8B3AA` | 7.37 di meja, 6.51 di panel | Teks sekunder, tetap jauh di atas ambang |
| Kertas | `#F6F2E8` | 14.27 di meja | Kertas nota, bukan putih layar |
| Tinta | `#16140E` | 16.47 di atas kertas | Hitam kecoklatan seperti tinta cetak |
| Tinta redup | `#6C6557` | 5.17 di atas kertas | Teks sekunder di atas kertas |
| Batas kertas | `#8A8070` | 3.48 di atas kertas | Batas kontrol di atas kertas, lolos 3:1 |
| Sinyal | `#FF6B2C` | 5.62 di meja | Satu-satunya warna yang berteriak, dipakai hemat |
| Sinyal tinta | `#C2410C` | 4.63 di atas kertas | Versi sinyal untuk di atas kertas, karena oranye terang gagal di sana |
| Menginap | `#F0C24B` | 9.52 di meja, 10.98 dengan tinta | Kepala nota yang menginap |

Aturan pemakaian sinyal: hanya untuk tindakan utama, keadaan terpilih, dan penanda nota menginap. Tidak dipakai di setiap ikon, garis, dan latar.

---

## Tipografi

- **Kepala dan angka: Archivo.** Grotesque dari dunia papan nama dan sablon. Tegas untuk angka besar, dan punya angka rata kolom.
- **Isi: Barlow.** Netral, sedikit teknik, enak dibaca di layar HP.
- Keduanya punya huruf Latin lengkap, dan keduanya bukan pasangan bawaan model.
- Tidak pakai monospace raksasa sebagai gaya, dan tidak pakai label HURUF BESAR berjarak lebar sebagai hiasan.

---

## Prinsip Tata Letak

- **Papan adalah halamannya.** Di papan tidak ada baris kartu statistik, tidak ada grafik yang tidak menjawab pertanyaan. Yang dilihat pertama adalah nota dan tahapnya.
- **Lajur tahap bukan kotak.** Lajur dipisahkan garis tegak, seperti rak di dinding. Enam kotak berbingkai di atas krem itu yang bikin arah pertama terasa seperti templat.
- **Nota kertas di atas meja gelap.** Kontras bahan yang jadi pembeda, bukan warna hiasan.
- **Kepala nota menandai keadaan.** Nota biasa berkepala tinta, nota yang menginap berkepala kuning. Warnanya satu-satunya bedanya, jadi kelihatan sambil menyapu pandangan.
- **Papan di HP bukan versi kecil dari papan di laptop.** Di HP, satu tahap tampil penuh, tahap lain jadi pemilih yang bisa digeser.
- **Ruang kosong memisahkan**, bukan sisa tempat.

---

## Gerakan (Motion 1)

Yang bergerak hanya nota yang diangkat saat diseret, dan umpan balik tombol yang ditekan. Tidak ada elemen yang berdenyut terus, tidak ada animasi masuk untuk setiap bagian halaman.

---

## Halaman yang Ditambahkan di Fase 2

Tidak ada arah visual baru. Halaman baru memakai bahan yang sama, supaya tidak
terasa seperti tempelan.

- **Daftar dan masuk.** Satu nota kertas di tengah meja gelap. Isian memakai
  batas kertas (`paper-edge`, 3.48 di atas kertas), bukan kotak putih berbayang.
  Satu tindakan utama per halaman.
- **Kepala area kerja.** Menyebut nama toko dan nama pengguna beserta perannya.
  Ini yang membedakan area kerja dari papan contoh, dan yang memberi tahu kasir
  atau teknisi siapa yang sedang memakai.
- **Kelola staf.** Tabel sederhana bergaris, bukan kartu-kartu. Aksi per baris
  (aktif/nonaktif, setel ulang sandi) supaya satu baris terbaca sebagai satu
  akun.
- **Halaman gagal.** Dipakai saat server tidak menjawab. Menyebut penyebab yang
  paling mungkin dan memberi satu tindakan, bukan "Terjadi kesalahan".
- **Nota siap cetak (`/nota/<id>`).** Notanya jadi satu lembar kertas di tengah
  layar, tanpa kepala area kerja, tanpa papan, tanpa tombol selain Cetak dan
  kembali. Yang dicetak memang cuma notanya. Aturan `@media print` menyembunyikan
  tombol dan melepas latar gelap, jadi tintanya tidak habis buat meja kerja.
- **Status untuk pelanggan (`/n/<token>`).** Satu kolom sempit, huruf lebih
  besar, bahasa sehari-hari. Bukan salinan papan yang diperkecil. Yang tampil:
  nomor servis, perangkat, nama pelanggan, tahap sekarang, dan urutan tahap mana
  yang sudah lewat. Nomor HP dan keluhan tidak ikut, karena itu urusan toko.
  Halaman ini dirender di server tanpa satu pun komponen klien, jadi isinya sudah
  ada di HTML pertama dan tetap terbaca walau JavaScript belum jalan.

---

## Yang Masih Terbuka

1. Lambang toko. Sampai ada, nama ditulis sebagai teks. Lambang karangan tidak dibuat.
2. Alamat kontak. Dibiarkan kosong atas permintaan pemilik produk.
3. Warna toko tertentu, kalau pemilik produk mau menyesuaikan dengan warna tokonya.
