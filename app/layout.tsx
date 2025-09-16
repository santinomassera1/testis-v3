import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
