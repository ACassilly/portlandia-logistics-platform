import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portlandia Logistics",
  description: "Full-stack freight brokerage platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
