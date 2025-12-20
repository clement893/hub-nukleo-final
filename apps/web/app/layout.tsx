import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "@/lib/toast";
import { SessionProvider } from "./components/SessionProvider";
import { SessionManager } from "./components/SessionManager";
import { AppLayout } from "./components/AppLayout";

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
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>
              <SessionManager />
              <AppLayout>{children}</AppLayout>
            </ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
