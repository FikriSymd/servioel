-- CreateTable
CREATE TABLE "toko" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "toko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kataSandi" TEXT NOT NULL,
    "peran" TEXT NOT NULL DEFAULT 'teknisi',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesi" (
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesi_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateTable
CREATE TABLE "pesanan_servis" (
    "id" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "pelanggan" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "keluhan" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'barang-masuk',
    "masukTahapPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diarsipPada" TIMESTAMP(3),

    CONSTRAINT "pesanan_servis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gerakan_tahap" (
    "id" TEXT NOT NULL,
    "pesananId" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "dari" TEXT,
    "ke" TEXT NOT NULL,
    "olehId" TEXT NOT NULL,
    "pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gerakan_tahap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penghitung" (
    "kunci" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "penghitung_pkey" PRIMARY KEY ("kunci")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE INDEX "pengguna_tokoId_idx" ON "pengguna"("tokoId");

-- CreateIndex
CREATE INDEX "sesi_userId_idx" ON "sesi"("userId");

-- CreateIndex
CREATE INDEX "pesanan_servis_tokoId_stage_idx" ON "pesanan_servis"("tokoId", "stage");

-- CreateIndex
CREATE INDEX "pesanan_servis_tokoId_diarsipPada_idx" ON "pesanan_servis"("tokoId", "diarsipPada");

-- CreateIndex
CREATE UNIQUE INDEX "pesanan_servis_tokoId_nomor_key" ON "pesanan_servis"("tokoId", "nomor");

-- CreateIndex
CREATE INDEX "gerakan_tahap_pesananId_idx" ON "gerakan_tahap"("pesananId");

-- CreateIndex
CREATE INDEX "gerakan_tahap_tokoId_idx" ON "gerakan_tahap"("tokoId");

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "toko"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesi" ADD CONSTRAINT "sesi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan_servis" ADD CONSTRAINT "pesanan_servis_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "toko"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gerakan_tahap" ADD CONSTRAINT "gerakan_tahap_pesananId_fkey" FOREIGN KEY ("pesananId") REFERENCES "pesanan_servis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gerakan_tahap" ADD CONSTRAINT "gerakan_tahap_olehId_fkey" FOREIGN KEY ("olehId") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
