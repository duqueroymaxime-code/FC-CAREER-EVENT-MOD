import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "FIFA Career Overhaul Mod",
  description: "Mode carrière roleplay avancé pour FC26.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}