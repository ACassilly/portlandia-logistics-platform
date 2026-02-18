import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portlandia Logistics - Freight Brokerage & LTL Shipping",
  description:
    "Full-service freight brokerage and LTL shipping solutions with transparent pricing and real-time tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
