import Image from "next/image";
import "./globals.css";
import { Inter } from "next/font/google";
import Background from "@/assets/img/bg.png";
import { Toaster } from "react-hot-toast";

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
      <body className={inter.variable}>
        <div className="relative min-h-screen w-full overflow-hidden text-center">
          <Image
            fill
            src={Background}
            alt="Background"
            className="absolute -z-10 object-fill object-center"
            priority
            quality={100}
          />
          <div className="h-screen w-full overflow-auto">{children}</div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
