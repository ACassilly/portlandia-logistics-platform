import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-navy mb-4">
        Portlandia <span className="text-primary">Logistics</span>
      </h1>
      <p className="text-muted mb-8 max-w-xl mx-auto">
        Full-service freight brokerage for transparent, reliable shipping.
      </p>
      <Link
        href="/ltl-quote"
        className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
      >
        Get a Freight Quote
      </Link>
    </div>
  );
}
