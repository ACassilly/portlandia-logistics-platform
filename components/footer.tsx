import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white pb-12 pt-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="rounded-[26px] bg-[#1a1a1a] px-8 py-10 text-white shadow-[0_18px_60px_rgba(0,0,0,0.16)] md:px-12 md:py-12">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-pl-green text-[12px] font-semibold text-white">
                  PL
                </span>
                <div className="leading-tight">
                  <div className="text-[15px] font-semibold tracking-tight">Portlandia Logistics</div>
                  <div className="text-[11px] font-semibold tracking-[0.16em] text-white/60">FREIGHT BROKERAGE</div>
                </div>
              </div>

              <p className="mt-5 max-w-[520px] text-[13px] leading-6 text-white/70">
                Transparent pricing, fast response, and full visibility from pickup to delivery. Compare carriers, select a
                rate, and book in minutes.
              </p>

              <div className="mt-6 flex items-center gap-3">
                {["in", "x", "f"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[12px] font-semibold text-white/80 hover:bg-white/10"
                    aria-label="Social link"
                  >
                    {s.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="text-[12px] font-semibold tracking-[0.12em] text-white/60">LINKS</div>
              <ul className="mt-4 space-y-2 text-[13px] text-white/80">
                <li>
                  <Link className="hover:text-white" href="/ltl-quote#instant-quote">
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/#services">
                    Services
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/#insights">
                    Insights
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white" href="/#testimonials">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="text-[12px] font-semibold tracking-[0.12em] text-white/60">CONTACT</div>
              <div className="mt-4 space-y-2 text-[13px] text-white/80">
                <div>
                  <a className="hover:text-white" href="mailto:quotes@portlandialogistics.com">
                    quotes@portlandialogistics.com
                  </a>
                </div>
                <div>
                  <a className="hover:text-white" href="tel:+15035550199">
                    (503) 555-0199
                  </a>
                </div>
                <div className="text-white/60">Portland, OR</div>
              </div>

              <a
                href="/ltl-quote#instant-quote"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-pl-green px-6 text-[12px] font-semibold tracking-[0.08em] text-white hover:brightness-95"
              >
                GET A QUOTE
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-3 text-[12px] text-white/55 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Portlandia Logistics. All rights reserved.</div>
              <div className="flex gap-6">
                <Link className="hover:text-white" href="/privacy">
                  Privacy
                </Link>
                <Link className="hover:text-white" href="/terms">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

