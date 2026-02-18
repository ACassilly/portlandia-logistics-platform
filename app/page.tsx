import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-20">
      <div className="rounded-card border border-pl-border-2 bg-white p-10 shadow-card">
        <div className="text-[12px] font-semibold tracking-[0.12em] text-[#6f6f6f]">WELCOME</div>
        <h1 className="mt-3 text-balance text-[38px] font-semibold leading-[1.05] text-pl-dark">
          Portlandia Logistics Platform
        </h1>
        <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-pl-text">
          This repository is configured for a Next.js App Router build. Use the LTL quote flow to request and book a
          shipment.
        </p>

        <div className="mt-7">
          <Link
            href="/ltl-quote"
            className="inline-flex items-center justify-center rounded-full bg-pl-green px-6 py-3 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
          >
            Go to Get a Freight Quote
          </Link>
        </div>
      </div>
    </main>
  );
}

