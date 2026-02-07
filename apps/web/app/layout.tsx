import type { Metadata } from "next";
import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import { Agentation } from "agentation";
import { PostHogProvider } from "@/components/PostHogProvider";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Namazing — AI Baby Name Consultation",
    template: "%s | Namazing",
  },
  description:
    "Get personalized baby name recommendations powered by AI. Namazing researches origins, meanings, and compatibility to help you find the perfect name.",
  metadataBase: new URL("https://namazing.co"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Namazing",
    title: "Namazing — AI Baby Name Consultation",
    description:
      "Get personalized baby name recommendations powered by AI. Research origins, meanings, and compatibility — all in one beautiful report.",
    url: "https://namazing.co",
  },
  twitter: {
    card: "summary_large_image",
    title: "Namazing — AI Baby Name Consultation",
    description:
      "Get personalized baby name recommendations powered by AI. Research origins, meanings, and compatibility — all in one beautiful report.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-studio-sand text-studio-ink flex flex-col">
        <PostHogProvider>
          {children}
        </PostHogProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
