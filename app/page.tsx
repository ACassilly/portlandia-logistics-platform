import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-dark-navy text-white py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Freight Solutions <span className="text-primary">You Can Trust</span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Full-service freight brokerage with transparent pricing, real-time tracking, and dedicated support.
            </p>
            <Link
              href="/ltl-quote"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
