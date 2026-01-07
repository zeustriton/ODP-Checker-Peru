import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ODP Checker Perú - Verificador de Oficial de Datos Personales",
  description: "Plataforma web interactiva para la difusión y comprensión de la Directiva sobre el Oficial de Datos Personales (ODP) conforme al Reglamento de la Ley de Protección de Datos Personales.",
  keywords: ["ODP", "Protección de Datos", "Datos Personales", "Perú", "ANPD", "Ley 29733", "RLPDP", "Next.js", "TypeScript"],
  authors: [{ name: "Roberto Puyó Valladares - Kepler Blacklock" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ODP Checker Perú - Verificador de Oficial de Datos Personales",
    description: "Herramienta interactiva para determinar si tu entidad requiere designar un Oficial de Datos Personales según la normativa peruana",
    url: "https://odp-checker-peru.vercel.app",
    siteName: "ODP Checker Perú",
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "ODP Checker Perú - Verificador ODP",
    description: "Herramienta interactiva para determinar si tu entidad requiere designar un Oficial de Datos Personales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
