import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";
import ScrollEffects3D from "@/components/ScrollEffects3D";
import { TestisChat } from "@/components/chat/TestisChat";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap", // Optimización para evitar FOIT
  preload: true,
  fallback: ['system-ui', 'arial'],
});
export const metadata: Metadata = {
  title: "Testis - Asistente SIU Guaraní USAL",
  description:
    "Tu compañero virtual para navegar el SIU Guaraní de la Universidad del Salvador. Inscripciones, horarios, notas, parciales y más, todo en un solo lugar.",
  openGraph: {
    title: "Testis - Asistente SIU Guaraní USAL",
    description:
      "Tu compañero virtual para navegar el SIU Guaraní de la Universidad del Salvador. Inscripciones, horarios, notas, parciales y más, todo en un solo lugar.",
    images: ["/usal-logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ScrollEffects3D />
          <Header />
          <TestisChat />
          <main className="pt-16">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
