import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facebook Radar publico",
  description:
    "Analiza publicaciones de Facebook con IA, detecta tono, intencion y publico en segundos.",
  openGraph: {
    title: "Facebook Radar publico",
    description:
      "Analiza posts, comentarios y anuncios con IA para conocer tono, intencion y audiencia.",
    url: "https://facebook-radar.vercel.app",
    siteName: "Facebook Radar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facebook Radar publico",
    description:
      "Landing + analizador IA para publicaciones de Facebook listo para Vercel.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-green-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
