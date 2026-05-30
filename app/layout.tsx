import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artist Portfolio",
  description: "Artist portfolio powered by Next.js and Sanity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
