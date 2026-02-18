import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-pl-border-2 bg-white">
      <div className="mx-auto flex h-[88px] max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-pl-green text-[12px] font-semibold text-white">
            PL
          </span>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight text-pl-dark">Portlandia Logistics</div>
            <div className="text-[11px] font-semibold tracking-[0.16em] text-[#7a7a7a]">FREIGHT BROKERAGE</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#2b2b2b] lg:flex">
          <Link href="/" className="hover:text-pl-dark">
            Home
          </Link>
          <a href="/ltl-quote#instant-quote" className="hover:text-pl-dark">
            Quote
          </a>
          <a href="/ltl-quote#services" className="hover:text-pl-dark">
            Services
          </a>
          <a href="/ltl-quote#insights" className="hover:text-pl-dark">
            Insights
          </a>
          <a href="/ltl-quote#testimonials" className="hover:text-pl-dark">
            Testimonials
          </a>
          <a href="/ltl-quote#contact" className="hover:text-pl-dark">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/ltl-quote#instant-quote"
            className="hidden text-[13px] font-semibold text-[#2b2b2b] hover:text-pl-dark md:inline"
          >
            Let&apos;s Connect
          </a>
          <a
            href="/ltl-quote#instant-quote"
            className="inline-flex h-10 items-center justify-center rounded-full bg-pl-green px-5 text-[12px] font-semibold tracking-[0.08em] text-white shadow-sm hover:brightness-95"
          >
            GET A QUOTE
          </a>
        </div>
      </div>
    </header>
  );
}

