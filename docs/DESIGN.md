# DESIGN: Servioel

Arah desain. Ini yang bikin hasilnya punya karakter sendiri, bukan tampilan AI yang bisa ditukar logonya.

Status: **usulan, minta persetujuan pemilik produk**. Belum final.

---

## Design Read

Membaca ini sebagai: papan kerja operasional untuk teknisi servis HP/elektronik, dipakai di HP dan laptop, dengan bahasa visual "meja kerja servis dan nota servis", dial **ENERGY 2 / RHYTHM 2 / MOTION 1**.

Alasan dialnya:
- **ENERGY 2** (bukan 1, bukan 3): ini alat kerja, bukan panggung. Harus tenang saat dipakai seharian, tapi tidak boleh jadi mati. Landing page boleh naik sedikit, papan tetap kalem.
- **RHYTHM 2**: papan itu sendiri berirama (kolom dan kartu), jadi bagian lain tidak perlu ikut ramai.
- **MOTION 1**: gerakan hanya di tempat yang menjelaskan sesuatu (kartu yang baru pindah, kartu yang sedang diangkat). Tidak ada animasi yang jalan sendiri terus-menerus.

---

## Dunia Visual

Dunia yang dipilih: **nota servis dan meja kerja**, bukan "dashboard SaaS gelap".

Alasannya: nota servis kertas itu benda nyata di toko servis. Pelanggan pegang salinannya, unitnya ditempeli nomornya. Kalau identitasnya diambil dari benda itu, halaman ini kelihatan seperti punya sejarah, bukan seperti templat.

Yang sengaja **ditolak**: gradasi biru-ungu, latar gelap "karena kelihatan teknologi", kartu-kartu kaca, glow, ikon kilau/berlian/robot, tombol pil semua, dan tata letak pendaratan klon Linear/Vercel.

---

## Identitas

**Motif identitas: nomor servis sebagai stempel.** Tiap kartu servis punya nomor besar yang jadi penanda utamanya. Nomor itu muncul konsisten di papan, di detail, dan di riwayat. Kalau logo ditukar, nomor stempel ini tetap bikin halaman ini kelihatan punya pemilik.

**Aksen tunggal: satu warna sinyal.** Dipakai hanya untuk dua hal: tindakan utama, dan penanda "kartu ini sudah lama di satu tahap". Tidak dipakai di setiap ikon, garis, dan latar.

---

## Palet

Inti 2 warna plus 1 aksen, ditambah netral. Warna status (untuk tahap) dihitung terpisah karena status itu fungsi, bukan hiasan.

| Peran | Warna | Alasan satu baris |
|---|---|---|
| Kertas (latar) | `#F5F2EA` | Putih kertas nota, bukan putih layar, biar hangat dan tidak menyilaukan |
| Tinta (teks) | `#1A1712` | Hitam kecoklatan seperti tinta cetak, bukan hitam pekat |
| Netral redup | `#6E675C` | Untuk teks sekunder, tetap lolos kontras di atas kertas |
| Struktur | `#22332E` | Hijau tua meja kerja, untuk header dan navigasi |
| Aksen | `#B4430F` | Oranye sinyal, satu-satunya warna yang "berteriak", dipakai hemat |

Semua pasangan warna di atas dihitung rasio kontrasnya sebelum dipakai (target: teks 4.5:1, batas komponen 3:1). Angka pastinya ditulis di komponen saat Fase 1.

---

## Tipografi

- **UI dan isi:** Plus Jakarta Sans. Alasan: dirancang di Jakarta untuk kebutuhan huruf Latin bahasa Indonesia, jadi cocok dengan produk ini, dan bukan pilihan bawaan model (Inter/Geist/Space Grotesk).
- **Nomor servis dan angka teknis:** satu rupa huruf angka yang lebih tegas dan sempit, supaya nomor besar tetap terbaca di kartu kecil. Pilihannya diputuskan di Fase 1 dan ditulis alasannya di sini.
- Tidak pakai monospace raksasa sebagai gaya, dan tidak pakai label HURUF BESAR dengan jarak lebar sebagai hiasan.

---

## Prinsip Tata Letak

- **Papan adalah halamannya.** Di papan, tidak ada baris kartu statistik di atas, tidak ada grafik yang tidak menjawab pertanyaan. Yang dilihat pertama adalah kartu dan tahapnya.
- **Satu titik fokus per layar.** Di papan, fokusnya kartu yang sedang diangkat atau kartu yang paling lama nyangkut.
- **Kartu berbicara lewat isi, bukan lewat warna.** Nomor servis besar, nama pelanggan, keluhan singkat. Warna hanya menandai keadaan.
- **Ruang kosong memisahkan tahap**, bukan sisa tempat.
- **Papan di HP bukan versi kecil dari papan di laptop.** Di HP, satu tahap tampil penuh, tahap lain jadi pemilih yang bisa digeser.

---

## Gerakan (Motion 1)

Yang bergerak hanya:
- Kartu yang diangkat saat di-drag (terangkat dikit, bayangannya naik).
- Kartu yang baru berpindah tahap (satu kilasan singkat supaya mata bisa mengikuti).
- Umpan balik saat tombol ditekan.

Yang tidak: tidak ada elemen yang berdenyut terus, tidak ada animasi masuk untuk setiap bagian halaman.

---

## Yang Masih Perlu Diputuskan Pemilik Produk

1. Setuju dengan dunia "nota servis dan meja kerja", atau mau arah lain?
2. Setuju dengan palet kertas, hijau tua, dan oranye sinyal? Kalau mau warna toko tertentu, sebutkan.
3. Nama produk: "Servioel" atau "Servio"?

Arah ini **belum final** sampai ketiganya dijawab. Kalau dibangun sebelum dijawab, hasilnya ditandai "draft tanpa arah" dan bukan hasil yang layak rilis.
