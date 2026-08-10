import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";

export const metadata: Metadata = {
  title: "RA Script — AI Regulatory Affairs Assistant & CMC Specialist",
  description: "Enterprise-grade AI Regulatory Affairs Assistant for pharmaceutical CMC & eCTD Dossiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
