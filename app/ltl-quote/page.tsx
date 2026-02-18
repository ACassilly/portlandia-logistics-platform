"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HANDLING_UNITS = [
  "Pallet", "Box", "Bag", "Bale", "Bundle", "Carton", "Case", "Crate",
  "Cylinder", "Drum", "Gallon", "Pieces", "Reel", "Roll", "Skid", "Totes", "Tube", "Other"
];

type Step = 1 | 2 | 3 | 4;

interface FormData {
  pickupDate: string;
  pickupZip: string;
  pickupCity: string;
  pickupState: string;
  pickupLocationType: "business" | "residential";
  pickupLiftgate: boolean;
  pickupInside: boolean;
  pickupAppointment: boolean;
  pickupLimitedAccess: boolean;
  deliveryDate: string;
  deliveryZip: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryLocationType: "business" | "residential";
  deliveryLiftgate: boolean;
  deliveryInside: boolean;
  deliveryAppointment: boolean;
  deliveryLimitedAccess: boolean;
  declaredValue: string;
  specialInstructions: string;
  termsAccepted: boolean;
}

interface ItemRow {
  id: string;
  qty: number;
  handlingUnit: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  hazmat: boolean;
}

interface CarrierRate {
  id: string;
  carrier: string;
  transitDays: number;
  price: number;
}

interface ShipperData {
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

const FAQ_ITEMS = [
  "How long does it take to receive a quote?",
  "What information do I need to request a quote?",
  "Is requesting a quote free?",
  "Will the quoted price change later?",
  "What happens after I submit a quote request?",
];

export default function LtlQuotePage() {
  const [step, setStep] = useState<Step>(1);
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery" | "items" | "conditions">("pickup");
  const [formData, setFormData] = useState<FormData>({
    pickupDate: "",
    pickupZip: "33130",
    pickupCity: "Miami",
    pickupState: "FL",
    pickupLocationType: "business",
    pickupLiftgate: false,
    pickupInside: false,
    pickupAppointment: false,
    pickupLimitedAccess: false,
    deliveryDate: "",
    deliveryZip: "10921",
    deliveryCity: "Florida",
    deliveryState: "NY",
    deliveryLocationType: "business",
    deliveryLiftgate: false,
    deliveryInside: false,
    deliveryAppointment: false,
    deliveryLimitedAccess: false,
    declaredValue: "",
    specialInstructions: "",
    termsAccepted: false,
  });
  const [items, setItems] = useState<ItemRow[]>([
    { id: "1", qty: 1, handlingUnit: "Pallet", length: 48, width: 40, height: 48, weight: 500, hazmat: false },
  ]);
  const [rates, setRates] = useState<CarrierRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CarrierRate | null>(null);
  const [shipper, setShipper] = useState<ShipperData>({ company: "", contact: "", phone: "", email: "", address1: "", address2: "", city: "", state: "", zip: "" });
  const [consignee, setConsignee] = useState<ShipperData>({ company: "", contact: "", phone: "", email: "", address1: "", address2: "", city: "", state: "", zip: "" });
  const [references, setReferences] = useState({ poNumber: "", customerRef: "" });
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "transit">("price");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollToForm = () => {
    document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const totalWeight = items.reduce((sum, i) => sum + i.qty * i.weight, 0);
  const totalVolume = items.reduce((sum, i) => sum + i.qty * i.length * i.width * i.height, 0);
  const density = totalVolume > 0 ? totalWeight / (totalVolume / 1728) : 0;
  const suggestedClass = density >= 30 ? 50 : density >= 22.5 ? 55 : density >= 15 ? 60 : density >= 13 ? 65 : 70;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), qty: 1, handlingUnit: "Pallet", length: 48, width: 40, height: 48, weight: 100, hazmat: false }]);
  };

  const updateItem = (id: string, field: keyof ItemRow, value: string | number | boolean) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const submitQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gtz/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: { zip: formData.pickupZip, city: formData.pickupCity, state: formData.pickupState, date: formData.pickupDate },
          delivery: { zip: formData.deliveryZip, city: formData.deliveryCity, state: formData.deliveryState, date: formData.deliveryDate },
          items,
          declaredValue: formData.declaredValue,
        }),
      });
      const data = await res.json();
      if (data.rates) setRates(data.rates);
      else setRates([
        { id: "1", carrier: "Carrier A", transitDays: 3, price: 266.44 },
        { id: "2", carrier: "Carrier B", transitDays: 2, price: 289.00 },
        { id: "3", carrier: "Carrier C", transitDays: 4, price: 245.00 },
      ]);
      setStep(2);
    } catch {
      setRates([
        { id: "1", carrier: "Carrier A", transitDays: 3, price: 266.44 },
        { id: "2", carrier: "Carrier B", transitDays: 2, price: 289.00 },
        { id: "3", carrier: "Carrier C", transitDays: 4, price: 245.00 },
      ]);
      setStep(2);
    }
    setLoading(false);
  };

  const selectRate = (rate: CarrierRate) => {
    setSelectedRate(rate);
    setStep(3);
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gtz/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateId: selectedRate?.id,
          shipper,
          consignee,
          references,
          formData,
          items,
        }),
      });
      const data = await res.json();
      setBooking({ bolNumber: data.bolNumber || "BOL-2024-001", proNumber: data.proNumber || "PRO-2024-001" });
      setStep(4);
    } catch {
      setBooking({ bolNumber: "BOL-2024-001", proNumber: "PRO-2024-001" });
      setStep(4);
    }
    setLoading(false);
  };

  const sortedRates = [...rates].sort((a, b) => sortBy === "price" ? a.price - b.price : a.transitDays - b.transitDays);

  return (
    <div className="bg-white min-h-screen">
      {/* Progress Steps */}
      <div className="border-b border-border-light bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 md:gap-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => step >= s && setStep(s as Step)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${step >= s ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}
                >
                  Step {s}
                </button>
                {s < 4 && <span className="mx-1 text-border">/</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <nav className="text-xs tracking-wider text-muted uppercase mb-6">
          <Link href="/" className="hover:text-navy">HOME</Link>
          <span className="mx-2">/</span>
          <span>LET&apos;S CONNECT</span>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
          Get a Freight Quote <span className="text-primary">You Can Trust</span>
        </h1>
        <p className="text-muted text-lg mb-10 max-w-2xl">
          Transparent pricing, fast response, and full visibility from pickup to delivery.
        </p>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3 relative rounded-xl overflow-hidden min-h-[280px] bg-primary/10 aspect-[3/2]">
            <Image src="/images/trucks.svg" alt="Truck fleet" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6 relative">
              <button className="absolute top-4 right-4 text-sm text-primary hover:underline">Edit</button>
              <p className="text-sm text-muted mb-1">Rate Starting at</p>
              <p className="text-3xl font-bold text-primary mb-3">$266.44</p>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">Eligible for LTL Shipping</span>
              <p className="text-sm text-muted mb-4">
                From Miami, FL 33130 To Florida, NY 10921
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Shipment Type</span><span>LTL</span></div>
                <div className="flex justify-between"><span className="text-muted">Total weight</span><span>500 lbs</span></div>
                <div className="flex justify-between"><span className="text-muted">Freight Class</span><span>500 lbs</span></div>
              </div>
              <button onClick={scrollToForm} className="w-full mt-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                GET INSTANT QUOTE
              </button>
              <p className="text-center text-sm text-muted mt-3">
                or <Link href="/contact" className="text-primary hover:underline">contact us directly</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUOTE FORM */}
      {step === 1 && (
        <section id="quote-form" className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl shadow-card p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-navy mb-6">Get Your Best Rate</h2>

            <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-6">
              {(["pickup", "delivery", "items", "conditions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                    activeTab === tab ? "border-primary bg-primary/5 text-primary" : "border-transparent text-muted hover:text-navy"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === "pickup" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Pickup Date</label>
                  <input type="date" value={formData.pickupDate} onChange={e => setFormData({ ...formData, pickupDate: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-navy mb-1">Zip Code</label><input type="text" value={formData.pickupZip} onChange={e => setFormData({ ...formData, pickupZip: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium text-navy mb-1">City</label><input type="text" value={formData.pickupCity} onChange={e => setFormData({ ...formData, pickupCity: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium text-navy mb-1">State</label><input type="text" value={formData.pickupState} onChange={e => setFormData({ ...formData, pickupState: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Location Type</label>
                  <div className="flex gap-2">
                    <button onClick={() => setFormData({ ...formData, pickupLocationType: "business" })} className={`px-4 py-2 rounded-lg text-sm font-medium ${formData.pickupLocationType === "business" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>Business</button>
                    <button onClick={() => setFormData({ ...formData, pickupLocationType: "residential" })} className={`px-4 py-2 rounded-lg text-sm font-medium ${formData.pickupLocationType === "residential" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>Residential</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Accessorials</label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: "pickupLiftgate", label: "Liftgate" },
                      { key: "pickupInside", label: "Inside Pickup" },
                      { key: "pickupAppointment", label: "Appointment Required" },
                      { key: "pickupLimitedAccess", label: "Limited Access" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData[key as keyof FormData] as boolean} onChange={e => setFormData({ ...formData, [key]: e.target.checked })} className="rounded border-border" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Delivery Date</label>
                  <input type="date" value={formData.deliveryDate} onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-navy mb-1">Zip Code</label><input type="text" value={formData.deliveryZip} onChange={e => setFormData({ ...formData, deliveryZip: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium text-navy mb-1">City</label><input type="text" value={formData.deliveryCity} onChange={e => setFormData({ ...formData, deliveryCity: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium text-navy mb-1">State</label><input type="text" value={formData.deliveryState} onChange={e => setFormData({ ...formData, deliveryState: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Location Type</label>
                  <div className="flex gap-2">
                    <button onClick={() => setFormData({ ...formData, deliveryLocationType: "business" })} className={`px-4 py-2 rounded-lg text-sm font-medium ${formData.deliveryLocationType === "business" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>Business</button>
                    <button onClick={() => setFormData({ ...formData, deliveryLocationType: "residential" })} className={`px-4 py-2 rounded-lg text-sm font-medium ${formData.deliveryLocationType === "residential" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>Residential</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Accessorials</label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: "deliveryLiftgate", label: "Liftgate" },
                      { key: "deliveryInside", label: "Inside Pickup" },
                      { key: "deliveryAppointment", label: "Appointment Required" },
                      { key: "deliveryLimitedAccess", label: "Limited Access" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData[key as keyof FormData] as boolean} onChange={e => setFormData({ ...formData, [key]: e.target.checked })} className="rounded border-border" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2">Qty</th>
                        <th className="text-left py-2">Handling Unit</th>
                        <th className="text-left py-2">L x W x H (in)</th>
                        <th className="text-left py-2">Weight (lbs)</th>
                        <th className="text-left py-2">Freight Class</th>
                        <th className="text-left py-2">Hazmat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-border-light">
                          <td className="py-2"><input type="number" min={1} value={item.qty} onChange={e => updateItem(item.id, "qty", parseInt(e.target.value) || 1)} className="w-16 border border-border rounded px-2 py-1" /></td>
                          <td className="py-2">
                            <select value={item.handlingUnit} onChange={e => updateItem(item.id, "handlingUnit", e.target.value)} className="border border-border rounded px-2 py-1 min-w-[100px]">
                              {HANDLING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </td>
                          <td className="py-2">
                            <div className="flex gap-1">
                              <input type="number" value={item.length} onChange={e => updateItem(item.id, "length", parseInt(e.target.value) || 0)} className="w-14 border border-border rounded px-1 py-1" />
                              <span>x</span>
                              <input type="number" value={item.width} onChange={e => updateItem(item.id, "width", parseInt(e.target.value) || 0)} className="w-14 border border-border rounded px-1 py-1" />
                              <span>x</span>
                              <input type="number" value={item.height} onChange={e => updateItem(item.id, "height", parseInt(e.target.value) || 0)} className="w-14 border border-border rounded px-1 py-1" />
                            </div>
                          </td>
                          <td className="py-2"><input type="number" value={item.weight} onChange={e => updateItem(item.id, "weight", parseInt(e.target.value) || 0)} className="w-20 border border-border rounded px-2 py-1" /></td>
                          <td className="py-2 text-muted">{suggestedClass}</td>
                          <td className="py-2"><input type="checkbox" checked={item.hazmat} onChange={e => updateItem(item.id, "hazmat", e.target.checked)} className="rounded" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addItem} className="text-primary hover:underline text-sm font-medium">+ Add Item</button>
                <div className="pt-4 text-sm text-muted">
                  Total weight: {totalWeight} lbs | Density: {density.toFixed(1)} | Suggested freight class: {suggestedClass}
                </div>
              </div>
            )}

            {activeTab === "conditions" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Declared Value ($)</label>
                  <input type="text" value={formData.declaredValue} onChange={e => setFormData({ ...formData, declaredValue: e.target.value })} placeholder="0" className="w-full border border-border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Special Instructions</label>
                  <textarea value={formData.specialInstructions} onChange={e => setFormData({ ...formData, specialInstructions: e.target.value })} rows={4} className="w-full border border-border rounded-lg px-3 py-2" />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.termsAccepted} onChange={e => setFormData({ ...formData, termsAccepted: e.target.checked })} className="mt-1 rounded border-border" />
                  <span className="text-sm">I agree to the Terms & Conditions</span>
                </label>
              </div>
            )}

            <button onClick={submitQuote} disabled={loading} className="w-full mt-8 py-4 bg-primary text-white font-semibold text-lg rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
              {loading ? "Loading..." : "Get Carrier Rates"}
            </button>
          </div>
        </section>
      )}

      {/* SECTION 3: RESULTS */}
      {step === 2 && (
        <section className="container mx-auto px-4 pb-16">
          <button onClick={() => setStep(1)} className="text-primary hover:underline mb-6 font-medium">← Edit Quote</button>
          <div className="flex gap-4 mb-6">
            <button onClick={() => setSortBy("price")} className={`px-4 py-2 rounded-lg text-sm font-medium ${sortBy === "price" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>Lowest Price</button>
            <button onClick={() => setSortBy("transit")} className={`px-4 py-2 rounded-lg text-sm font-medium ${sortBy === "transit" ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>Fastest</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRates.map((rate) => (
              <div key={rate.id} className="bg-white rounded-xl shadow-card p-6 border border-border-light">
                <h3 className="font-semibold text-navy mb-2">{rate.carrier}</h3>
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded mb-4">{rate.transitDays} days</span>
                <p className="text-2xl font-bold text-primary mb-4">${rate.price.toFixed(2)}</p>
                <button onClick={() => selectRate(rate)} className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark">Select Rate</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: SHIPPER/CONSIGNEE */}
      {step === 3 && (
        <section className="container mx-auto px-4 pb-16">
          <button onClick={() => setStep(2)} className="text-primary hover:underline mb-6 font-medium">← Edit Quote</button>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h3 className="text-xl font-bold text-navy mb-4">Shipper</h3>
              <div className="space-y-3">
                {(["company", "contact", "phone", "email", "address1", "address2", "city", "state", "zip"] as const).map((f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-navy mb-1">{f.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</label>
                    <input type={f === "email" ? "email" : "text"} value={shipper[f]} onChange={e => setShipper({ ...shipper, [f]: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy mb-4">Consignee</h3>
              <div className="space-y-3">
                {(["company", "contact", "phone", "email", "address1", "address2", "city", "state", "zip"] as const).map((f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-navy mb-1">{f.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</label>
                    <input type={f === "email" ? "email" : "text"} value={consignee[f]} onChange={e => setConsignee({ ...consignee, [f]: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 max-w-2xl">
            <h3 className="text-xl font-bold text-navy mb-4">References</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-navy mb-1">PO#</label><input type="text" value={references.poNumber} onChange={e => setReferences({ ...references, poNumber: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium text-navy mb-1">Customer Ref</label><input type="text" value={references.customerRef} onChange={e => setReferences({ ...references, customerRef: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2" /></div>
            </div>
          </div>
          <button onClick={confirmBooking} disabled={loading} className="mt-8 w-full max-w-md mx-auto block py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Processing..." : "Confirm & Book"}
          </button>
        </section>
      )}

      {/* SECTION 5: CONFIRMATION */}
      {step === 4 && booking && (
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-navy mb-4">Booking Confirmed!</h2>
          <p className="text-muted mb-2">BOL Number: <span className="font-semibold text-navy">{booking.bolNumber}</span></p>
          <p className="text-muted mb-8">PRO Number: <span className="font-semibold text-navy">{booking.proNumber}</span></p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/10">Download BOL</button>
            <button className="px-6 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary/10">Track Shipment</button>
            <button onClick={() => { setStep(1); setBooking(null); setSelectedRate(null); }} className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark">Book Another</button>
          </div>
        </section>
      )}

      {/* SECTION 6: FAQs */}
      <section className="container mx-auto px-4 py-16 border-t border-border-light">
        <h2 className="text-2xl font-bold text-navy mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl">
          {FAQ_ITEMS.map((q, i) => (
            <div key={i} className="border-b border-border">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full py-4 flex items-center justify-between text-left">
                <span className="font-medium text-navy">{q}</span>
                <span className="text-2xl text-primary">{expandedFaq === i ? "−" : "+"}</span>
              </button>
              {expandedFaq === i && (
                <div className="pb-4 text-muted text-sm">
                  Answer placeholder for question {i + 1}.
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-gray-50 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <svg viewBox="0 0 100 100" className="text-primary"><path fill="currentColor" d="M0 50 Q25 25 50 50 T100 50 L100 100 L0 100 Z" /></svg>
          </div>
          <p className="font-medium text-navy mb-2">Didn&apos;t find your answer?</p>
          <button className="px-6 py-2 bg-navy text-white font-medium rounded-lg hover:bg-navy-dark">Contact us</button>
        </div>
      </section>

      {/* SECTION 7: STAY UPDATED */}
      <section className="relative py-20 overflow-hidden min-h-[320px]">
        <div className="absolute inset-0">
          <Image src="/images/trucks.svg" alt="" fill className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Get the latest industry news, shipping tips, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg border-0" />
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
