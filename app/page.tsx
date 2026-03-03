import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="pt-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="relative overflow-hidden rounded-[22px] border border-pl-border-2 bg-[#0b1117] shadow-card">
            <img
              src="/images/hero-blue.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

            <div className="relative px-7 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/70">PORTLANDIA LOGISTICS</div>
              <h1 className="mt-3 max-w-[820px] text-balance text-[38px] font-semibold leading-[1.05] text-white sm:text-[46px] md:text-[52px]">
                Freight quoting, booking, and visibility — built for shippers.
              </h1>
              <p className="mt-4 max-w-[720px] text-pretty text-[15px] leading-7 text-white/75">
                Transparent pricing, fast response, and full visibility from pickup to delivery.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/ltl-quote#instant-quote"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#101010] hover:bg-white/95"
                >
                  GET A QUOTE
                </Link>
                <a
                  href="#services"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-[12px] font-semibold tracking-[0.08em] text-white hover:bg-white/15"
                >
                  VIEW SERVICES
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold tracking-[0.22em] text-[#8a8a8a]">
            {["LTL", "FTL", "WAREHOUSING", "TRACKING", "SUPPORT"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pl-green" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="pt-14">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[#8a8a8a]">
            <span className="text-pl-dark">HOME</span> <span className="mx-2 text-[#c9c9c9]">/</span>{" "}
            <span>FREIGHT QUOTING</span>
          </div>

          <h2 className="mt-4 text-balance text-[40px] font-semibold leading-[1.04] text-pl-dark sm:text-[54px]">
            <span>Get a Freight Quote</span>
            <span className="text-pl-green"> You Can Trust</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-pretty text-[15px] leading-7 text-pl-text sm:text-[16px]">
            Compare carriers, select a rate, and book in minutes. Keep shipment details and documents in one place.
          </p>
        </div>
      </section>

      {/* TWO-COLUMN FEATURE */}
      <section className="pt-10">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-[#dff7ea] shadow-card">
                <img src="/images/road.svg" alt="Open road" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-card border border-pl-border-2 bg-white p-6 shadow-card">
                <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">TRANSPARENT PRICING</div>
                <div className="mt-3 text-balance text-[22px] font-semibold leading-[1.14] text-pl-dark">
                  Reliable freight execution, lane after lane.
                </div>
                <div className="mt-3 text-[14px] leading-7 text-pl-text">
                  Provide shipment details once, then compare carriers by price and transit time. No guessing — no
                  surprises.
                </div>

                <div className="mt-5 grid gap-3 rounded-lg border border-pl-border-2 bg-[#fbfbfb] p-4">
                  {[
                    ["Fast response", "Minutes, not days"],
                    ["Visibility", "Tracking and documents"],
                    ["Support", "Real people, real help"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-6">
                      <div className="text-[13px] font-semibold text-pl-dark">{k}</div>
                      <div className="text-[13px] text-[#6f6f6f]">{v}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/ltl-quote#instant-quote"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-pl-green text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
                >
                  GET INSTANT QUOTE
                </Link>
                <div className="mt-3 text-center text-[13px] text-[#8a8a8a]">
                  or{" "}
                  <a href="#contact" className="underline decoration-[#bdbdbd] underline-offset-4 hover:text-pl-dark">
                    contact us directly
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES (GREEN + COLLAGE) */}
      <section id="services" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div className="relative overflow-hidden rounded-card bg-[#2f8f5c] p-8 text-white shadow-card lg:col-span-7">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/80">SERVICES</div>
              <div className="mt-3 text-balance text-[26px] font-semibold leading-[1.12]">
                Trusted logistics for every lane, every time.
              </div>
              <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-white/80">
                LTL, full truckload, and support services designed to keep your freight moving with predictable outcomes.
              </p>

              <Link
                href="/ltl-quote#instant-quote"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#101010] hover:bg-white/95"
              >
                START A QUOTE
              </Link>

              <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-12 right-10 h-48 w-48 rounded-full bg-white/10" />
            </div>

            <div className="grid gap-6 lg:col-span-5">
              <div className="overflow-hidden rounded-card shadow-card">
                <img src="/images/collage-tall.svg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-card shadow-card">
                  <img src="/images/collage-small-1.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="overflow-hidden rounded-card shadow-card">
                  <img src="/images/collage-small-2.svg" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK QUOTE WIDGET */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-card bg-[#0f5b3f] shadow-card">
                <img src="/images/trucks.svg" alt="Truck fleet" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-card border border-pl-border-2 bg-white p-7 shadow-card">
                <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">GET A FREIGHT QUOTE</div>
                <div className="mt-1 text-[22px] font-semibold text-pl-dark">Start with the basics</div>
                <div className="mt-2 text-[14px] leading-7 text-pl-text">
                  Enter pickup + delivery ZIP codes and estimated weight. You&apos;ll finish the quote on the next step.
                </div>

                <form className="mt-6 grid gap-4 sm:grid-cols-3" action="/ltl-quote" method="GET">
                  <div>
                    <label className="text-[12px] font-semibold text-[#6a6a6a]">Pickup ZIP</label>
                    <input
                      name="pickupZip"
                      className="mt-2 h-11 w-full rounded-lg border border-pl-border-2 bg-white px-3 text-[14px] text-pl-dark placeholder:text-[#9b9b9b] focus:border-pl-green focus:outline-none"
                      placeholder="33130"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[#6a6a6a]">Delivery ZIP</label>
                    <input
                      name="deliveryZip"
                      className="mt-2 h-11 w-full rounded-lg border border-pl-border-2 bg-white px-3 text-[14px] text-pl-dark placeholder:text-[#9b9b9b] focus:border-pl-green focus:outline-none"
                      placeholder="10921"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[#6a6a6a]">Total Weight (lbs)</label>
                    <input
                      name="weightLb"
                      className="mt-2 h-11 w-full rounded-lg border border-pl-border-2 bg-white px-3 text-[14px] text-pl-dark placeholder:text-[#9b9b9b] focus:border-pl-green focus:outline-none"
                      placeholder="500"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-pl-green text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
                    >
                      GET INSTANT QUOTE
                    </button>
                    <div className="mt-3 text-center text-[13px] text-[#8a8a8a]">
                      Need help?{" "}
                      <a href="#contact" className="underline decoration-[#bdbdbd] underline-offset-4 hover:text-pl-dark">
                        Contact us
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DARK FEATURE GRID */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[26px] bg-[#1a1a1a] p-7 text-white shadow-[0_18px_60px_rgba(0,0,0,0.16)] md:p-10">
            <div className="text-center">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/60">FULL VISIBILITY</div>
              <div className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] md:text-[34px]">
                From quote to <span className="text-pl-green">booked</span>, all in one place.
              </div>
              <div className="mx-auto mt-4 max-w-[760px] text-[14px] leading-7 text-white/70">
                Compare carriers, review accessorials, and keep your team aligned with shipment details and documents.
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-card bg-white/8 p-6">
                <div className="text-[14px] font-semibold">Instant carrier comparison</div>
                <div className="mt-2 text-[13px] leading-6 text-white/70">
                  Sort by lowest price or fastest transit, then select the rate that fits your timeline.
                </div>
                <Link
                  href="/ltl-quote#instant-quote"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-pl-green px-5 text-[12px] font-semibold tracking-[0.08em] text-white hover:brightness-95"
                >
                  GET RATES
                </Link>
              </div>

              <div className="overflow-hidden rounded-card bg-[#2A50D9]/25 p-4">
                <img
                  src="/images/app-ui.svg"
                  alt=""
                  className="h-[240px] w-full rounded-card object-cover md:h-[270px]"
                />
              </div>

              <div className="overflow-hidden rounded-card bg-white/6">
                <img src="/images/road.svg" alt="" className="h-[240px] w-full object-cover md:h-[270px]" />
              </div>

              <div className="rounded-card bg-white/8 p-6">
                <div className="text-[14px] font-semibold">Team-ready booking details</div>
                <div className="mt-2 text-[13px] leading-6 text-white/70">
                  Keep shipper and consignee info, references, and special instructions together for a clean handoff.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["BOL", "PRO", "Tracking"].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-semibold text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[22px] bg-[#e9fbf1] p-8 shadow-card md:p-10">
            <div className="text-center">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-[#6a6a6a]">PERFORMANCE</div>
              <div className="mt-3 text-balance text-[26px] font-semibold leading-[1.12] text-pl-dark md:text-[32px]">
                Built for reliable freight execution.
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: "Fast quotes", v: "Minutes", d: "Response time" },
                { k: "Visibility", v: "24/7", d: "Tracking access" },
                { k: "Carrier options", v: "50+", d: "Regional & national" },
                { k: "Support", v: "Human", d: "When it matters" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-card border border-pl-border-2 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">{m.k.toUpperCase()}</div>
                  <div className="mt-2 text-[22px] font-semibold text-pl-green">{m.v}</div>
                  <div className="mt-1 text-[13px] leading-6 text-pl-text">{m.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section id="insights" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.22em] text-[#7a7a7a]">INSIGHTS</div>
              <div className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] text-pl-dark">
                Shipping tips &amp; updates
              </div>
            </div>
            <Link href="/ltl-quote#instant-quote" className="text-[13px] font-semibold text-pl-green hover:underline">
              Get a quote →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "How freight class is calculated", img: "/images/collage-small-2.svg" },
              { title: "Avoid re-class and re-weigh fees", img: "/images/collage-small-1.svg" },
              { title: "LTL accessorials explained", img: "/images/collage-tall.svg" },
            ].map((c) => (
              <div key={c.title} className="overflow-hidden rounded-card border border-pl-border-2 bg-white shadow-card">
                <div className="aspect-[16/10] overflow-hidden bg-[#f6f6f6]">
                  <img src={c.img} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-[14px] font-semibold text-pl-dark">{c.title}</div>
                  <div className="mt-2 text-[13px] leading-6 text-pl-text">
                    Practical guidance to help you ship accurately and keep costs predictable.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[22px] bg-[#f3f3f3] p-8 shadow-card md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.22em] text-[#7a7a7a]">TESTIMONIALS</div>
                <div className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] text-pl-dark">
                  Take inspiration from shippers like you.
                </div>
              </div>
              <div className="text-[13px] font-semibold text-[#6f6f6f]">★ ★ ★ ★ ★</div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Operations Lead",
                  quote: "Fast rates, clear options, and a smooth booking flow. Exactly what we needed.",
                },
                {
                  name: "Shipping Manager",
                  quote: "The accessorial selections and totals make it easy to quote correctly the first time.",
                },
                { name: "Warehouse Admin", quote: "Carrier choices are straightforward and the confirmation step is quick." },
                { name: "Procurement", quote: "Great pricing visibility and responsive support whenever we have a question." },
              ].map((t) => (
                <div key={t.name} className="rounded-card border border-pl-border-2 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#e9fbf1]" />
                    <div className="text-[13px] font-semibold text-pl-dark">{t.name}</div>
                  </div>
                  <div className="mt-4 text-[13px] leading-6 text-pl-text">“{t.quote}”</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STAY UPDATED */}
      <section className="pt-16">
        <div className="relative overflow-hidden bg-[#0f1b18]">
          <div className="absolute inset-0">
            <img src="/images/trucks.svg" alt="" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-[#0f1b18]/85" />
          </div>

          <div className="relative mx-auto max-w-[1200px] px-6 py-16">
            <div className="max-w-[720px]">
              <div className="text-[12px] font-semibold tracking-[0.12em] text-white/60">NEWSLETTER</div>
              <h2 className="mt-2 text-balance text-[34px] font-semibold leading-[1.08] text-white">Stay Updated</h2>
              <p className="mt-3 text-pretty text-[15px] leading-7 text-white/70">
                Get the latest industry news, shipping insights, and service updates — delivered to your inbox.
              </p>
            </div>

            <form
              className="mt-7 flex w-full max-w-[640px] flex-col gap-3 sm:flex-row"
              action="#"
              method="GET"
            >
              <input
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-[14px] text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
                type="email"
                placeholder="Email address"
                required
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-pl-green px-6 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="pb-20 pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div className="relative overflow-hidden rounded-card bg-[#2f8f5c] p-8 text-white shadow-card lg:col-span-7">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/80">NEED HELP?</div>
              <div className="mt-3 text-balance text-[26px] font-semibold leading-[1.12]">
                Talk to a freight specialist.
              </div>
              <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-white/80">
                Prefer to quote with a person? We&apos;ll validate details, confirm accessorials, and respond fast.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:quotes@portlandialogistics.com"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#101010] hover:bg-white/95"
                >
                  EMAIL US
                </a>
                <a
                  href="tel:+15035550199"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-[12px] font-semibold tracking-[0.08em] text-white hover:bg-white/15"
                >
                  CALL (503) 555-0199
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-card shadow-card lg:col-span-5">
              <img src="/images/hero-blue.svg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </main>
  );
}

