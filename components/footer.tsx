import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-pl-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <span className="text-xl font-bold">
              Portlandia<span className="text-pl-green">Logistics</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Full-service freight brokerage delivering transparent pricing,
              real-time tracking, and reliable service across the nation.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ltl-quote" className="text-gray-300 hover:text-white">LTL Shipping</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">FTL Shipping</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Flatbed</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Specialized</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>info@portlandialogistics.com</li>
              <li>(503) 555-0123</li>
              <li>Portland, OR</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Portlandia Logistics. All rights reserved.
          <span className="mx-2">|</span>
          A Dynamic Distribution Solutions LLC Company
        </div>
      </div>
    </footer>
  );
}
