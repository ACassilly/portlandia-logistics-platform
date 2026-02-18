"use client";

import { useState, useCallback } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

/* ─── Types ─── */

interface LocationData {
  date: string;
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

/* ─── Constants ─── */

const HANDLING_UNITS = [
  "Pallet", "Box", "Bag", "Bale", "Bundle", "Carton", "Case",
  "Crate", "Cylinder", "Drum", "Gallon", "Pieces", "Reel",
  "Roll", "Skid", "Totes", "Tube", "Other",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY",
];

const FAQS = [
  { q: "How long does it take to receive a quote?", a: "Our system provides instant carrier rates. Once you fill in your shipment details, you'll receive competitive quotes from multiple carriers within seconds." },
  { q: "What information do I need to request a quote?", a: "You'll need pickup and delivery zip codes, shipment dimensions and weight, freight class, and any special requirements like liftgate or inside delivery." },
  { q: "Is requesting a quote free?", a: "Yes, requesting a quote is completely free with no obligation. You can compare rates from multiple carriers before making a decision." },
  { q: "Will the quoted price change later?", a: "Quoted prices are valid for 24 hours. Actual charges may vary if shipment details (weight, dimensions, freight class) differ from the quote." },
  { q: "What happens after I submit a quote request?", a: "After selecting a rate, you'll fill in shipper and consignee details, then confirm your booking. You'll receive a BOL number and tracking information immediately." },
];

function defaultLocation(): LocationData {
  return {
    date: "",
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

function defaultItem(): ItemRow {
  return {
    id: crypto.randomUUID(),
    qty: 1,
    handlingUnit: "Pallet",
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    freightClass: "—",
    hazmat: false,
  };
}

function defaultContact(): ContactInfo {
  return { company: "", contact: "", phone: "", email: "", address1: "", address2: "", city: "", state: "", zip: "" };
}

function calcFreightClass(weight: number, l: number, w: number, h: number): string {
  if (!weight || !l || !w || !h) return "—";
  const cubicFt = (l * w * h) / 1728;
  if (cubicFt === 0) return "—";
  const density = weight / cubicFt;
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

/* ─── Sub-components ─── */

function ProgressSteps({ current }: { current: number }) {
  const steps = ["Quote Details", "Carrier Rates", "Booking Info", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : isDone
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium hidden sm:inline ${isActive ? "text-dark-navy" : isDone ? "text-primary" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 ${isDone ? "bg-primary/30" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-dark-navy text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-border-lighter">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="text-base font-medium text-dark-navy pr-4">{faq.q}</span>
                <span className="shrink-0 w-8 h-8 rounded-full border border-border-light flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-colors">
                  <svg
                    className={`w-4 h-4 transition-transform ${openIdx === i ? "rotate-45" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              {openIdx === i && (
                <div className="pb-5 pr-12 text-sm text-text-body leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 relative overflow-hidden rounded-xl bg-dark-navy p-8 sm:p-10">
          <svg className="absolute -bottom-4 -right-4 w-40 h-40 text-primary/20" viewBox="0 0 200 200" fill="currentColor">
            <path d="M0 100c0 55.228 44.772 100 100 100s100-44.772 100-100c0-20-10-60-50-80S50 0 0 40v60z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">Didn&apos;t find your answer?</h3>
          <p className="text-gray-400 text-sm mb-6 relative z-10">
            Our logistics experts are ready to help with any questions about your freight shipment.
          </p>
          <button className="relative z-10 bg-white text-dark-navy font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}

function StayUpdatedSection() {
  const [email, setEmail] = useState("");
  return (
    <section className="relative bg-dark-navy overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-primary/30 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Get the latest industry news, shipping tips, and exclusive rates delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function LTLQuotePage() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery" | "items" | "conditions">("pickup");

  // Step 1: Form data
  const [pickup, setPickup] = useState<LocationData>(defaultLocation());
  const [delivery, setDelivery] = useState<LocationData>(defaultLocation());
  const [items, setItems] = useState<ItemRow[]>([defaultItem()]);
  const [conditions, setConditions] = useState<ConditionsData>({
    declaredValue: "",
    specialInstructions: "",
    termsAccepted: false,
  });

  // Step 2: Carrier rates
  const [rates, setRates] = useState<CarrierRate[]>([]);
  const [rateSort, setRateSort] = useState<"price" | "transit">("price");
  const [loadingRates, setLoadingRates] = useState(false);

  // Step 3: Shipper/Consignee
  const [shipper, setShipper] = useState<ContactInfo>(defaultContact());
  const [consignee, setConsignee] = useState<ContactInfo>(defaultContact());
  const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null);
  const [poNumber, setPoNumber] = useState("");
  const [customerRef, setCustomerRef] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Step 4: Confirmation
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  /* ─── Handlers ─── */

  const totalWeight = items.reduce((s, it) => s + (it.weight * it.qty), 0);
  const totalDensity = items.reduce((s, it) => {
    const vol = (it.length * it.width * it.height) / 1728;
    return s + (vol > 0 ? it.weight / vol : 0);
  }, 0) / (items.length || 1);

  const updateItem = useCallback((id: string, field: string, value: unknown) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        updated.freightClass = calcFreightClass(updated.weight, updated.length, updated.width, updated.height);
        return updated;
      })
    );
  }, []);

  const addItem = () => setItems((prev) => [...prev, defaultItem()]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const fetchRates = async () => {
    setLoadingRates(true);
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
      setLoadingRates(false);
    }
  };

  const selectRate = (rate: CarrierRate) => {
    setSelectedRate(rate);
    setStep(3);
  };

  const bookShipment = async () => {
    setBookingLoading(true);
    try {
      const res = await fetch("/api/gtz/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipper, consignee, selectedRate, pickup, delivery, items, poNumber, customerRef }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmation(data.booking);
        setStep(4);
      }
    } catch {
      alert("Failed to book shipment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setActiveTab("pickup");
    setPickup(defaultLocation());
    setDelivery(defaultLocation());
    setItems([defaultItem()]);
    setConditions({ declaredValue: "", specialInstructions: "", termsAccepted: false });
    setRates([]);
    setSelectedRate(null);
    setShipper(defaultContact());
    setConsignee(defaultContact());
    setPoNumber("");
    setCustomerRef("");
    setConfirmation(null);
  };

  const sortedRates = [...rates].sort((a, b) =>
    rateSort === "price" ? a.price - b.price : a.transitDays - b.transitDays
  );

  /* ─── Render helpers ─── */

  const inputClass =
    "w-full px-3 py-2.5 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors bg-white";
  const labelClass = "block text-xs font-medium text-text-body mb-1.5";

  function renderLocationForm(data: LocationData, setter: React.Dispatch<React.SetStateAction<LocationData>>, label: string) {
    const update = (field: keyof LocationData, value: unknown) => setter((prev) => ({ ...prev, [field]: value }));
    return (
      <div className="space-y-5">
        <div>
          <label className={labelClass}>{label} Date</label>
          <input type="date" value={data.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Zip Code</label>
            <input type="text" value={data.zipCode} onChange={(e) => update("zipCode", e.target.value)} placeholder="e.g. 33130" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input type="text" value={data.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. Miami" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select value={data.state} onChange={(e) => update("state", e.target.value)} className={inputClass}>
              <option value="">Select</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Location Type</label>
          <div className="flex gap-2">
            {(["business", "residential"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("locationType", t)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                  data.locationType === t
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border-light text-text-body hover:border-gray-300"
                }`}
              >
                {t === "business" ? "Business" : "Residential"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Accessorials</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "liftgate" as const, label: "Liftgate" },
              { key: "insidePickup" as const, label: "Inside Pickup" },
              { key: "appointmentRequired" as const, label: "Appointment Required" },
              { key: "limitedAccess" as const, label: "Limited Access" },
            ].map(({ key, label: lbl }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                <input
                  type="checkbox"
                  checked={data[key] as boolean}
                  onChange={(e) => update(key, e.target.checked)}
                  className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderItemsForm() {
    return (
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id} className="p-4 border border-border-lighter rounded-lg bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-dark-navy">Item {idx + 1}</span>
              {items.length > 1 && (
                <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Qty</label>
                <input type="number" min={1} value={item.qty} onChange={(e) => updateItem(item.id, "qty", +e.target.value)} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Handling Unit</label>
                <select value={item.handlingUnit} onChange={(e) => updateItem(item.id, "handlingUnit", e.target.value)} className={inputClass}>
                  {HANDLING_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Dimensions (L × W × H in)</label>
                <div className="flex gap-2">
                  <input type="number" min={0} placeholder="L" value={item.length || ""} onChange={(e) => updateItem(item.id, "length", +e.target.value)} className={inputClass} />
                  <span className="self-center text-gray-400">×</span>
                  <input type="number" min={0} placeholder="W" value={item.width || ""} onChange={(e) => updateItem(item.id, "width", +e.target.value)} className={inputClass} />
                  <span className="self-center text-gray-400">×</span>
                  <input type="number" min={0} placeholder="H" value={item.height || ""} onChange={(e) => updateItem(item.id, "height", +e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Weight (lbs)</label>
                <input type="number" min={0} value={item.weight || ""} onChange={(e) => updateItem(item.id, "weight", +e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Freight Class</label>
                <div className="px-3 py-2.5 border border-border-light rounded-lg text-sm bg-gray-100 text-text-body">
                  {item.freightClass}
                </div>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.hazmat}
                    onChange={(e) => updateItem(item.id, "hazmat", e.target.checked)}
                    className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                  Hazmat
                </label>
              </div>
            </div>
          </div>
        ))}

        <button onClick={addItem} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Item
        </button>

        <div className="mt-4 p-4 bg-primary/5 rounded-lg grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-text-body">Total Weight</span>
            <p className="font-semibold text-dark-navy">{totalWeight.toLocaleString()} lbs</p>
          </div>
          <div>
            <span className="text-text-body">Avg Density</span>
            <p className="font-semibold text-dark-navy">{totalDensity.toFixed(1)} PCF</p>
          </div>
          <div>
            <span className="text-text-body">Items</span>
            <p className="font-semibold text-dark-navy">{items.length}</p>
          </div>
        </div>
      </div>
    );
  }

  function renderConditionsForm() {
    return (
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Declared Value ($)</label>
          <input
            type="text"
            value={conditions.declaredValue}
            onChange={(e) => setConditions((p) => ({ ...p, declaredValue: e.target.value }))}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Special Instructions</label>
          <textarea
            value={conditions.specialInstructions}
            onChange={(e) => setConditions((p) => ({ ...p, specialInstructions: e.target.value }))}
            placeholder="Any special handling requirements..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={conditions.termsAccepted}
            onChange={(e) => setConditions((p) => ({ ...p, termsAccepted: e.target.checked }))}
            className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary mt-0.5"
          />
          <span className="text-sm text-text-body">
            I agree to the <a href="#" className="text-primary underline">Terms &amp; Conditions</a> and understand that quoted rates are subject to verification of shipment details.
          </span>
        </label>
      </div>
    );
  }

  function renderContactForm(data: ContactInfo, setter: React.Dispatch<React.SetStateAction<ContactInfo>>, title: string) {
    const update = (field: keyof ContactInfo, value: string) => setter((prev) => ({ ...prev, [field]: value }));
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark-navy">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company</label>
            <input type="text" value={data.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Name</label>
            <input type="text" value={data.contact} onChange={(e) => update("contact", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Address Line 1</label>
          <input type="text" value={data.address1} onChange={(e) => update("address1", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Address Line 2</label>
          <input type="text" value={data.address2} onChange={(e) => update("address2", e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input type="text" value={data.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select value={data.state} onChange={(e) => update("state", e.target.value)} className={inputClass}>
              <option value="">Select</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Zip Code</label>
            <input type="text" value={data.zip} onChange={(e) => update("zip", e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>
    );
  }

  /* ─── Page sections ─── */

  const TABS = [
    { key: "pickup" as const, label: "PICKUP" },
    { key: "delivery" as const, label: "DELIVERY" },
    { key: "items" as const, label: "ITEMS" },
    { key: "conditions" as const, label: "CONDITIONS" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* ── HERO ── */}
        <section className="pt-8 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <nav className="text-xs uppercase tracking-wider text-gray-400 mb-6">
            <span>HOME</span> <span className="mx-1.5">/</span> <span className="text-text-body">LET&apos;S CONNECT</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-dark-navy">Get a Freight Quote</span>{" "}
            <span className="text-primary">You Can Trust</span>
          </h1>
          <p className="text-text-body text-base sm:text-lg max-w-2xl mb-10">
            Transparent pricing, fast response, and full visibility from pickup to delivery.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Left: Truck image */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden bg-primary/10 relative min-h-[280px] sm:min-h-[340px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-dark-navy/30 flex items-center justify-center">
                <div className="text-center px-6">
                  <svg className="w-20 h-20 mx-auto text-white/80 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 17h1m7 0h1M3 11l1-5h4l1 2h6l1-2h4l1 5M3 11v5a1 1 0 001 1h1m14-6v5a1 1 0 01-1 1h-1m-7 0h4m-9 0a2 2 0 104 0m6 0a2 2 0 104 0" />
                  </svg>
                  <p className="text-white font-semibold text-lg">Portlandia Fleet</p>
                  <p className="text-white/70 text-sm">Nationwide coverage</p>
                </div>
              </div>
            </div>

            {/* Right: Rate card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border-lighter shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 relative">
              <button className="absolute top-4 right-4 text-xs text-primary font-medium hover:underline">Edit</button>
              <div className="mb-4">
                <span className="text-xs text-text-body uppercase tracking-wide">Rate Starting at</span>
                <p className="text-4xl font-bold text-primary mt-1">$266.44</p>
              </div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Eligible for LTL Shipping
              </span>
              <p className="text-sm text-text-body mb-5">
                From <span className="font-medium text-dark-navy">Miami, FL 33130</span> To <span className="font-medium text-dark-navy">Florida, NY 10921</span>
              </p>
              <div className="divide-y divide-border-lighter text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-text-body">Shipment Type</span>
                  <span className="font-medium text-dark-navy">LTL</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-text-body">Total Weight</span>
                  <span className="font-medium text-dark-navy">500 lbs</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-text-body">Freight Class</span>
                  <span className="font-medium text-dark-navy">500 lbs</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <button
            onClick={() => {
              const el = document.getElementById("quote-form");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold text-base px-10 py-4 rounded-full transition-colors"
          >
            GET INSTANT QUOTE
          </button>
          <p className="text-sm text-gray-400 mt-3">
            or <a href="#" className="underline hover:text-text-body">contact us directly</a>
          </p>
        </section>

        {/* ── MULTI-STEP AREA ── */}
        <section id="quote-form" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <ProgressSteps current={step} />

          {/* ─── STEP 1: QUOTE FORM ─── */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-border-lighter shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-border-lighter">
                <h2 className="text-xl sm:text-2xl font-bold text-dark-navy">Get Your Best Rate</h2>
                <p className="text-sm text-text-body mt-1">Fill in your shipment details to receive competitive carrier rates.</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border-lighter overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 min-w-[100px] text-center py-3.5 text-xs sm:text-sm font-semibold tracking-wider transition-colors relative ${
                      activeTab === tab.key
                        ? "text-primary"
                        : "text-gray-400 hover:text-text-body"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6 sm:p-8 border-l-4 border-primary">
                {activeTab === "pickup" && renderLocationForm(pickup, setPickup, "Pickup")}
                {activeTab === "delivery" && renderLocationForm(delivery, setDelivery, "Delivery")}
                {activeTab === "items" && renderItemsForm()}
                {activeTab === "conditions" && renderConditionsForm()}
              </div>

              <div className="p-6 sm:p-8 border-t border-border-lighter">
                <button
                  onClick={fetchRates}
                  disabled={loadingRates}
                  className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-base py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loadingRates ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Fetching Rates...
                    </>
                  ) : (
                    "Get Carrier Rates"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: CARRIER RATES ─── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Edit Quote
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRateSort("price")}
                    className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
                      rateSort === "price" ? "bg-primary text-white border-primary" : "border-border-light text-text-body hover:border-gray-300"
                    }`}
                  >
                    Lowest Price
                  </button>
                  <button
                    onClick={() => setRateSort("transit")}
                    className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
                      rateSort === "transit" ? "bg-primary text-white border-primary" : "border-border-light text-text-body hover:border-gray-300"
                    }`}
                  >
                    Fastest
                  </button>
                </div>
              </div>

              {sortedRates.map((rate) => (
                <div
                  key={rate.id}
                  className="bg-white rounded-xl border border-border-lighter shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-navy text-base">{rate.name}</h3>
                    <p className="text-xs text-text-body mt-0.5">{rate.serviceType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {rate.transitDays} day{rate.transitDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${rate.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => selectRate(rate)}
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Select Rate
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ─── STEP 3: SHIPPER/CONSIGNEE ─── */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-border-lighter shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-border-lighter flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-navy">Booking Information</h2>
                  <p className="text-sm text-text-body mt-1">
                    Selected: <span className="font-medium text-primary">{selectedRate?.name}</span> — ${selectedRate?.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Change Rate
                </button>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {renderContactForm(shipper, setShipper, "Shipper")}
                {renderContactForm(consignee, setConsignee, "Consignee")}
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>PO Number</label>
                  <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Customer Reference</label>
                  <input type="text" value={customerRef} onChange={(e) => setCustomerRef(e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-border-lighter">
                <button
                  onClick={bookShipment}
                  disabled={bookingLoading}
                  className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-base py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Booking...
                    </>
                  ) : (
                    "Confirm & Book"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: CONFIRMATION ─── */}
          {step === 4 && confirmation && (
            <div className="bg-white rounded-xl border border-border-lighter shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-navy mb-2">Booking Confirmed!</h2>
              <p className="text-text-body mb-8">Your shipment has been booked successfully.</p>

              <div className="inline-flex flex-col sm:flex-row gap-6 bg-gray-50 rounded-lg p-6 mb-8">
                <div>
                  <span className="text-xs text-text-body uppercase tracking-wide">BOL Number</span>
                  <p className="text-lg font-bold text-dark-navy mt-1">{confirmation.bolNumber}</p>
                </div>
                <div className="hidden sm:block w-px bg-border-light" />
                <div>
                  <span className="text-xs text-text-body uppercase tracking-wide">PRO Number</span>
                  <p className="text-lg font-bold text-dark-navy mt-1">{confirmation.proNumber}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors">
                  Download BOL
                </button>
                <button className="border border-primary text-primary hover:bg-primary/5 font-semibold text-sm px-6 py-3 rounded-lg transition-colors">
                  Track Shipment
                </button>
                <button
                  onClick={resetAll}
                  className="border border-border-light text-text-body hover:border-gray-300 font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── FAQs ── */}
        <FAQSection />

        {/* ── Stay Updated ── */}
        <StayUpdatedSection />
      </main>
      <Footer />
    </>
  );
}
