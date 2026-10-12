/*
  Menambah dua hal pada nota servis:
  1. tokenPublik, tautan nota yang boleh dibuka pelanggan tanpa masuk.
  2. diubahPada dan diubahOlehId, jejak kalau isi nota pernah dibetulkan.

  Ditulis tangan, bukan hasil `prisma migrate dev`, karena kolom tokenPublik
  wajib diisi sementara tabelnya sudah berisi nota nyata. Prisma akan menolak
  menambah kolom wajib tanpa nilai bawaan pada tabel yang ada isinya, dan
  menolaknya itu benar: menebak nilai untuk baris lama sama saja mengarang data.

  Jadi urutannya: tambah kolom sebagai boleh-kosong, isi tiap baris lama dengan
  token acak dari PostgreSQL sendiri, baru dikunci jadi wajib. Nota lama ikut
  dapat tautannya sendiri, dan tidak ada satu pun baris yang isinya dikarang.

  gen_random_uuid() sudah ada di PostgreSQL 13 ke atas tanpa perlu ekstensi,
  dan dipakai di sini karena sumber acaknya lebih kuat daripada random().
*/

-- 1. Tautan nota.
ALTER TABLE "pesanan_servis" ADD COLUMN "tokenPublik" TEXT;

UPDATE "pesanan_servis"
SET "tokenPublik" = replace(gen_random_uuid()::text, '-', '')
WHERE "tokenPublik" IS NULL;

ALTER TABLE "pesanan_servis" ALTER COLUMN "tokenPublik" SET NOT NULL;

CREATE UNIQUE INDEX "pesanan_servis_tokenPublik_key" ON "pesanan_servis"("tokenPublik");

-- 2. Jejak perubahan isi nota.
ALTER TABLE "pesanan_servis" ADD COLUMN "diubahPada" TIMESTAMP(3);
ALTER TABLE "pesanan_servis" ADD COLUMN "diubahOlehId" TEXT;

ALTER TABLE "pesanan_servis"
  ADD CONSTRAINT "pesanan_servis_diubahOlehId_fkey"
  FOREIGN KEY ("diubahOlehId") REFERENCES "pengguna"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
