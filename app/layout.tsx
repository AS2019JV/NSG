import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "BS Intelligence | Deep Processing v14.6",
  description: "Cognitive Infrastructure for Enterprise",
};

import ThemeProvider from "@/components/providers/ThemeProvider";
import TokenVerifier from "@/components/auth/TokenVerifier";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased h-full" suppressHydrationWarning>
      <body className="h-full overflow-auto font-sans selection:bg-blue-100 selection:text-blue-900" suppressHydrationWarning>
        <ThemeProvider>
          <Suspense fallback={<div className="h-screen w-screen bg-slate-50 animate-pulse" />}>
            <TokenVerifier>
              <ToastProvider>{children}</ToastProvider>
            </TokenVerifier>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
