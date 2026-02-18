import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-pl-navy mb-4">
        Portlandia Logistics
      </h1>
      <p className="text-pl-text mb-8">
        Full-stack freight brokerage platform
      </p>
      <Link
        href="/ltl-quote"
        className="bg-pl-green text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
      >
        Get a Freight Quote
      </Link>
    </main>
  );
}
