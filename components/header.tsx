"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-pl-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pl-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-pl-navy">
              Portlandia Logistics
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-pl-text hover:text-pl-navy transition"
            >
              Home
            </Link>
            <Link
              href="/ltl-quote"
              className="text-sm font-medium text-pl-text hover:text-pl-navy transition"
            >
              Get a Quote
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-pl-text hover:text-pl-navy transition"
            >
              Services
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-pl-text hover:text-pl-navy transition"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-pl-text hover:text-pl-navy transition"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/ltl-quote"
              className="bg-pl-green text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-600 transition"
            >
              Get a Quote
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-pl-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
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
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-pl-border-light bg-white">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-pl-text"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/ltl-quote"
              className="text-sm font-medium text-pl-text"
              onClick={() => setMenuOpen(false)}
            >
              Get a Quote
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-pl-text"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-pl-text"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-pl-text"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/ltl-quote"
              className="bg-pl-green text-white text-sm font-semibold px-5 py-2 rounded-full text-center hover:bg-green-600 transition mt-2"
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
