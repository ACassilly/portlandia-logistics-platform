"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-pl-border-light bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-pl-navy">
            Portlandia<span className="text-pl-green">Logistics</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-pl-text hover:text-pl-navy">
            Home
          </Link>
          <Link href="/ltl-quote" className="text-sm font-medium text-pl-text hover:text-pl-navy">
            LTL Quote
          </Link>
          <Link href="#" className="text-sm font-medium text-pl-text hover:text-pl-navy">
            Services
          </Link>
          <Link href="#" className="text-sm font-medium text-pl-text hover:text-pl-navy">
            About
          </Link>
          <Link href="#" className="text-sm font-medium text-pl-text hover:text-pl-navy">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link
            href="/ltl-quote"
            className="rounded-full bg-pl-green px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Get a Quote
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 text-pl-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-pl-border-light bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-pl-text" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/ltl-quote" className="text-sm font-medium text-pl-text" onClick={() => setMenuOpen(false)}>LTL Quote</Link>
            <Link href="#" className="text-sm font-medium text-pl-text" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="#" className="text-sm font-medium text-pl-text" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="#" className="text-sm font-medium text-pl-text" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link
              href="/ltl-quote"
              className="mt-2 rounded-full bg-pl-green px-6 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
