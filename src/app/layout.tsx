import type React from "react";
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CVJitu",
    default: "CVJitu - AI Powered CV Builder & Scoring",
  },
  description:
    "Platform bertenaga AI untuk membuat CV profesional dengan scoring otomatis dan saran optimasi. Tingkatkan peluang karir Anda dengan CV yang ramah ATS.",
  themeColor: "#A21944",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}  `}>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
