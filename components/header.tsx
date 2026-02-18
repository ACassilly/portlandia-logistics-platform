"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-pl-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pl-green rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">PL</span>
          </div>
          <span className="font-bold text-pl-navy text-lg hidden sm:inline">
            Portlandia Logistics
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-pl-text">
          <Link href="/" className="hover:text-pl-green transition">
            Home
          </Link>
          <Link href="/ltl-quote" className="hover:text-pl-green transition">
            LTL Quote
          </Link>
          <Link href="#" className="hover:text-pl-green transition">
            Services
          </Link>
          <Link href="#" className="hover:text-pl-green transition">
            About
          </Link>
          <Link href="#" className="hover:text-pl-green transition">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/ltl-quote"
            className="bg-pl-green text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
          >
            Get a Quote
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-pl-navy"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-pl-border-light bg-white px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block text-pl-text hover:text-pl-green transition"
          >
            Home
          </Link>
          <Link
            href="/ltl-quote"
            className="block text-pl-text hover:text-pl-green transition"
          >
            LTL Quote
          </Link>
          <Link
            href="#"
            className="block text-pl-text hover:text-pl-green transition"
          >
            Services
          </Link>
          <Link
            href="#"
            className="block text-pl-text hover:text-pl-green transition"
          >
            About
          </Link>
          <Link
            href="#"
            className="block text-pl-text hover:text-pl-green transition"
          >
            Contact
          </Link>
          <Link
            href="/ltl-quote"
            className="block bg-pl-green text-white text-center text-sm font-semibold px-5 py-2 rounded-full"
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
