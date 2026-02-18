"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border-lighter sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-lg text-dark-navy">
              Portlandia Logistics
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-text-body hover:text-dark-navy transition-colors">
              Home
            </Link>
            <Link href="/ltl-quote" className="text-sm text-text-body hover:text-dark-navy transition-colors">
              LTL Quote
            </Link>
            <Link href="#" className="text-sm text-text-body hover:text-dark-navy transition-colors">
              Services
            </Link>
            <Link href="#" className="text-sm text-text-body hover:text-dark-navy transition-colors">
              About
            </Link>
            <Link href="#" className="text-sm text-text-body hover:text-dark-navy transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/ltl-quote"
              className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-dark-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border-lighter bg-white px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-3">
            <Link href="/" className="text-sm text-text-body py-1" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/ltl-quote" className="text-sm text-text-body py-1" onClick={() => setMobileOpen(false)}>LTL Quote</Link>
            <Link href="#" className="text-sm text-text-body py-1">Services</Link>
            <Link href="#" className="text-sm text-text-body py-1">About</Link>
            <Link href="#" className="text-sm text-text-body py-1">Contact</Link>
            <Link href="/ltl-quote" className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center mt-2">
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
