import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Game Threads",
  description: "Compare Reddit Game Threads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
