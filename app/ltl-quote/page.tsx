"use client";

import { useState, useCallback } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ItemRow {
  qty: number;
  handlingUnit: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  freightClass: string;
  hazmat: boolean;
}

interface PickupDelivery {
  date: string;
  zip: string;
  city: string;
  state: string;
  locationType: "business" | "residential";
  liftgate: boolean;
  insidePickup: boolean;
  appointmentRequired: boolean;
  limitedAccess: boolean;
}

interface Conditions {
  declaredValue: string;
  specialInstructions: string;
  termsAccepted: boolean;
}

interface ShipperConsignee {
  company: string;
  contact: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

interface CarrierRate {
  id: string;
  name: string;
  transitDays: number;
  price: number;
  serviceType: string;
}

interface BookingResult {
  bolNumber: string;
  proNumber: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HANDLING_UNITS = [
  "Pallet", "Box", "Bag", "Bale", "Bundle", "Carton", "Case", "Crate",
  "Cylinder", "Drum", "Gallon", "Pieces", "Reel", "Roll", "Skid", "Totes",
  "Tube", "Other",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY",
];

function calcFreightClass(weight: number, l: number, w: number, h: number): string {
  if (!weight || !l || !w || !h) return "—";
  const cubicFeet = (l * w * h) / 1728;
  if (cubicFeet === 0) return "—";
  const density = weight / cubicFeet;
  if (density >= 50) return "50";
  if (density >= 35) return "55";
  if (density >= 30) return "60";
  if (density >= 22.5) return "65";
  if (density >= 15) return "70";
  if (density >= 13.5) return "77.5";
  if (density >= 12) return "85";
  if (density >= 10.5) return "92.5";
  if (density >= 9) return "100";
  if (density >= 8) return "110";
  if (density >= 7) return "125";
  if (density >= 6) return "150";
  if (density >= 5) return "175";
  if (density >= 4) return "200";
  if (density >= 3) return "250";
  if (density >= 2) return "300";
  if (density >= 1) return "400";
  return "500";
}

function emptyPickupDelivery(): PickupDelivery {
  return {
    date: "", zip: "", city: "", state: "",
    locationType: "business",
    liftgate: false, insidePickup: false, appointmentRequired: false, limitedAccess: false,
  };
}

function emptyItem(): ItemRow {
  return {
    qty: 1, handlingUnit: "Pallet",
    length: 0, width: 0, height: 0, weight: 0,
    freightClass: "—", hazmat: false,
  };
}

function emptyShipperConsignee(): ShipperConsignee {
  return {
    company: "", contact: "", phone: "", email: "",
    address1: "", address2: "", city: "", state: "", zip: "",
  };
}

/* ------------------------------------------------------------------ */
/*  Reusable sub-components                                            */
/* ------------------------------------------------------------------ */

function ProgressSteps({ current }: { current: number }) {
  const steps = ["Quote Details", "Carrier Rates", "Booking Info", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={`hidden sm:block w-8 md:w-12 h-0.5 ${
                  isDone ? "bg-pl-green" : "bg-pl-border"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isActive
                    ? "bg-pl-green text-white"
                    : isDone
                    ? "bg-pl-green text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-pl-green" : isDone ? "text-pl-green" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    { q: "How long does it take to receive a quote?", a: "You'll receive instant carrier rates as soon as you submit your shipment details. Our system queries multiple carriers in real-time to give you the most competitive pricing available." },
    { q: "What information do I need to request a quote?", a: "You'll need pickup and delivery zip codes, shipment dimensions (length, width, height), weight, number of handling units, and any special requirements like liftgate service or residential delivery." },
    { q: "Is requesting a quote free?", a: "Yes, requesting a quote is completely free with no obligation. You can compare rates from multiple carriers before making a decision." },
    { q: "Will the quoted price change later?", a: "Quoted prices are guaranteed for the service selected at the time of booking. Prices may change if shipment details (weight, dimensions, or accessorials) differ from what was originally quoted." },
    { q: "What happens after I submit a quote request?", a: "After submitting your shipment details, you'll instantly see available carrier rates. Select your preferred carrier, enter shipper and consignee details, and confirm your booking to receive a BOL number." },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-pl-navy text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-pl-text mb-10">
          Everything you need to know about our quoting process
        </p>

        <div className="divide-y divide-pl-border-light">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="font-medium text-pl-navy group-hover:text-pl-green transition pr-4">
                  {faq.q}
                </span>
                <span className="text-2xl text-pl-text flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {openIdx === i ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </span>
              </button>
              {openIdx === i && (
                <div className="pb-5 text-sm text-pl-text leading-relaxed -mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 relative overflow-hidden rounded-xl bg-pl-navy p-8 text-center">
          <svg
            className="absolute top-0 right-0 w-48 h-48 text-pl-green opacity-20"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <path d="M0 100c0-20 10-40 30-55s50-20 70-10 30 30 50 40 50 10 50 30-10 40-30 55-50 20-70 10-30-30-50-40S0 120 0 100z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">
            Didn&apos;t find your answer?
          </h3>
          <p className="text-gray-400 text-sm mb-5 relative z-10">
            Our team is here to help with any questions about shipping and logistics.
          </p>
          <button className="relative z-10 bg-white text-pl-navy font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-100 transition">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
}

function StayUpdatedSection() {
  const [email, setEmail] = useState("");
  return (
    <section className="relative bg-pl-navy overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/trucks.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-pl-navy via-pl-navy/90 to-pl-navy/70" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Stay Updated
        </h2>
        <p className="text-gray-300 max-w-lg mx-auto mb-8">
          Get the latest industry news, shipping tips, and exclusive offers delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pl-green"
          />
          <button className="w-full sm:w-auto bg-pl-green text-white font-semibold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function LTLQuotePage() {
  /* Multi-step: 1=form, 2=results, 3=shipper/consignee, 4=confirmation */
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery" | "items" | "conditions">("pickup");

  /* Form state */
  const [pickup, setPickup] = useState<PickupDelivery>(emptyPickupDelivery());
  const [delivery, setDelivery] = useState<PickupDelivery>(emptyPickupDelivery());
  const [items, setItems] = useState<ItemRow[]>([emptyItem()]);
  const [conditions, setConditions] = useState<Conditions>({
    declaredValue: "", specialInstructions: "", termsAccepted: false,
  });

  /* Results state */
  const [rates, setRates] = useState<CarrierRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "speed">("price");
  const [loading, setLoading] = useState(false);

  /* Shipper/consignee state */
  const [shipper, setShipper] = useState<ShipperConsignee>(emptyShipperConsignee());
  const [consignee, setConsignee] = useState<ShipperConsignee>(emptyShipperConsignee());
  const [poNumber, setPoNumber] = useState("");
  const [customerRef, setCustomerRef] = useState("");

  /* Confirmation state */
  const [booking, setBooking] = useState<BookingResult | null>(null);

  /* ---- item helpers ---- */
  const updateItem = useCallback((idx: number, field: keyof ItemRow, value: string | number | boolean) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[idx], [field]: value };
      item.freightClass = calcFreightClass(item.weight, item.length, item.width, item.height);
      next[idx] = item;
      return next;
    });
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, emptyItem()]);
  }, []);

  const removeItem = useCallback((idx: number) => {
    setItems((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  }, []);

  /* ---- totals ---- */
  const totalWeight = items.reduce((s, it) => s + (it.weight * it.qty), 0);
  const totalDensity = (() => {
    const totalCubic = items.reduce((s, it) => {
      const cf = (it.length * it.width * it.height) / 1728;
      return s + cf * it.qty;
    }, 0);
    return totalCubic > 0 ? (totalWeight / totalCubic).toFixed(1) : "—";
  })();

  /* ---- API calls ---- */
  async function fetchRates() {
    setLoading(true);
    try {
      const res = await fetch("/api/gtz/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, delivery, items, conditions }),
      });
      const data = await res.json();
      setRates(data.rates || []);
      setStep(2);
    } catch {
      alert("Failed to fetch rates. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function bookShipment() {
    setLoading(true);
    try {
      const res = await fetch("/api/gtz/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate: selectedRate,
          shipper,
          consignee,
          poNumber,
          customerRef,
          pickup,
          delivery,
          items,
          conditions,
        }),
      });
      const data = await res.json();
      setBooking({ bolNumber: data.bolNumber, proNumber: data.proNumber });
      setStep(4);
    } catch {
      alert("Failed to book shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const sortedRates = [...rates].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : a.transitDays - b.transitDays
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* ============ HERO SECTION ============ */}
      <section className="bg-white pt-6 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs uppercase tracking-widest text-gray-400 mb-6">
            <span className="hover:text-pl-green cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-pl-text">Let&apos;s Connect</span>
          </nav>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
            <span className="text-pl-navy">Get a Freight Quote</span>{" "}
            <span className="text-pl-green">You Can Trust</span>
          </h1>
          <p className="text-pl-text max-w-2xl mb-8 text-base md:text-lg">
            Transparent pricing, fast response, and full visibility from pickup to delivery.
          </p>

          {/* Two-column hero */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Truck image */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden bg-gradient-to-br from-green-600 to-green-800 h-64 md:h-80 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#33945c] to-[#102b26]" />
              <div className="relative z-10 text-center text-white/80">
                <svg className="w-20 h-20 mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h1m6 0h1M3 11l1-5h4l1 5M3 11h10m0 0l1-5h2.5l2.5 5M13 11h6m-3 6a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <p className="font-semibold text-lg">Portlandia Fleet</p>
                <p className="text-sm opacity-70">Trusted nationwide logistics</p>
              </div>
            </div>

            {/* Floating quote card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rate Starting at</p>
                  <p className="text-3xl font-bold text-pl-green">$266.44</p>
                </div>
                <button className="text-xs text-pl-green font-medium hover:underline">Edit</button>
              </div>

              <span className="inline-block bg-green-50 text-pl-green text-xs font-medium px-3 py-1 rounded-full mb-4">
                Eligible for LTL Shipping
              </span>

              <p className="text-sm text-pl-text mb-4">
                From <span className="font-semibold text-pl-navy">Miami, FL 33130</span>{" "}
                To <span className="font-semibold text-pl-navy">Florida, NY 10921</span>
              </p>

              <div className="divide-y divide-pl-border-light text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Shipment Type</span>
                  <span className="font-medium text-pl-navy">LTL</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Total Weight</span>
                  <span className="font-medium text-pl-navy">500 lbs</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Freight Class</span>
                  <span className="font-medium text-pl-navy">500 lbs</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById("quote-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-6 w-full bg-pl-green text-white font-semibold py-3 rounded-full hover:opacity-90 transition text-sm"
              >
                GET INSTANT QUOTE
              </button>
              <p className="text-center text-xs text-gray-400 mt-3 hover:text-pl-green cursor-pointer">
                or contact us directly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FORM / RESULTS AREA ============ */}
      <section id="quote-form" className="bg-gray-50 py-12 md:py-16 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressSteps current={step} />

          {/* ======== STEP 1: QUOTE FORM ======== */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-pl-border-light">
                <h2 className="text-2xl font-bold text-pl-navy">Get Your Best Rate</h2>
                <p className="text-sm text-pl-text mt-1">Fill in your shipment details to receive instant carrier rates</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-pl-border-light overflow-x-auto">
                {(["pickup", "delivery", "items", "conditions"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[100px] py-3 px-4 text-sm font-semibold uppercase tracking-wider text-center transition border-b-2 ${
                      activeTab === tab
                        ? "border-pl-green text-pl-green"
                        : "border-transparent text-gray-400 hover:text-pl-text"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {/* ---- PICKUP TAB ---- */}
                {activeTab === "pickup" && (
                  <PickupDeliveryForm
                    label="Pickup"
                    data={pickup}
                    onChange={setPickup}
                  />
                )}

                {/* ---- DELIVERY TAB ---- */}
                {activeTab === "delivery" && (
                  <PickupDeliveryForm
                    label="Delivery"
                    data={delivery}
                    onChange={setDelivery}
                  />
                )}

                {/* ---- ITEMS TAB ---- */}
                {activeTab === "items" && (
                  <div>
                    <h3 className="text-lg font-semibold text-pl-navy mb-4">Shipment Items</h3>

                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="border border-pl-border-light rounded-lg p-4 mb-4 relative"
                      >
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(idx)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                            title="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Qty</label>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => updateItem(idx, "qty", Number(e.target.value))}
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-3">
                            <label className="block text-xs text-gray-400 mb-1">Handling Unit</label>
                            <select
                              value={item.handlingUnit}
                              onChange={(e) => updateItem(idx, "handlingUnit", e.target.value)}
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pl-green"
                            >
                              {HANDLING_UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">L (in)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.length || ""}
                              onChange={(e) => updateItem(idx, "length", Number(e.target.value))}
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">W (in)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.width || ""}
                              onChange={(e) => updateItem(idx, "width", Number(e.target.value))}
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">H (in)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.height || ""}
                              onChange={(e) => updateItem(idx, "height", Number(e.target.value))}
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Weight (lbs)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.weight || ""}
                              onChange={(e) => updateItem(idx, "weight", Number(e.target.value))}
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Freight Class</label>
                            <div className="border border-pl-border rounded-lg px-3 py-2 text-sm bg-gray-50 text-pl-navy font-medium">
                              {item.freightClass}
                            </div>
                          </div>
                          <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={item.hazmat}
                                onChange={(e) => updateItem(idx, "hazmat", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-pl-green focus:ring-pl-green"
                              />
                              Hazmat
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addItem}
                      className="text-pl-green text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Item
                    </button>

                    {/* Totals */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Total Weight</span>
                        <p className="font-semibold text-pl-navy">{totalWeight} lbs</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Density</span>
                        <p className="font-semibold text-pl-navy">{totalDensity} pcf</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Suggested Class</span>
                        <p className="font-semibold text-pl-navy">
                          {items[0]?.freightClass || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---- CONDITIONS TAB ---- */}
                {activeTab === "conditions" && (
                  <div>
                    <h3 className="text-lg font-semibold text-pl-navy mb-4">Conditions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Declared Value ($)</label>
                        <input
                          type="text"
                          value={conditions.declaredValue}
                          onChange={(e) =>
                            setConditions({ ...conditions, declaredValue: e.target.value })
                          }
                          placeholder="0.00"
                          className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Special Instructions</label>
                        <textarea
                          value={conditions.specialInstructions}
                          onChange={(e) =>
                            setConditions({ ...conditions, specialInstructions: e.target.value })
                          }
                          rows={4}
                          placeholder="Any special handling instructions..."
                          className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green resize-none"
                        />
                      </div>
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={conditions.termsAccepted}
                          onChange={(e) =>
                            setConditions({ ...conditions, termsAccepted: e.target.checked })
                          }
                          className="w-4 h-4 mt-0.5 rounded border-gray-300 text-pl-green focus:ring-pl-green"
                        />
                        <span className="text-pl-text">
                          I agree to the{" "}
                          <span className="text-pl-green font-medium cursor-pointer hover:underline">
                            Terms & Conditions
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="p-6 md:p-8 border-t border-pl-border-light">
                <button
                  onClick={fetchRates}
                  disabled={loading}
                  className="w-full bg-pl-green text-white font-semibold py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
                >
                  {loading ? "Getting Rates..." : "Get Carrier Rates"}
                </button>
              </div>
            </div>
          )}

          {/* ======== STEP 2: RESULTS ======== */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm font-medium text-pl-green hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Edit Quote
                </button>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Sort by:</span>
                  <button
                    onClick={() => setSortBy("price")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      sortBy === "price"
                        ? "bg-pl-green text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    onClick={() => setSortBy("speed")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      sortBy === "speed"
                        ? "bg-pl-green text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Fastest
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {sortedRates.map((rate) => (
                  <div
                    key={rate.id}
                    className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-pl-navy text-lg">{rate.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{rate.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {rate.transitDays} {rate.transitDays === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pl-green">${rate.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRate(rate);
                        setStep(3);
                      }}
                      className="bg-pl-green text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition whitespace-nowrap"
                    >
                      Select Rate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======== STEP 3: SHIPPER / CONSIGNEE ======== */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-pl-border-light flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-pl-navy">Booking Information</h2>
                  <p className="text-sm text-pl-text mt-1">
                    Selected: <span className="font-semibold text-pl-green">{selectedRate?.name}</span> — ${selectedRate?.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-pl-green font-medium hover:underline"
                >
                  Change Rate
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Shipper */}
                  <div>
                    <h3 className="text-lg font-semibold text-pl-navy mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-pl-green rounded-full flex items-center justify-center text-white text-xs">S</span>
                      Shipper
                    </h3>
                    <ContactForm data={shipper} onChange={setShipper} />
                  </div>

                  {/* Consignee */}
                  <div>
                    <h3 className="text-lg font-semibold text-pl-navy mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-pl-navy rounded-full flex items-center justify-center text-white text-xs">C</span>
                      Consignee
                    </h3>
                    <ContactForm data={consignee} onChange={setConsignee} />
                  </div>
                </div>

                {/* References */}
                <div className="mt-8 border-t border-pl-border-light pt-6">
                  <h3 className="text-lg font-semibold text-pl-navy mb-4">References</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">PO #</label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Customer Ref</label>
                      <input
                        type="text"
                        value={customerRef}
                        onChange={(e) => setCustomerRef(e.target.value)}
                        className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-pl-border-light">
                <button
                  onClick={bookShipment}
                  disabled={loading}
                  className="w-full bg-pl-green text-white font-semibold py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
                >
                  {loading ? "Booking..." : "Confirm & Book"}
                </button>
              </div>
            </div>
          )}

          {/* ======== STEP 4: CONFIRMATION ======== */}
          {step === 4 && booking && (
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-8 md:p-12 text-center">
              {/* Green checkmark */}
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-pl-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-pl-navy mb-2">Booking Confirmed!</h2>
              <p className="text-pl-text mb-8">
                Your shipment has been booked successfully. Here are your reference numbers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">BOL Number</p>
                  <p className="font-bold text-pl-navy text-lg">{booking.bolNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">PRO Number</p>
                  <p className="font-bold text-pl-navy text-lg">{booking.proNumber}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button className="w-full sm:w-auto bg-pl-green text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition">
                  Download BOL
                </button>
                <button className="w-full sm:w-auto border border-pl-green text-pl-green font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-green-50 transition">
                  Track Shipment
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setActiveTab("pickup");
                    setPickup(emptyPickupDelivery());
                    setDelivery(emptyPickupDelivery());
                    setItems([emptyItem()]);
                    setConditions({ declaredValue: "", specialInstructions: "", termsAccepted: false });
                    setRates([]);
                    setSelectedRate(null);
                    setShipper(emptyShipperConsignee());
                    setConsignee(emptyShipperConsignee());
                    setPoNumber("");
                    setCustomerRef("");
                    setBooking(null);
                  }}
                  className="w-full sm:w-auto border border-pl-border text-pl-text font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ FAQs ============ */}
      <FAQSection />

      {/* ============ STAY UPDATED ============ */}
      <StayUpdatedSection />

      {/* ============ FOOTER ============ */}
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components used in the form                                    */
/* ------------------------------------------------------------------ */

function PickupDeliveryForm({
  label,
  data,
  onChange,
}: {
  label: string;
  data: PickupDelivery;
  onChange: (d: PickupDelivery) => void;
}) {
  const update = (field: keyof PickupDelivery, value: string | boolean) =>
    onChange({ ...data, [field]: value });

  return (
    <div>
      <h3 className="text-lg font-semibold text-pl-navy mb-4">{label} Details</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">{label} Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Zip Code</label>
            <input
              type="text"
              value={data.zip}
              onChange={(e) => update("zip", e.target.value)}
              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">State</label>
            <select
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pl-green"
            >
              <option value="">Select</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location type toggle */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">Location Type</label>
          <div className="flex gap-2">
            {(["business", "residential"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update("locationType", type)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition border ${
                  data.locationType === type
                    ? "bg-pl-green text-white border-pl-green"
                    : "bg-white text-pl-text border-pl-border hover:border-pl-green"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Accessorials */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">Accessorials</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "liftgate" as const, label: "Liftgate" },
              { key: "insidePickup" as const, label: "Inside Pickup" },
              { key: "appointmentRequired" as const, label: "Appointment Required" },
              { key: "limitedAccess" as const, label: "Limited Access" },
            ].map(({ key, label: lbl }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-pl-text">
                <input
                  type="checkbox"
                  checked={data[key] as boolean}
                  onChange={(e) => update(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-pl-green focus:ring-pl-green"
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm({
  data,
  onChange,
}: {
  data: ShipperConsignee;
  onChange: (d: ShipperConsignee) => void;
}) {
  const update = (field: keyof ShipperConsignee, value: string) =>
    onChange({ ...data, [field]: value });

  const fields: { key: keyof ShipperConsignee; label: string; type?: string; colSpan?: string }[] = [
    { key: "company", label: "Company", colSpan: "col-span-2" },
    { key: "contact", label: "Contact Name" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email", colSpan: "col-span-2" },
    { key: "address1", label: "Address Line 1", colSpan: "col-span-2" },
    { key: "address2", label: "Address Line 2", colSpan: "col-span-2" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zip", label: "Zip Code" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(({ key, label, type, colSpan }) => (
        <div key={key} className={colSpan || ""}>
          <label className="block text-xs text-gray-400 mb-1">{label}</label>
          {key === "state" ? (
            <select
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pl-green"
            >
              <option value="">Select</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <input
              type={type || "text"}
              value={data[key]}
              onChange={(e) => update(key, e.target.value)}
              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pl-green"
            />
          )}
        </div>
      ))}
    </div>
  );
}
