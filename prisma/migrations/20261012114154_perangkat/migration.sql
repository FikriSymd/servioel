/*
  Menambah kolom `perangkat` (nama dan tipe unit) ke nota servis.

  Nota yang sudah ada sebelum kolom ini dibuat tidak punya data perangkat, dan
  tidak ada cara menebaknya. Jadi kolomnya ditambah dengan nilai kosong, bukan
  diisi karangan. Di tampilan, nota yang perangkatnya kosong kembali memakai
  susunan lama (nama pelanggan jadi baris tebal), jadi tidak ada baris kosong
  yang terlihat seperti kerusakan.

  Default-nya dilepas setelah pengisian supaya bentuk akhirnya sama dengan yang
  diminta skema: wajib diisi, tanpa nilai bawaan.
*/

-- AlterTable
ALTER TABLE "pesanan_servis" ADD COLUMN "perangkat" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "pesanan_servis" ALTER COLUMN "perangkat" DROP DEFAULT;
