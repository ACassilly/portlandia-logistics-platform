import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="mt-20 border-t border-pl-border-2 bg-[#0f1b18] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pl-green text-sm font-semibold text-white">
              PL
            </span>
            <span className="text-[16px] font-semibold tracking-tight">Portlandia Logistics</span>
          </div>
          <p className="mt-4 max-w-[520px] text-[13px] leading-6 text-white/70">
            Transparent pricing, fast response, and full visibility from pickup to delivery. Request an LTL freight quote
            in minutes and book with confidence.
          </p>
        </div>

        <div>
          <div className="text-[12px] font-semibold tracking-[0.12em] text-white/70">COMPANY</div>
          <ul className="mt-4 space-y-2 text-[13px] text-white/85">
            <li>
              <Link className="hover:text-white" href="/ltl-quote">
                Get a Quote
              </Link>
            </li>
            <li>
              <a className="hover:text-white" href="#faqs">
                FAQs
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-[12px] font-semibold tracking-[0.12em] text-white/70">CONTACT</div>
          <ul className="mt-4 space-y-2 text-[13px] text-white/85">
            <li>
              <a className="hover:text-white" href="mailto:quotes@portlandialogistics.com">
                quotes@portlandialogistics.com
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="tel:+15035550199">
                (503) 555-0199
              </a>
            </li>
            <li className="text-white/70">Portland, OR</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-6 text-[12px] text-white/60 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Portlandia Logistics. All rights reserved.</div>
          <div className="flex gap-6">
            <a className="hover:text-white" href="#">
              Privacy
            </a>
            <a className="hover:text-white" href="#">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

