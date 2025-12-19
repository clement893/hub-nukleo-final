import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hub Nukleo",
  description: "Application moderne avec Next.js 16 et Turbopack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}

