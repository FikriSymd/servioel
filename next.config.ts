import type { NextConfig } from "next";
import path from "node:path";

// `cacheComponents` sengaja tidak dipakai: papan membaca data di klien dan
// halaman detail bergantung pada state, jadi mode cache bawaan scaffold
// justru mengganggu. (Lihat skill nextjs16-prisma7-sqlite.)
//
// Ada package.json lain di direktori home (/home/agentuser), jadi akar
// proyek dipatok ke folder ini. Tanpa ini Next menebak home sebagai akar
// repo dan peringatan tracing muncul. File di home tidak disentuh.
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  turbopack: {
    root: path.join(process.cwd()),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
