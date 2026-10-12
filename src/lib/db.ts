import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Satu koneksi Prisma untuk seluruh proses. Di mode pengembangan, Next memuat
// ulang modul tiap kali berkas berubah, jadi tanpa penampung global ini tiap
// muat ulang akan membuka kolam koneksi baru sampai PostgreSQL kehabisan slot.
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL belum diisi. Salin dari ~/.servioel/db.env ke .env.");
}

const penampung = globalThis as unknown as { prismaServioel?: PrismaClient };

export const db =
  penampung.prismaServioel ??
  new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

if (process.env.NODE_ENV !== "production") {
  penampung.prismaServioel = db;
}
