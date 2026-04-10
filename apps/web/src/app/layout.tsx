import type { Metadata } from "next";
import "./globals.css";
import { Inter, Rajdhani } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/layout/providers";
import { CursorGlow } from "@/components/effects/cursor-glow";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uniqcall Education",
  description: "Sistem Navigasi Masa Depan Siswa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn("font-sans antialiased", inter.variable, rajdhani.variable)}
    >
      <body className="min-h-screen bg-[#0A0E27] text-slate-100">
        <Providers>
          {children}
          <CursorGlow />
        </Providers>
      </body>
    </html>
  );
}
