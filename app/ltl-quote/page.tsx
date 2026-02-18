"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

/* ─── TYPES ─── */

interface AddressInfo {
  pickupDate: string;
  zipCode: string;
  city: string;
  state: string;
  locationType: "business" | "residential";
  liftgate: boolean;
  insidePickup: boolean;
  appointmentRequired: boolean;
  limitedAccess: boolean;
}

interface ItemRow {
  id: string;
  qty: number;
  handlingUnit: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  freightClass: string;
  hazmat: boolean;
}

interface Conditions {
  declaredValue: string;
  specialInstructions: string;
  termsAccepted: boolean;
}

interface Rate {
  id: string;
  carrier: string;
  transitDays: number;
  price: number;
  serviceType: string;
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

interface BookingResult {
  bolNumber: string;
  proNumber: string;
}

/* ─── CONSTANTS ─── */

const HANDLING_UNITS = [
  "Pallet","Box","Bag","Bale","Bundle","Carton","Case","Crate",
  "Cylinder","Drum","Gallon","Pieces","Reel","Roll","Skid","Totes","Tube","Other",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const FAQ_DATA = [
  { q: "How long does it take to receive a quote?", a: "Most quotes are returned instantly. Our automated system connects with multiple carriers in real-time to provide you with competitive rates within seconds of submitting your shipment details." },
  { q: "What information do I need to request a quote?", a: "You'll need pickup and delivery zip codes, shipment dimensions (length, width, height), weight, freight class, and any special requirements like liftgate service or inside delivery." },
  { q: "Is requesting a quote free?", a: "Yes, requesting a quote is completely free with no obligation. You can compare rates from multiple carriers before making a decision." },
  { q: "Will the quoted price change later?", a: "Quoted prices are valid for the date provided. Prices may change if shipment details differ from what was quoted, such as weight, dimensions, or accessorial services needed." },
  { q: "What happens after I submit a quote request?", a: "After submitting, you'll instantly receive carrier rates. Select your preferred carrier, enter shipper and consignee details, and confirm your booking. You'll receive a BOL number immediately." },
];

const FORM_TABS = ["PICKUP", "DELIVERY", "ITEMS", "CONDITIONS"] as const;
type FormTab = (typeof FORM_TABS)[number];

/* ─── HELPERS ─── */

function emptyAddress(): AddressInfo {
  return {
    pickupDate: "",
    zipCode: "",
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
    id: Math.random().toString(36).substring(2, 9),
    qty: 1,
    handlingUnit: "Pallet",
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    freightClass: "Auto",
    hazmat: false,
  };
}

function emptyContact(): ContactInfo {
  return { company: "", contact: "", phone: "", email: "", address1: "", address2: "", city: "", state: "", zip: "" };
}

function calcFreightClass(weight: number, l: number, w: number, h: number): string {
  if (!weight || !l || !w || !h) return "Auto";
  const cubicInches = l * w * h;
  const cubicFeet = cubicInches / 1728;
  if (cubicFeet === 0) return "Auto";
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

/* ─── PAGE COMPONENT ─── */

export default function LtlQuotePage() {
  // Multi-step: 1=form, 2=results, 3=shipper/consignee, 4=confirmation
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<FormTab>("PICKUP");

  // Form state
  const [pickup, setPickup] = useState<AddressInfo>(emptyAddress());
  const [delivery, setDelivery] = useState<AddressInfo>(emptyAddress());
  const [items, setItems] = useState<ItemRow[]>([emptyItem()]);
  const [conditions, setConditions] = useState<Conditions>({
    declaredValue: "",
    specialInstructions: "",
    termsAccepted: false,
  });

  // Results state
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "transit">("price");
  const [loading, setLoading] = useState(false);

  // Shipper/Consignee
  const [shipper, setShipper] = useState<ContactInfo>(emptyContact());
  const [consignee, setConsignee] = useState<ContactInfo>(emptyContact());
  const [poNumber, setPoNumber] = useState("");
  const [customerRef, setCustomerRef] = useState("");

  // Confirmation
  const [booking, setBooking] = useState<BookingResult | null>(null);

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ─── HANDLERS ─── */

  const totalWeight = items.reduce((s, i) => s + i.weight * i.qty, 0);
  const totalDensity = (() => {
    const totalCubicFeet = items.reduce((s, i) => {
      const cf = (i.length * i.width * i.height) / 1728;
      return s + cf * i.qty;
    }, 0);
    return totalCubicFeet > 0 ? (totalWeight / totalCubicFeet).toFixed(1) : "0";
  })();

  const updateItem = useCallback((id: string, patch: Partial<ItemRow>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...patch };
        updated.freightClass = calcFreightClass(updated.weight, updated.length, updated.width, updated.height);
        return updated;
      })
    );
  }, []);

  const handleGetRates = async () => {
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
      // handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRate = (rate: Rate) => {
    setSelectedRate(rate);
    setStep(3);
  };

  const handleBookShipment = async () => {
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
      // handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setActiveTab("PICKUP");
    setPickup(emptyAddress());
    setDelivery(emptyAddress());
    setItems([emptyItem()]);
    setConditions({ declaredValue: "", specialInstructions: "", termsAccepted: false });
    setRates([]);
    setSelectedRate(null);
    setShipper(emptyContact());
    setConsignee(emptyContact());
    setPoNumber("");
    setCustomerRef("");
    setBooking(null);
  };

  const sortedRates = [...rates].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : a.transitDays - b.transitDays
  );

  /* ─── SUB-COMPONENTS (inline) ─── */

  const StepIndicator = () => (
    <div className="mx-auto mb-10 flex max-w-lg items-center justify-between">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                step >= s ? "bg-pl-green text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              ) : (
                s
              )}
            </div>
            <span className="mt-1 text-xs text-pl-text hidden sm:block">
              {["Quote", "Rates", "Details", "Confirm"][s - 1]}
            </span>
          </div>
          {s < 4 && (
            <div className={`mx-2 h-0.5 w-8 sm:w-16 ${step > s ? "bg-pl-green" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );

  /* ─── ADDRESS FORM FIELDS ─── */
  const AddressFields = ({
    data,
    onChange,
    label,
  }: {
    data: AddressInfo;
    onChange: (d: AddressInfo) => void;
    label: "Pickup" | "Delivery";
  }) => (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-pl-text">{label} Date</label>
        <input
          type="date"
          value={data.pickupDate}
          onChange={(e) => onChange({ ...data, pickupDate: e.target.value })}
          className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-pl-text">Zip Code</label>
          <input
            type="text"
            value={data.zipCode}
            onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
            placeholder="e.g. 33130"
            className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-pl-text">City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="City"
            className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-pl-text">State</label>
          <select
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
          >
            <option value="">Select</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-pl-text">Location Type</label>
        <div className="flex gap-2">
          {(["business", "residential"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...data, locationType: type })}
              className={`rounded-lg border px-5 py-2 text-sm font-medium capitalize transition ${
                data.locationType === type
                  ? "border-pl-green bg-pl-green/10 text-pl-green"
                  : "border-pl-border text-pl-text hover:border-gray-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-pl-text">Accessorials</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {([
            ["liftgate", "Liftgate"],
            ["insidePickup", label === "Pickup" ? "Inside Pickup" : "Inside Delivery"],
            ["appointmentRequired", "Appointment Required"],
            ["limitedAccess", "Limited Access"],
          ] as const).map(([key, lbl]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-pl-text cursor-pointer">
              <input
                type="checkbox"
                checked={data[key as keyof AddressInfo] as boolean}
                onChange={(e) => onChange({ ...data, [key]: e.target.checked })}
                className="h-4 w-4 rounded border-pl-border text-pl-green accent-pl-green"
              />
              {lbl}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── CONTACT FORM ─── */
  const ContactForm = ({
    data,
    onChange,
    title,
  }: {
    data: ContactInfo;
    onChange: (d: ContactInfo) => void;
    title: string;
  }) => (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-pl-navy">{title}</h3>
      <div className="space-y-3">
        {([
          ["company", "Company Name"],
          ["contact", "Contact Name"],
          ["phone", "Phone"],
          ["email", "Email"],
          ["address1", "Address Line 1"],
          ["address2", "Address Line 2"],
        ] as const).map(([key, lbl]) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium text-pl-text">{lbl}</label>
            <input
              type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
              value={data[key]}
              onChange={(e) => onChange({ ...data, [key]: e.target.value })}
              className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
            />
          </div>
        ))}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-pl-text">City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-pl-text">State</label>
            <select
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
            >
              <option value="">Select</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-pl-text">Zip</label>
            <input
              type="text"
              value={data.zip}
              onChange={(e) => onChange({ ...data, zip: e.target.value })}
              className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
            />
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── RENDER ─── */

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* ═══ HERO SECTION ═══ */}
        <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-pl-navy transition">Home</Link>
            <span>/</span>
            <span className="text-gray-500">Let&apos;s Connect</span>
          </nav>

          {/* Heading */}
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="text-pl-navy">Get a Freight Quote</span>{" "}
            <span className="text-pl-green">You Can Trust</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-pl-text lg:text-lg">
            Transparent pricing, fast response, and full visibility from pickup to delivery.
          </p>

          {/* Two-column: image + rate card */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left: Truck image */}
            <div className="relative overflow-hidden rounded-xl lg:col-span-3">
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center rounded-xl">
                <Image
                  src="/images/trucks.jpg"
                  alt="Fleet of green freight trucks"
                  fill
                  className="object-cover rounded-xl"
                  priority
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
                <div className="relative z-10 text-center text-white p-8">
                  <svg className="mx-auto h-16 w-16 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M12 17h.01M16 17h.01M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <p className="mt-2 text-lg font-semibold opacity-90">Portlandia Logistics Fleet</p>
                </div>
              </div>
            </div>

            {/* Right: Rate card */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-pl-border-light bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Rate Starting at</p>
                    <p className="mt-1 text-4xl font-bold text-pl-green">$266.44</p>
                  </div>
                  <button className="text-xs font-medium text-pl-green hover:underline">Edit</button>
                </div>

                <div className="mt-4 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-pl-green">
                  <svg className="mr-1 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Eligible for LTL Shipping
                </div>

                <p className="mt-4 text-sm text-pl-text">
                  From <span className="font-semibold text-black">Miami, FL 33130</span>
                  <br />
                  To <span className="font-semibold text-black">Florida, NY 10921</span>
                </p>

                <div className="mt-4 space-y-2 border-t border-pl-border-light pt-4">
                  {[
                    ["Shipment Type", "LTL"],
                    ["Total Weight", "500 lbs"],
                    ["Freight Class", "500 lbs"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-black">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById("quote-form");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-6 w-full rounded-full bg-pl-green py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
                >
                  Get Instant Quote
                </button>
                <p className="mt-3 text-center text-xs text-gray-400">
                  or{" "}
                  <Link href="#" className="text-gray-500 underline hover:text-pl-navy">
                    contact us directly
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ QUOTE FORM / RESULTS / SHIPPER / CONFIRMATION ═══ */}
        <section id="quote-form" className="mx-auto max-w-7xl px-6 py-12">
          <StepIndicator />

          {/* ─── STEP 1: FORM ─── */}
          {step === 1 && (
            <div className="mx-auto max-w-4xl rounded-xl border border-pl-border-light bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-pl-navy">Get Your Best Rate</h2>

              {/* Tabs */}
              <div className="mb-6 flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
                {FORM_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === tab
                        ? "bg-white text-pl-green shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content with green left border */}
              <div className="border-l-4 border-pl-green pl-6">
                {/* PICKUP */}
                {activeTab === "PICKUP" && (
                  <AddressFields data={pickup} onChange={setPickup} label="Pickup" />
                )}

                {/* DELIVERY */}
                {activeTab === "DELIVERY" && (
                  <AddressFields data={delivery} onChange={setDelivery} label="Delivery" />
                )}

                {/* ITEMS */}
                {activeTab === "ITEMS" && (
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={item.id} className="rounded-lg border border-pl-border-light p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-pl-navy">Item {idx + 1}</span>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-pl-text">Qty</label>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, { qty: parseInt(e.target.value) || 1 })}
                              className="w-full rounded-lg border border-pl-border px-3 py-2 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="mb-1 block text-xs font-medium text-pl-text">Handling Unit</label>
                            <select
                              value={item.handlingUnit}
                              onChange={(e) => updateItem(item.id, { handlingUnit: e.target.value })}
                              className="w-full rounded-lg border border-pl-border px-3 py-2 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                            >
                              {HANDLING_UNITS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-pl-text">L (in)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.length || ""}
                              onChange={(e) => updateItem(item.id, { length: parseFloat(e.target.value) || 0 })}
                              className="w-full rounded-lg border border-pl-border px-3 py-2 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-pl-text">W (in)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.width || ""}
                              onChange={(e) => updateItem(item.id, { width: parseFloat(e.target.value) || 0 })}
                              className="w-full rounded-lg border border-pl-border px-3 py-2 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-pl-text">H (in)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.height || ""}
                              onChange={(e) => updateItem(item.id, { height: parseFloat(e.target.value) || 0 })}
                              className="w-full rounded-lg border border-pl-border px-3 py-2 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-pl-text">Weight (lbs)</label>
                            <input
                              type="number"
                              min={0}
                              value={item.weight || ""}
                              onChange={(e) => updateItem(item.id, { weight: parseFloat(e.target.value) || 0 })}
                              className="w-full rounded-lg border border-pl-border px-3 py-2 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-pl-text">Class</label>
                            <input
                              type="text"
                              value={item.freightClass}
                              readOnly
                              className="w-full rounded-lg border border-pl-border-light bg-gray-50 px-3 py-2 text-sm text-gray-500"
                            />
                          </div>
                          <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 text-xs text-pl-text cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.hazmat}
                                onChange={(e) => updateItem(item.id, { hazmat: e.target.checked })}
                                className="h-4 w-4 rounded border-pl-border text-pl-green accent-pl-green"
                              />
                              Hazmat
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setItems((prev) => [...prev, emptyItem()])}
                      className="text-sm font-semibold text-pl-green hover:underline"
                    >
                      + Add Item
                    </button>

                    {/* Totals */}
                    <div className="mt-4 flex flex-wrap gap-6 rounded-lg bg-gray-50 p-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Weight:</span>{" "}
                        <span className="font-semibold text-black">{totalWeight} lbs</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Density:</span>{" "}
                        <span className="font-semibold text-black">{totalDensity} PCF</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONDITIONS */}
                {activeTab === "CONDITIONS" && (
                  <div className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-pl-text">Declared Value ($)</label>
                      <input
                        type="text"
                        value={conditions.declaredValue}
                        onChange={(e) => setConditions({ ...conditions, declaredValue: e.target.value })}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green sm:max-w-xs"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-pl-text">Special Instructions</label>
                      <textarea
                        value={conditions.specialInstructions}
                        onChange={(e) => setConditions({ ...conditions, specialInstructions: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                        placeholder="Any special handling or delivery instructions..."
                      />
                    </div>
                    <label className="flex items-start gap-2 text-sm text-pl-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conditions.termsAccepted}
                        onChange={(e) => setConditions({ ...conditions, termsAccepted: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-pl-border text-pl-green accent-pl-green"
                      />
                      <span>
                        I agree to the{" "}
                        <a href="#" className="text-pl-green underline">Terms & Conditions</a>{" "}
                        and acknowledge the shipment details provided are accurate.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Navigation & Submit */}
              <div className="mt-8 flex items-center justify-between">
                <div>
                  {activeTab !== "PICKUP" && (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = FORM_TABS.indexOf(activeTab);
                        if (idx > 0) setActiveTab(FORM_TABS[idx - 1]);
                      }}
                      className="rounded-lg border border-pl-border px-6 py-2.5 text-sm font-medium text-pl-text transition hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}
                </div>
                <div>
                  {activeTab !== "CONDITIONS" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const idx = FORM_TABS.indexOf(activeTab);
                        if (idx < FORM_TABS.length - 1) setActiveTab(FORM_TABS[idx + 1]);
                      }}
                      className="rounded-lg bg-pl-green px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGetRates}
                      disabled={loading}
                      className="rounded-lg bg-pl-green px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
                    >
                      {loading ? "Getting Rates..." : "Get Carrier Rates"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: RATE RESULTS ─── */}
          {step === 2 && (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm font-medium text-pl-green hover:underline"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Edit Quote
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("price")}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      sortBy === "price"
                        ? "border-pl-green bg-pl-green/10 text-pl-green"
                        : "border-pl-border text-pl-text hover:border-gray-400"
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    onClick={() => setSortBy("transit")}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      sortBy === "transit"
                        ? "border-pl-green bg-pl-green/10 text-pl-green"
                        : "border-pl-border text-pl-text hover:border-gray-400"
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
                    className="flex flex-col items-start justify-between gap-4 rounded-xl border border-pl-border-light bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-pl-navy">{rate.carrier}</h3>
                      <p className="text-sm text-gray-500">{rate.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {rate.transitDays} {rate.transitDays === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-pl-green">${rate.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleSelectRate(rate)}
                      className="rounded-lg bg-pl-green px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                    >
                      Select Rate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 3: SHIPPER / CONSIGNEE ─── */}
          {step === 3 && (
            <div className="mx-auto max-w-4xl rounded-xl border border-pl-border-light bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] sm:p-8">
              <button
                onClick={() => setStep(2)}
                className="mb-6 flex items-center gap-1 text-sm font-medium text-pl-green hover:underline"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Rates
              </button>

              {selectedRate && (
                <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-green-50 p-4">
                  <span className="text-sm font-semibold text-pl-navy">{selectedRate.carrier}</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                    {selectedRate.transitDays} days
                  </span>
                  <span className="text-lg font-bold text-pl-green">${selectedRate.price.toFixed(2)}</span>
                </div>
              )}

              <div className="grid gap-8 md:grid-cols-2">
                <ContactForm data={shipper} onChange={setShipper} title="Shipper Information" />
                <ContactForm data={consignee} onChange={setConsignee} title="Consignee Information" />
              </div>

              <div className="mt-8 border-t border-pl-border-light pt-6">
                <h3 className="mb-4 text-lg font-semibold text-pl-navy">References</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pl-text">PO #</label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pl-text">Customer Ref</label>
                    <input
                      type="text"
                      value={customerRef}
                      onChange={(e) => setCustomerRef(e.target.value)}
                      className="w-full rounded-lg border border-pl-border px-4 py-2.5 text-sm outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleBookShipment}
                  disabled={loading}
                  className="rounded-lg bg-pl-green px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? "Booking..." : "Confirm & Book"}
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: CONFIRMATION ─── */}
          {step === 4 && booking && (
            <div className="mx-auto max-w-lg text-center">
              <div className="rounded-xl border border-pl-border-light bg-white p-10 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                {/* Green checkmark */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <svg className="h-10 w-10 text-pl-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-pl-navy">Booking Confirmed!</h2>
                <p className="mt-2 text-sm text-pl-text">Your shipment has been booked successfully.</p>

                <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">BOL Number</span>
                    <span className="font-bold text-pl-navy">{booking.bolNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">PRO Number</span>
                    <span className="font-bold text-pl-navy">{booking.proNumber}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button className="rounded-lg border border-pl-green px-5 py-2.5 text-sm font-semibold text-pl-green transition hover:bg-green-50">
                    Download BOL
                  </button>
                  <button className="rounded-lg border border-pl-green px-5 py-2.5 text-sm font-semibold text-pl-green transition hover:bg-green-50">
                    Track Shipment
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-lg bg-pl-green px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ FAQs SECTION ═══ */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-pl-navy">Frequently Asked Questions</h2>

          <div className="mx-auto max-w-3xl divide-y divide-pl-border-light">
            {FAQ_DATA.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="pr-4 text-base font-medium text-pl-navy">{faq.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pl-border text-gray-400 transition-transform">
                    <svg
                      className={`h-4 w-4 transition-transform ${openFaq === i ? "rotate-45" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="pb-5 pr-12 text-sm leading-relaxed text-pl-text">{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* "Didn't find your answer?" card */}
          <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl bg-pl-navy p-8 text-center">
            {/* Green wave decoration */}
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
              <path d="M0 120V60C240 20 480 0 720 20C960 40 1200 80 1440 60V120H0Z" fill="#00c950" fillOpacity="0.15" />
              <path d="M0 120V80C240 40 480 20 720 40C960 60 1200 100 1440 80V120H0Z" fill="#00c950" fillOpacity="0.1" />
            </svg>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white">Didn&apos;t find your answer?</h3>
              <p className="mt-2 text-sm text-gray-400">
                Our team is ready to help with any questions about freight shipping.
              </p>
              <Link
                href="#"
                className="mt-5 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-pl-navy transition hover:bg-gray-100"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ STAY UPDATED CTA ═══ */}
        <section className="relative overflow-hidden bg-pl-navy">
          <div className="absolute inset-0 bg-gradient-to-r from-pl-navy/95 to-pl-navy/80">
            <Image
              src="/images/trucks.jpg"
              alt=""
              fill
              className="object-cover opacity-20 mix-blend-overlay"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Stay Updated</h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-gray-400">
              Get the latest freight industry news, shipping tips, and exclusive rate
              offers delivered straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-pl-green focus:ring-1 focus:ring-pl-green"
              />
              <button
                type="submit"
                className="rounded-lg bg-pl-green px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
