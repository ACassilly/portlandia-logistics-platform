import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portlandia Logistics | Freight Shipping Solutions",
  description:
    "Full-service freight brokerage — LTL, FTL, flatbed, and specialized shipping with transparent pricing and real-time tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
