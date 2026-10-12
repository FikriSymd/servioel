import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 memindahkan URL database ke sini. Blok `datasource` di schema.prisma
// sekarang hanya menyebut provider.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --conditions=react-server prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
