import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "UPT Puskesmas Gabus 2 | Kab. Pati",
  description: "Ning Dila - Skrining Dini Usia Lanjut",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
