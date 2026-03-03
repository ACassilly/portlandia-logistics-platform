export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="pt-14">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[#8a8a8a]">PRIVACY</div>
          <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.04] text-pl-dark sm:text-[52px]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-pl-text">
            This page is a placeholder for the final Privacy Policy copy. It should be updated to reflect Portlandia
            Logistics&apos; data collection, cookies, analytics, and customer information handling practices.
          </p>

          <div className="mt-10 rounded-card border border-pl-border-2 bg-[#fbfbfb] p-6">
            <div className="text-[13px] font-semibold text-pl-dark">Summary</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-pl-text">
              <li>We use your information to provide quotes and book shipments.</li>
              <li>We may use analytics to improve site performance and user experience.</li>
              <li>You can contact us to request updates or deletion of your data where applicable.</li>
            </ul>
          </div>
        </div>
      </section>
      <div className="h-14" />
    </main>
  );
}

