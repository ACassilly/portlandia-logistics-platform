import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
        <h1 className="text-4xl font-bold text-pl-navy md:text-5xl">
          Portlandia Logistics
        </h1>
        <p className="mt-4 max-w-xl text-center text-lg text-pl-text">
          Full-service freight brokerage — LTL, FTL, flatbed, and specialized
          shipping with transparent pricing and real-time tracking.
        </p>
        <Link
          href="/ltl-quote"
          className="mt-8 rounded-full bg-pl-green px-8 py-3 text-lg font-semibold text-white transition hover:brightness-110"
        >
          Get a Freight Quote
        </Link>
      </main>
      <Footer />
    </>
  );
}
