// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { WalletProviders } from "./WalletProviders";

export const metadata: Metadata = {
  title: "Grow A Tree For Christmas",
  description: "Hold $TREES → Watch your tree grow on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ←←← ALL YOUR ORIGINAL CSS GOES HERE ←←← */}
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        {/* Add any other CSS files you had here */}
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <WalletProviders>
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}