import type { Metadata } from "next";
import { Archivo, Barlow } from "next/font/google";
import "./globals.css";

/*
  Archivo untuk kepala dan nomor: grotesque dari dunia papan nama dan sablon,
  tegas untuk angka besar, dan punya angka rata kolom.
  Barlow untuk teks: netral, sedikit teknik, enak dibaca di layar HP.
  Bukan pasangan bawaan, dan keduanya punya huruf Latin yang lengkap.
*/
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Servioel, papan servis HP dan elektronik",
  description:
    "Papan kerja untuk toko servis HP dan elektronik. Tiap unit jadi satu nota bernomor yang bergerak dari Barang Masuk sampai Sudah Diambil.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${archivo.variable} ${barlow.variable}`}>
      <body className="flex min-h-full flex-col bg-bench font-sans text-bench-text">
        {children}
      </body>
    </html>
  );
}
