import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-pl-border-2 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pl-green text-sm font-semibold text-white">
            PL
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-pl-dark">Portlandia Logistics</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-medium text-[#2b2b2b] md:flex">
          <Link href="/" className="hover:text-pl-dark">
            Home
          </Link>
          <Link href="/ltl-quote" className="hover:text-pl-dark">
            Get a Quote
          </Link>
          <a href="#faqs" className="hover:text-pl-dark">
            FAQs
          </a>
          <a href="#contact" className="hover:text-pl-dark">
            Contact
          </a>
        </nav>

        <Link
          href="/ltl-quote"
          className="inline-flex items-center justify-center rounded-full bg-pl-green px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
        >
          Get Instant Quote
        </Link>
      </div>
    </header>
  );
}

