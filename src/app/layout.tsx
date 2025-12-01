// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { WalletProviders } from "./WalletProviders";
import ClientLayout from "./ClientLayout";

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
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <ClientLayout>
          <WalletProviders>{children}</WalletProviders>
        </ClientLayout>
      </body>
    </html>
  );
}