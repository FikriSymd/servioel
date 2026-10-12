import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Dipilih karena dirancang untuk kebutuhan huruf Latin bahasa Indonesia,
// bukan karena jadi bawaan model. Alasan lengkap di docs/DESIGN.md.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Servioel, papan servis untuk toko HP dan elektronik",
  description:
    "Papan kanban alur servis: dari barang masuk sampai sudah diambil. Dipakai di HP dan laptop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
