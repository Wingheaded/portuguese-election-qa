// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global styles (includes Tailwind)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Q&A Programas Eleitorais - Portugal 2025",
  description: "Faça perguntas sobre os programas eleitorais dos partidos políticos portugueses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body 
        className={`${inter.className} bg-slate-100 text-slate-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}