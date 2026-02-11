/**
 * Root layout for the Todo application.
 * Provides global styles, metadata, error boundary, and toast notifications.
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import { ChatFloatingButton } from "@/components/ChatFloatingButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Pro | Manifest Your Goals",
  description: "A premium, glassmorphism-styled multi-user workspace for manifestation and productivity.",
  themeColor: "#030014",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Todo Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatFloatingButton />
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
