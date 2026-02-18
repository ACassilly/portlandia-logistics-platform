"use client";

import { useState, FormEvent } from "react";
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

interface LocationData {
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

interface ConditionsData {
  declaredValue: string;
  specialInstructions: string;
  termsAccepted: boolean;
}

interface ContactInfo {
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

interface BookingConfirmation {
  bolNumber: string;
  proNumber: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const HANDLING_UNITS = [
  "Pallet",
  "Box",
  "Bag",
  "Bale",
  "Bundle",
  "Carton",
  "Case",
  "Crate",
  "Cylinder",
  "Drum",
  "Gallon",
  "Pieces",
  "Reel",
  "Roll",
  "Skid",
  "Totes",
  "Tube",
  "Other",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const FAQ_ITEMS = [
  {
    q: "How long does it take to receive a quote?",
    a: "Most quotes are returned instantly. Our system connects with multiple carriers in real-time to provide you with competitive rates within seconds of submitting your shipment details.",
  },
  {
    q: "What information do I need to request a quote?",
    a: "You'll need pickup and delivery zip codes, shipment dimensions and weight, freight class, and any special requirements like liftgate service or inside delivery.",
  },
  {
    q: "Is requesting a quote free?",
    a: "Yes, requesting a quote is completely free with no obligation. You can compare rates from multiple carriers before making a decision.",
  },
  {
    q: "Will the quoted price change later?",
    a: "Quoted prices are guaranteed for the shipment details provided. Prices may change if actual shipment dimensions, weight, or freight class differ from what was quoted.",
  },
  {
    q: "What happens after I submit a quote request?",
    a: "After submitting, you'll instantly receive competitive rates from multiple carriers. You can select your preferred carrier, enter shipper and consignee details, and book your shipment — all in one seamless flow.",
  },
];

const STEPS = ["Quote Details", "Carrier Rates", "Booking Info", "Confirmation"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function emptyLocation(): LocationData {
  return {
    date: "",
    zip: "",
    city: "",
    state: "",
    locationType: "business",
    liftgate: false,
    insidePickup: false,
    appointmentRequired: false,
    limitedAccess: false,
  };
}

function emptyItem(): ItemRow {
  return {
    qty: 1,
    handlingUnit: "Pallet",
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    freightClass: "",
    hazmat: false,
  };
}

function emptyContact(): ContactInfo {
  return {
    company: "",
    contact: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  };
}

function calcDensity(item: ItemRow): number {
  if (item.length && item.width && item.height && item.weight) {
    const cubicFeet =
      (item.length * item.width * item.height) / 1728;
    return cubicFeet > 0 ? item.weight / cubicFeet : 0;
  }
  return 0;
}

function suggestFreightClass(density: number): string {
  if (density === 0) return "";
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

/* ================================================================== */
/*  PAGE COMPONENT                                                     */
/* ================================================================== */

export default function LtlQuotePage() {
  /* ---- multi-step state ---- */
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  /* ---- form tab ---- */
  const [activeTab, setActiveTab] = useState<
    "pickup" | "delivery" | "items" | "conditions"
  >("pickup");

  /* ---- form data ---- */
  const [pickup, setPickup] = useState<LocationData>(emptyLocation());
  const [delivery, setDelivery] = useState<LocationData>(emptyLocation());
  const [items, setItems] = useState<ItemRow[]>([emptyItem()]);
  const [conditions, setConditions] = useState<ConditionsData>({
    declaredValue: "",
    specialInstructions: "",
    termsAccepted: false,
  });

  /* ---- results ---- */
  const [rates, setRates] = useState<CarrierRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "fastest">("price");
  const [loading, setLoading] = useState(false);

  /* ---- shipper / consignee ---- */
  const [shipper, setShipper] = useState<ContactInfo>(emptyContact());
  const [consignee, setConsignee] = useState<ContactInfo>(emptyContact());
  const [poNumber, setPoNumber] = useState("");
  const [customerRef, setCustomerRef] = useState("");

  /* ---- confirmation ---- */
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);

  /* ---- FAQ ---- */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ---- newsletter ---- */
  const [email, setEmail] = useState("");

  /* ---------------------------------------------------------------- */
  /*  Computed values                                                   */
  /* ---------------------------------------------------------------- */

  const totalWeight = items.reduce((s, i) => s + (i.weight * i.qty || 0), 0);
  const totalDensity = items.reduce((s, i) => {
    const d = calcDensity(i);
    return s + d;
  }, 0);
  const suggestedClass =
    items.length > 0 ? suggestFreightClass(totalDensity / items.length) : "";

  const sortedRates = [...rates].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : a.transitDays - b.transitDays
  );

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */

  async function handleGetRates(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/gtz/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, delivery, items, conditions }),
      });
      const data = await res.json();
      if (data.success) {
        setRates(data.rates);
        setStep(2);
      }
    } catch {
      alert("Failed to fetch rates. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBookShipment(e: FormEvent) {
    e.preventDefault();
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
      if (data.success) {
        setBooking(data.booking);
        setStep(4);
      }
    } catch {
      alert("Failed to book shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function updateItem(index: number, field: keyof ItemRow, value: unknown) {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const density = calcDensity(updated[index]);
      updated[index].freightClass = suggestFreightClass(density);
      return updated;
    });
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Sub-components (inline)                                          */
  /* ---------------------------------------------------------------- */

  function ProgressSteps() {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
        {STEPS.map((label, i) => {
          const stepNum = (i + 1) as 1 | 2 | 3 | 4;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div key={label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-pl-green text-white"
                      : isCompleted
                        ? "bg-pl-green/20 text-pl-green"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`hidden sm:inline text-sm font-medium ${
                    isActive ? "text-pl-navy" : isCompleted ? "text-pl-green" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 ${
                    step > stepNum ? "bg-pl-green" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ---- Location form fields (reused for pickup & delivery) ---- */
  function LocationFields({
    data,
    onChange,
    labelPrefix,
  }: {
    data: LocationData;
    onChange: (d: LocationData) => void;
    labelPrefix: string;
  }) {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-pl-text mb-1">
            {labelPrefix} Date
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
            className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              Zip Code
            </label>
            <input
              type="text"
              value={data.zip}
              onChange={(e) => onChange({ ...data, zip: e.target.value })}
              placeholder="e.g. 33130"
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              City
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="e.g. Miami"
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              State
            </label>
            <select
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none bg-white"
            >
              <option value="">Select</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pl-text mb-2">
            Location Type
          </label>
          <div className="flex gap-3">
            {(["business", "residential"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...data, locationType: type })}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition ${
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

        <div>
          <label className="block text-sm font-medium text-pl-text mb-2">
            Accessorials
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "liftgate" as const, label: "Liftgate" },
              { key: "insidePickup" as const, label: "Inside Pickup" },
              { key: "appointmentRequired" as const, label: "Appointment Required" },
              { key: "limitedAccess" as const, label: "Limited Access" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={data[key]}
                  onChange={(e) =>
                    onChange({ ...data, [key]: e.target.checked })
                  }
                  className="w-4 h-4 text-pl-green border-pl-border rounded focus:ring-pl-green accent-pl-green"
                />
                <span className="text-sm text-pl-text">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- Contact form fields (reused for shipper & consignee) ---- */
  function ContactFields({
    data,
    onChange,
    title,
  }: {
    data: ContactInfo;
    onChange: (d: ContactInfo) => void;
    title: string;
  }) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-pl-navy">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              Company
            </label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => onChange({ ...data, company: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              Contact Name
            </label>
            <input
              type="text"
              value={data.contact}
              onChange={(e) => onChange({ ...data, contact: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ ...data, email: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-pl-text mb-1">
            Address Line 1
          </label>
          <input
            type="text"
            value={data.address1}
            onChange={(e) => onChange({ ...data, address1: e.target.value })}
            className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-pl-text mb-1">
            Address Line 2
          </label>
          <input
            type="text"
            value={data.address2}
            onChange={(e) => onChange({ ...data, address2: e.target.value })}
            className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              City
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              State
            </label>
            <select
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none bg-white"
            >
              <option value="">Select</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-pl-text mb-1">
              Zip Code
            </label>
            <input
              type="text"
              value={data.zip}
              onChange={(e) => onChange({ ...data, zip: e.target.value })}
              className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen">
        {/* ========== HERO SECTION ========== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-6">
            <span>Home</span>
            <span>/</span>
            <span className="text-pl-text">Let&apos;s Connect</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-pl-navy">Get a Freight Quote</span>{" "}
            <span className="text-pl-green">You Can Trust</span>
          </h1>
          <p className="text-pl-text text-base sm:text-lg max-w-2xl mb-10">
            Transparent pricing, fast response, and full visibility from pickup
            to delivery.
          </p>

          {/* Two-column hero layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* LEFT — Truck image */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-green-50 min-h-[280px] sm:min-h-[360px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pl-green/20 to-pl-green/5 flex items-center justify-center">
                <svg className="w-32 h-32 text-pl-green/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
            </div>

            {/* RIGHT — Rate preview card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light p-6 relative">
                <button className="absolute top-4 right-4 text-xs text-pl-green font-medium hover:underline">
                  Edit
                </button>

                <p className="text-sm text-pl-text mb-1">Rate Starting at</p>
                <p className="text-3xl font-bold text-pl-green mb-3">$266.44</p>

                <span className="inline-block bg-green-50 text-pl-green text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  Eligible for LTL Shipping
                </span>

                <p className="text-sm text-pl-text mb-4">
                  From <strong>Miami, FL 33130</strong> To{" "}
                  <strong>Florida, NY 10921</strong>
                </p>

                <div className="border-t border-pl-border-light pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipment Type</span>
                    <span className="font-medium text-pl-navy">LTL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Weight</span>
                    <span className="font-medium text-pl-navy">500 lbs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Freight Class</span>
                    <span className="font-medium text-pl-navy">500 lbs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={() => {
              const formSection = document.getElementById("quote-form");
              formSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-pl-green text-white font-semibold text-base px-10 py-3.5 rounded-full hover:bg-green-600 transition shadow-lg shadow-green-200"
          >
            GET INSTANT QUOTE
          </button>
          <p className="mt-3 text-sm text-gray-400">
            or{" "}
            <a href="#" className="text-gray-500 underline hover:text-pl-navy">
              contact us directly
            </a>
          </p>
        </section>

        {/* ========== QUOTE FORM AREA ========== */}
        <section
          id="quote-form"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          <ProgressSteps />

          {/* ===== STEP 1: FORM ===== */}
          {step === 1 && (
            <form
              onSubmit={handleGetRates}
              className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light overflow-hidden"
            >
              <div className="px-6 sm:px-8 py-6 border-b border-pl-border-light">
                <h2 className="text-xl sm:text-2xl font-bold text-pl-navy">
                  Get Your Best Rate
                </h2>
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-pl-border-light overflow-x-auto">
                {(
                  [
                    { id: "pickup", label: "PICKUP" },
                    { id: "delivery", label: "DELIVERY" },
                    { id: "items", label: "ITEMS" },
                    { id: "conditions", label: "CONDITIONS" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-semibold tracking-wide transition relative ${
                      activeTab === tab.id
                        ? "text-pl-green"
                        : "text-gray-400 hover:text-pl-text"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pl-green" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6 sm:p-8">
                <div
                  className={`border-l-4 ${
                    activeTab === "pickup" ? "border-pl-green" : "border-transparent"
                  } pl-6`}
                  style={{ display: activeTab === "pickup" ? "block" : "none" }}
                >
                  <LocationFields
                    data={pickup}
                    onChange={setPickup}
                    labelPrefix="Pickup"
                  />
                </div>

                <div
                  className={`border-l-4 ${
                    activeTab === "delivery" ? "border-pl-green" : "border-transparent"
                  } pl-6`}
                  style={{ display: activeTab === "delivery" ? "block" : "none" }}
                >
                  <LocationFields
                    data={delivery}
                    onChange={setDelivery}
                    labelPrefix="Delivery"
                  />
                </div>

                <div
                  className={`border-l-4 ${
                    activeTab === "items" ? "border-pl-green" : "border-transparent"
                  } pl-6`}
                  style={{ display: activeTab === "items" ? "block" : "none" }}
                >
                  <div className="space-y-6">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-4 sm:p-5 relative"
                      >
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}

                        <p className="text-sm font-semibold text-pl-navy mb-4">
                          Item {idx + 1}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              Qty
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) =>
                                updateItem(idx, "qty", parseInt(e.target.value) || 1)
                              }
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              Handling Unit
                            </label>
                            <select
                              value={item.handlingUnit}
                              onChange={(e) =>
                                updateItem(idx, "handlingUnit", e.target.value)
                              }
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none bg-white"
                            >
                              {HANDLING_UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              L (in)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={item.length || ""}
                              onChange={(e) =>
                                updateItem(idx, "length", parseFloat(e.target.value) || 0)
                              }
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              W (in)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={item.width || ""}
                              onChange={(e) =>
                                updateItem(idx, "width", parseFloat(e.target.value) || 0)
                              }
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              H (in)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={item.height || ""}
                              onChange={(e) =>
                                updateItem(idx, "height", parseFloat(e.target.value) || 0)
                              }
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              Weight (lbs)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={item.weight || ""}
                              onChange={(e) =>
                                updateItem(idx, "weight", parseFloat(e.target.value) || 0)
                              }
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-pl-text mb-1">
                              Freight Class
                            </label>
                            <input
                              type="text"
                              value={item.freightClass}
                              readOnly
                              placeholder="Auto"
                              className="w-full border border-pl-border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600 outline-none"
                            />
                          </div>
                          <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.hazmat}
                                onChange={(e) =>
                                  updateItem(idx, "hazmat", e.target.checked)
                                }
                                className="w-4 h-4 text-pl-green border-pl-border rounded focus:ring-pl-green accent-pl-green"
                              />
                              <span className="text-xs font-medium text-pl-text">
                                Hazmat
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addItem}
                      className="text-pl-green text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Item
                    </button>

                    {/* Summary */}
                    <div className="bg-green-50 rounded-lg p-4 flex flex-wrap gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Total Weight:</span>{" "}
                        <strong className="text-pl-navy">
                          {totalWeight.toLocaleString()} lbs
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Density:</span>{" "}
                        <strong className="text-pl-navy">
                          {(totalDensity / (items.length || 1)).toFixed(1)} pcf
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Suggested Freight Class:
                        </span>{" "}
                        <strong className="text-pl-navy">
                          {suggestedClass || "—"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-l-4 ${
                    activeTab === "conditions"
                      ? "border-pl-green"
                      : "border-transparent"
                  } pl-6`}
                  style={{
                    display: activeTab === "conditions" ? "block" : "none",
                  }}
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-pl-text mb-1">
                        Declared Value ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={conditions.declaredValue}
                        onChange={(e) =>
                          setConditions({
                            ...conditions,
                            declaredValue: e.target.value,
                          })
                        }
                        placeholder="e.g. 5000"
                        className="w-full max-w-xs border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pl-text mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        rows={4}
                        value={conditions.specialInstructions}
                        onChange={(e) =>
                          setConditions({
                            ...conditions,
                            specialInstructions: e.target.value,
                          })
                        }
                        placeholder="Any special handling requirements..."
                        className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conditions.termsAccepted}
                        onChange={(e) =>
                          setConditions({
                            ...conditions,
                            termsAccepted: e.target.checked,
                          })
                        }
                        className="w-4 h-4 mt-0.5 text-pl-green border-pl-border rounded focus:ring-pl-green accent-pl-green"
                      />
                      <span className="text-sm text-pl-text">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-pl-green underline hover:text-green-700"
                        >
                          Terms & Conditions
                        </a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="px-6 sm:px-8 py-6 border-t border-pl-border-light bg-gray-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-pl-green text-white font-semibold text-base px-10 py-3.5 rounded-full hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Getting Rates...
                    </span>
                  ) : (
                    "Get Carrier Rates"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ===== STEP 2: RESULTS ===== */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light overflow-hidden">
              <div className="px-6 sm:px-8 py-6 border-b border-pl-border-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-pl-green font-medium hover:underline mb-2 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Edit Quote
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold text-pl-navy">
                    Available Carrier Rates
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("price")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      sortBy === "price"
                        ? "bg-pl-green text-white border-pl-green"
                        : "bg-white text-pl-text border-pl-border hover:border-pl-green"
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    onClick={() => setSortBy("fastest")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      sortBy === "fastest"
                        ? "bg-pl-green text-white border-pl-green"
                        : "bg-white text-pl-text border-pl-border hover:border-pl-green"
                    }`}
                  >
                    Fastest
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                {sortedRates.map((rate) => (
                  <div
                    key={rate.id}
                    className={`border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:shadow-md ${
                      selectedRate?.id === rate.id
                        ? "border-pl-green bg-green-50"
                        : "border-pl-border-light"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h12M8 17l-4-4m4 4l-4 4M16 7H4m12 0l4-4m-4 4l4 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-pl-navy">
                          {rate.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {rate.serviceType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {rate.transitDays} days
                      </span>

                      <p className="text-2xl font-bold text-pl-green">
                        ${rate.price.toFixed(2)}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedRate(rate);
                          setStep(3);
                        }}
                        className="bg-pl-green text-white text-sm font-semibold px-6 py-2 rounded-full hover:bg-green-600 transition"
                      >
                        Select Rate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== STEP 3: SHIPPER / CONSIGNEE ===== */}
          {step === 3 && (
            <form
              onSubmit={handleBookShipment}
              className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light overflow-hidden"
            >
              <div className="px-6 sm:px-8 py-6 border-b border-pl-border-light">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm text-pl-green font-medium hover:underline mb-2 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Rates
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-pl-navy">
                  Booking Information
                </h2>
                {selectedRate && (
                  <p className="text-sm text-pl-text mt-1">
                    Selected: <strong>{selectedRate.name}</strong> —{" "}
                    <span className="text-pl-green font-semibold">
                      ${selectedRate.price.toFixed(2)}
                    </span>{" "}
                    ({selectedRate.transitDays} days)
                  </p>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <ContactFields
                    data={shipper}
                    onChange={setShipper}
                    title="Shipper Information"
                  />
                  <ContactFields
                    data={consignee}
                    onChange={setConsignee}
                    title="Consignee Information"
                  />
                </div>

                <div className="border-t border-pl-border-light mt-8 pt-8">
                  <h3 className="text-lg font-semibold text-pl-navy mb-4">
                    References
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium text-pl-text mb-1">
                        PO #
                      </label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-pl-text mb-1">
                        Customer Ref
                      </label>
                      <input
                        type="text"
                        value={customerRef}
                        onChange={(e) => setCustomerRef(e.target.value)}
                        className="w-full border border-pl-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-pl-green focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-6 border-t border-pl-border-light bg-gray-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-pl-green text-white font-semibold text-base px-10 py-3.5 rounded-full hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    "Confirm & Book"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ===== STEP 4: CONFIRMATION ===== */}
          {step === 4 && booking && (
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-pl-border-light p-8 sm:p-12 text-center max-w-2xl mx-auto">
              {/* Green checkmark */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-pl-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-pl-navy mb-4">
                Booking Confirmed!
              </h2>
              <p className="text-pl-text mb-8">
                Your shipment has been booked successfully. Below are your
                reference numbers.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
                <div className="bg-gray-50 rounded-xl p-5 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    BOL Number
                  </p>
                  <p className="text-lg font-bold text-pl-navy">
                    {booking.bolNumber}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    PRO Number
                  </p>
                  <p className="text-lg font-bold text-pl-navy">
                    {booking.proNumber}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button className="bg-pl-green text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-green-600 transition">
                  Download BOL
                </button>
                <button className="bg-pl-navy text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition">
                  Track Shipment
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setPickup(emptyLocation());
                    setDelivery(emptyLocation());
                    setItems([emptyItem()]);
                    setConditions({
                      declaredValue: "",
                      specialInstructions: "",
                      termsAccepted: false,
                    });
                    setRates([]);
                    setSelectedRate(null);
                    setShipper(emptyContact());
                    setConsignee(emptyContact());
                    setPoNumber("");
                    setCustomerRef("");
                    setBooking(null);
                    setActiveTab("pickup");
                  }}
                  className="border border-pl-border text-pl-text font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-50 transition"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ========== FAQ SECTION ========== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-pl-navy mb-8">
            Frequently Asked Questions
          </h2>

          <div className="border-t border-pl-border-light">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="border-b border-pl-border-light">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="text-base font-medium text-pl-navy pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full border border-pl-border flex items-center justify-center transition-transform ${
                      openFaq === i ? "rotate-45 bg-pl-green border-pl-green" : ""
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${openFaq === i ? "text-white" : "text-pl-text"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="pb-5 pr-12">
                    <p className="text-sm text-pl-text leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* "Didn't find your answer?" card */}
          <div className="mt-10 relative overflow-hidden bg-green-50 rounded-2xl p-8 sm:p-10">
            {/* Green wave decoration */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full text-pl-green/10"
              viewBox="0 0 1440 120"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
            </svg>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-pl-navy mb-2">
                Didn&apos;t find your answer?
              </h3>
              <p className="text-sm text-pl-text mb-5">
                Our team is here to help. Reach out and we&apos;ll get back to
                you as soon as possible.
              </p>
              <a
                href="#"
                className="inline-block bg-pl-navy text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
              >
                Contact us
              </a>
            </div>
          </div>
        </section>

        {/* ========== STAY UPDATED CTA ========== */}
        <section className="relative bg-pl-navy overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-pl-navy via-pl-navy/95 to-pl-navy/80" />
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="truck-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#00c950" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#truck-pattern)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Stay Updated
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Get the latest industry news, shipping tips, and exclusive offers
              delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-pl-green"
              />
              <button
                type="button"
                className="bg-pl-green text-white font-semibold text-sm px-8 py-3 rounded-full hover:bg-green-600 transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
