import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-pl-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-pl-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PL</span>
              </div>
              <span className="font-bold text-lg">
                Portlandia Logistics
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Full-service freight brokerage providing transparent pricing and
              reliable shipping solutions nationwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/ltl-quote" className="hover:text-pl-green transition">
                  LTL Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  Full Truckload
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  Expedited Freight
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  Warehousing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pl-green transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@portlandialogistics.com</li>
              <li>(503) 555-0123</li>
              <li>Portland, OR</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Portlandia Logistics. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="#" className="hover:text-pl-green transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-pl-green transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
