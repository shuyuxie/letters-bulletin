import type { Metadata } from "next";
import { Satisfy } from "next/font/google";
import "./globals.css";

const satisfy = Satisfy({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bulletin",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satisfy}`}>{children}</body>
    </html>
  );
}
