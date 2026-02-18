"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-white">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-navy mb-4">Portlandia Logistics</h3>
            <p className="text-sm text-muted">
              Full-service freight brokerage for transparent, reliable shipping.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-navy mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/ltl-quote" className="hover:text-primary transition-colors">LTL Freight</Link></li>
              <li><Link href="/ltl-quote" className="hover:text-primary transition-colors">Get a Quote</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-navy mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-navy mb-4">Contact</h4>
            <p className="text-sm text-muted">
              erp.portlandialogistics.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border-light text-center text-sm text-muted">
          © {new Date().getFullYear()} Portlandia Logistics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
