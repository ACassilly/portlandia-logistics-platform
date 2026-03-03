export default function TermsPage() {
  return (
    <main className="bg-white">
      <section className="pt-14">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[#8a8a8a]">TERMS</div>
          <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.04] text-pl-dark sm:text-[52px]">
            Terms of Service
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-pl-text">
            This page is a placeholder for the final Terms of Service copy. It should be updated to reflect carrier
            terms, brokerage terms, liability limits, and booking conditions.
          </p>

          <div className="mt-10 rounded-card border border-pl-border-2 bg-[#fbfbfb] p-6">
            <div className="text-[13px] font-semibold text-pl-dark">Summary</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-pl-text">
              <li>Quotes depend on accurate shipment details (weight, dims, class, accessorials).</li>
              <li>Carrier re-rates may apply if shipment details differ at pickup.</li>
              <li>Booking confirmation provides shipment identifiers (BOL/PRO) and tracking when available.</li>
            </ul>
          </div>
        </div>
      </section>
      <div className="h-14" />
    </main>
  );
}

