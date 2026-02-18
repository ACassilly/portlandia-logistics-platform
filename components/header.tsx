"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-navy">
          <span className="text-primary">Portlandia</span> Logistics
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-muted hover:text-navy transition-colors">
            Home
          </Link>
          <Link href="/ltl-quote" className="text-sm font-medium text-primary">
            Get a Quote
          </Link>
          <Link href="/contact" className="text-sm text-muted hover:text-navy transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
