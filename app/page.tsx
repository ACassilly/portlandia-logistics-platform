import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pl-navy mb-4">
            Portlandia Logistics
          </h1>
          <p className="text-pl-text mb-8">
            Full-stack freight brokerage platform
          </p>
          <Link
            href="/ltl-quote"
            className="bg-pl-green text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition"
          >
            Get a Freight Quote
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
