import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "MindForge - Seu Segundo Cérebro",
  description: "Seu segundo cérebro com IA para desenvolvedores e estudantes",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
        >
          <StoreProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "toast",
                style: {
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--card-foreground)",
                },
              }}
            />
            <Analytics />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
