import type { Metadata } from "next";
import "./globals.css";
import { DM_Serif_Display, Inter } from "next/font/google";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Namazing",
  description: "AI baby-naming studio with curated shortlists and live activity timeline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-studio-sand text-studio-ink">
        {children}
      </body>
    </html>
  );
}
