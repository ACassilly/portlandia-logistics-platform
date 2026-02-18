"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;
type AccordionId = "pickup" | "delivery" | "items" | "conditions";
type LocationType = "business" | "residential";

type AccessorialKey =
  | "liftgate"
  | "insidePickup"
  | "insideDelivery"
  | "appointmentRequired"
  | "limitedAccess";

type LocationForm = {
  date: string;
  zip: string;
  city: string;
  state: string;
  locationType: LocationType;
  accessorials: Record<AccessorialKey, boolean>;
};

type HandlingUnit =
  | "Pallet"
  | "Box"
  | "Bag"
  | "Bale"
  | "Bundle"
  | "Carton"
  | "Case"
  | "Crate"
  | "Cylinder"
  | "Drum"
  | "Gallon"
  | "Pieces"
  | "Reel"
  | "Roll"
  | "Skid"
  | "Totes"
  | "Tube"
  | "Other";

type ItemRow = {
  id: string;
  qty: number;
  handlingUnit: HandlingUnit;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  weightLb: number;
  hazmat: boolean;
};

type ConditionsForm = {
  declaredValueUsd: string;
  specialInstructions: string;
  termsAccepted: boolean;
};

type Rate = {
  id: string;
  carrierName: string;
  transitDays: number;
  totalPrice: number;
  currency: string;
  serviceLevel?: string;
};

type PartyForm = {
  company: string;
  contact: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

type BookingConfirmation = {
  bolNumber: string;
  proNumber: string;
  bolUrl?: string;
  trackingUrl?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function n(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function densityToFreightClass(densityLbsPerFt3: number) {
  // Common density-based class guideline.
  // See: https://www.freightclass.com/freight-density-calculator/
  if (!Number.isFinite(densityLbsPerFt3) || densityLbsPerFt3 <= 0) return "—";
  if (densityLbsPerFt3 >= 50) return "50";
  if (densityLbsPerFt3 >= 35) return "55";
  if (densityLbsPerFt3 >= 30) return "60";
  if (densityLbsPerFt3 >= 22.5) return "65";
  if (densityLbsPerFt3 >= 15) return "70";
  if (densityLbsPerFt3 >= 13.5) return "77.5";
  if (densityLbsPerFt3 >= 12) return "85";
  if (densityLbsPerFt3 >= 10.5) return "92.5";
  if (densityLbsPerFt3 >= 9) return "100";
  if (densityLbsPerFt3 >= 8) return "110";
  if (densityLbsPerFt3 >= 7) return "125";
  if (densityLbsPerFt3 >= 6) return "150";
  if (densityLbsPerFt3 >= 5) return "175";
  if (densityLbsPerFt3 >= 4) return "200";
  if (densityLbsPerFt3 >= 3) return "250";
  if (densityLbsPerFt3 >= 2) return "300";
  if (densityLbsPerFt3 >= 1) return "400";
  return "500";
}

function itemVolumeFt3(item: ItemRow) {
  const cubicIn = Math.max(0, item.lengthIn) * Math.max(0, item.widthIn) * Math.max(0, item.heightIn);
  const ft3PerUnit = cubicIn / 1728;
  return ft3PerUnit * Math.max(0, item.qty);
}

function itemWeightLb(item: ItemRow) {
  return Math.max(0, item.weightLb) * Math.max(0, item.qty);
}

function normalizeRatesResponse(data: any): Rate[] {
  const raw = data?.rates ?? data?.data?.rates ?? data?.data ?? data;
  const list: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.rates) ? raw.rates : [];
  return list
    .map((r, idx) => {
      const carrierName = String(r?.carrierName ?? r?.carrier ?? r?.name ?? "Carrier").trim();
      const transitDays = Number(r?.transitDays ?? r?.days ?? r?.transit_days ?? 0) || 0;
      const totalPrice = Number(r?.totalPrice ?? r?.price ?? r?.total ?? r?.total_price ?? 0) || 0;
      const serviceLevel = r?.serviceLevel ?? r?.service_level ?? r?.service;
      const id = String(r?.id ?? `${carrierName}-${transitDays}-${totalPrice}-${idx}`);
      return { id, carrierName, transitDays, totalPrice, currency: "USD", serviceLevel };
    })
    .filter((r) => r.totalPrice > 0);
}

function normalizeBookingResponse(data: any): BookingConfirmation | null {
  const bolNumber = String(data?.bolNumber ?? data?.bol_number ?? data?.BOL ?? data?.bol ?? "").trim();
  const proNumber = String(data?.proNumber ?? data?.pro_number ?? data?.PRO ?? data?.pro ?? "").trim();
  if (!bolNumber || !proNumber) return null;
  const bolUrl = data?.bolUrl ?? data?.bol_url ?? data?.documents?.bolUrl ?? data?.documents?.bol_url;
  const trackingUrl =
    data?.trackingUrl ?? data?.tracking_url ?? data?.tracking?.url ?? data?.tracking?.trackingUrl ?? undefined;
  return { bolNumber, proNumber, bolUrl, trackingUrl };
}

export default function LtlQuotePage() {
  const quoteCardRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [activeAccordion, setActiveAccordion] = useState<AccordionId>("pickup");

  const [pickup, setPickup] = useState<LocationForm>({
    date: "",
    zip: "33130",
    city: "Miami",
    state: "FL",
    locationType: "business",
    accessorials: {
      liftgate: false,
      insidePickup: false,
      insideDelivery: false,
      appointmentRequired: false,
      limitedAccess: false,
    },
  });

  const [delivery, setDelivery] = useState<LocationForm>({
    date: "",
    zip: "10921",
    city: "Florida",
    state: "NY",
    locationType: "business",
    accessorials: {
      liftgate: false,
      insidePickup: false,
      insideDelivery: false,
      appointmentRequired: false,
      limitedAccess: false,
    },
  });

  const [items, setItems] = useState<ItemRow[]>([
    {
      id: "1",
      qty: 1,
      handlingUnit: "Pallet",
      lengthIn: 48,
      widthIn: 40,
      heightIn: 24,
      weightLb: 500,
      hazmat: false,
    },
  ]);
  const [nextItemId, setNextItemId] = useState(2);

  const [conditions, setConditions] = useState<ConditionsForm>({
    declaredValueUsd: "",
    specialInstructions: "",
    termsAccepted: false,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [ratesSort, setRatesSort] = useState<"lowest" | "fastest">("lowest");
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  const [shipper, setShipper] = useState<PartyForm>({
    company: "",
    contact: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [consignee, setConsignee] = useState<PartyForm>({
    company: "",
    contact: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [references, setReferences] = useState<{ poNumber: string; customerRef: string }>({
    poNumber: "",
    customerRef: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);

  const searchParams = useSearchParams();
  const [initializedFromQuery, setInitializedFromQuery] = useState(false);
  const faqItems = [
    {
      q: "How long does it take to receive a quote?",
      a: "Instant rates are returned immediately when available. For complex shipments, we’ll respond as quickly as possible with a confirmed carrier price.",
    },
    {
      q: "What information do I need to request a quote?",
      a: "Pickup and delivery ZIP/state, shipment items (dims + weight), and any accessorials like liftgate or appointment requirements.",
    },
    {
      q: "Is requesting a quote free?",
      a: "Yes — getting a quote is free. You only pay when you confirm and book a shipment.",
    },
    {
      q: "Will the quoted price change later?",
      a: "Quotes are based on the information provided. If shipment details change (weight, dimensions, accessorials), carriers may re-rate the shipment.",
    },
    {
      q: "What happens after I submit a quote request?",
      a: "You’ll see available carrier options to compare price and transit time. Select a rate, enter shipper/consignee details, then confirm to book.",
    },
  ] as const;
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    if (initializedFromQuery) return;

    const pickupZip = searchParams.get("pickupZip")?.trim() ?? "";
    const deliveryZip = searchParams.get("deliveryZip")?.trim() ?? "";
    const weightRaw = searchParams.get("weightLb")?.trim() ?? "";

    const pickupCity = searchParams.get("pickupCity")?.trim() ?? "";
    const pickupState = (searchParams.get("pickupState")?.trim() ?? "").toUpperCase();
    const deliveryCity = searchParams.get("deliveryCity")?.trim() ?? "";
    const deliveryState = (searchParams.get("deliveryState")?.trim() ?? "").toUpperCase();

    const any = Boolean(
      pickupZip || deliveryZip || weightRaw || pickupCity || pickupState || deliveryCity || deliveryState,
    );
    if (!any) {
      setInitializedFromQuery(true);
      return;
    }

    if (pickupZip || pickupCity || pickupState) {
      setPickup((p) => ({
        ...p,
        zip: pickupZip || p.zip,
        city: pickupCity || p.city,
        state: pickupState || p.state,
      }));
    }

    if (deliveryZip || deliveryCity || deliveryState) {
      setDelivery((d) => ({
        ...d,
        zip: deliveryZip || d.zip,
        city: deliveryCity || d.city,
        state: deliveryState || d.state,
      }));
    }

    const weight = Number(weightRaw);
    if (Number.isFinite(weight) && weight > 0) {
      setItems((prev) => {
        if (!prev.length) {
          return [
            {
              id: "1",
              qty: 1,
              handlingUnit: "Pallet",
              lengthIn: 48,
              widthIn: 40,
              heightIn: 24,
              weightLb: weight,
              hazmat: false,
            },
          ];
        }
        const [first, ...rest] = prev;
        return [{ ...first, qty: 1, weightLb: weight }, ...rest];
      });
    }

    setInitializedFromQuery(true);
    setTimeout(() => scrollToQuoteCard(), 50);
  }, [initializedFromQuery, searchParams]);

  const totals = useMemo(() => {
    const totalWeight = items.reduce((acc, it) => acc + itemWeightLb(it), 0);
    const totalVolume = items.reduce((acc, it) => acc + itemVolumeFt3(it), 0);
    const density = totalVolume > 0 ? totalWeight / totalVolume : 0;
    const suggestedClass = densityToFreightClass(density);
    return { totalWeight, totalVolume, density, suggestedClass };
  }, [items]);

  const sortedRates = useMemo(() => {
    const copy = [...rates];
    copy.sort((a, b) => {
      if (ratesSort === "fastest") {
        if (a.transitDays !== b.transitDays) return a.transitDays - b.transitDays;
        return a.totalPrice - b.totalPrice;
      }
      if (a.totalPrice !== b.totalPrice) return a.totalPrice - b.totalPrice;
      return a.transitDays - b.transitDays;
    });
    return copy;
  }, [rates, ratesSort]);

  const selectedRate = useMemo(() => rates.find((r) => r.id === selectedRateId) ?? null, [rates, selectedRateId]);

  const inputClass =
    "h-11 w-full rounded-lg border border-pl-border-2 bg-white px-3 text-[14px] text-pl-dark placeholder:text-[#9b9b9b] focus:border-pl-green focus:outline-none";

  function scrollToQuoteCard() {
    quoteCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addItem() {
    const id = String(nextItemId);
    setNextItemId((x) => x + 1);
    setItems((prev) => [
      ...prev,
      { id, qty: 1, handlingUnit: "Pallet", lengthIn: 48, widthIn: 40, heightIn: 24, weightLb: 100, hazmat: false },
    ]);
    setActiveAccordion("items");
  }

  function updateItem(id: string, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  async function submitForRates() {
    setFormError(null);

    if (!pickup.zip || !pickup.state || !delivery.zip || !delivery.state) {
      setFormError("Please complete Pickup and Delivery (ZIP + State).");
      setActiveAccordion(!pickup.zip || !pickup.state ? "pickup" : "delivery");
      return;
    }
    if (totals.totalWeight <= 0) {
      setFormError("Please add at least one item with a weight greater than 0.");
      setActiveAccordion("items");
      return;
    }
    if (!conditions.termsAccepted) {
      setFormError("Please accept the Terms & Conditions to continue.");
      setActiveAccordion("conditions");
      return;
    }

    setQuoteLoading(true);
    setQuoteError(null);

    const payload = {
      pickup,
      delivery,
      items,
      conditions: {
        declaredValueUsd: conditions.declaredValueUsd ? n(conditions.declaredValueUsd) : undefined,
        specialInstructions: conditions.specialInstructions,
        termsAccepted: conditions.termsAccepted,
      },
      totals: {
        totalWeightLb: totals.totalWeight,
        totalVolumeFt3: totals.totalVolume,
        densityLbsPerFt3: totals.density,
        suggestedFreightClass: totals.suggestedClass,
      },
    };

    try {
      const res = await fetch("/api/gtz/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Rate API returned ${res.status}`);
      const data = await res.json();
      const normalized = normalizeRatesResponse(data);
      if (!normalized.length) throw new Error("No rates returned");
      setRates(normalized);
      setStep(2);
      scrollToQuoteCard();
    } catch {
      // When developing locally (static export), /api may not exist. Show demo rates to keep flow usable.
      setQuoteError("Couldn’t reach live rating API. Showing demo carrier rates.");
      setRates([
        { id: "demo-1", carrierName: "Estes Express", transitDays: 2, totalPrice: 266.44, currency: "USD" },
        { id: "demo-2", carrierName: "Old Dominion", transitDays: 3, totalPrice: 279.12, currency: "USD" },
        { id: "demo-3", carrierName: "XPO Logistics", transitDays: 1, totalPrice: 318.9, currency: "USD" },
      ]);
      setStep(2);
      scrollToQuoteCard();
    } finally {
      setQuoteLoading(false);
    }
  }

  async function confirmAndBook() {
    setBookingError(null);

    if (!selectedRate) {
      setBookingError("Please select a carrier rate first.");
      setStep(2);
      scrollToQuoteCard();
      return;
    }

    const missing: string[] = [];
    if (!shipper.company) missing.push("Shipper company");
    if (!shipper.contact) missing.push("Shipper contact");
    if (!shipper.phone) missing.push("Shipper phone");
    if (!shipper.email) missing.push("Shipper email");
    if (!shipper.address1) missing.push("Shipper address");
    if (!shipper.city || !shipper.state || !shipper.zip) missing.push("Shipper city/state/zip");
    if (!consignee.company) missing.push("Consignee company");
    if (!consignee.contact) missing.push("Consignee contact");
    if (!consignee.phone) missing.push("Consignee phone");
    if (!consignee.email) missing.push("Consignee email");
    if (!consignee.address1) missing.push("Consignee address");
    if (!consignee.city || !consignee.state || !consignee.zip) missing.push("Consignee city/state/zip");

    if (missing.length) {
      setBookingError(`Missing required fields: ${missing.join(", ")}.`);
      return;
    }

    setBookingLoading(true);

    const payload = {
      pickup,
      delivery,
      items,
      conditions,
      selectedRate,
      shipper,
      consignee,
      references,
      totals: {
        totalWeightLb: totals.totalWeight,
        totalVolumeFt3: totals.totalVolume,
        densityLbsPerFt3: totals.density,
        suggestedFreightClass: totals.suggestedClass,
      },
    };

    try {
      const res = await fetch("/api/gtz/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Shipment API returned ${res.status}`);
      const data = await res.json();
      const normalized = normalizeBookingResponse(data);
      if (!normalized) throw new Error("Unexpected booking response");
      setBooking(normalized);
      setStep(4);
      scrollToQuoteCard();
    } catch {
      setBookingError("Couldn’t reach live booking API. Showing demo confirmation.");
      const demo = {
        bolNumber: `BOL-${Math.floor(100000 + Math.random() * 900000)}`,
        proNumber: `PRO-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      setBooking(demo);
      setStep(4);
      scrollToQuoteCard();
    } finally {
      setBookingLoading(false);
    }
  }

  function resetFlow() {
    setStep(1);
    setRates([]);
    setQuoteError(null);
    setSelectedRateId(null);
    setBooking(null);
    setBookingError(null);
    setFormError(null);
    setActiveAccordion("pickup");
    scrollToQuoteCard();
  }

  return (
    <main className="bg-white">
      {/* TOP HERO BANNER */}
      <section className="pt-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="relative overflow-hidden rounded-[22px] border border-pl-border-2 bg-[#0b1117] shadow-card">
            <img
              src="/images/hero-blue.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

            <div className="relative px-7 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/70">LET&apos;S CONNECT</div>
              <h1 className="mt-3 max-w-[720px] text-balance text-[38px] font-semibold leading-[1.05] text-white sm:text-[46px] md:text-[52px]">
                Freight quoting &amp; booking, simplified.
              </h1>
              <p className="mt-4 max-w-[720px] text-pretty text-[15px] leading-7 text-white/75">
                Transparent pricing, fast response, and full visibility from pickup to delivery.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#instant-quote"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToQuoteCard();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#101010] hover:bg-white/95"
                >
                  GET A QUOTE
                </a>
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-[12px] font-semibold tracking-[0.08em] text-white hover:bg-white/15"
                >
                  CONTACT US
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold tracking-[0.22em] text-[#8a8a8a]">
            {["LTL", "FTL", "WAREHOUSING", "TRACKING", "SUPPORT"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pl-green" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HEADING + BREADCRUMB */}
      <section className="pt-14">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[#8a8a8a]">
            <Link href="/" className="hover:text-pl-dark">
              HOME
            </Link>{" "}
            <span className="mx-2 text-[#c9c9c9]">/</span> <span>LET&apos;S CONNECT</span>
          </div>

          <h2 className="mt-4 text-balance text-[40px] font-semibold leading-[1.04] text-pl-dark sm:text-[54px]">
            <span>Get a Freight Quote</span>
            <span className="text-pl-green"> You Can Trust</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-pretty text-[15px] leading-7 text-pl-text sm:text-[16px]">
            Transparent pricing, fast response, and full visibility from pickup to delivery.
          </p>
        </div>
      </section>

      {/* QUOTE SUMMARY */}
      <section className="pt-10">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-[#dff7ea] shadow-card">
                <img src="/images/road.svg" alt="Open road" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-card border border-pl-border-2 bg-white p-6 shadow-card">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setActiveAccordion("pickup");
                    scrollToQuoteCard();
                  }}
                  className="absolute right-5 top-5 inline-flex h-9 items-center justify-center rounded-full border border-pl-border-2 bg-white px-4 text-[12px] font-semibold text-pl-dark hover:bg-[#fafafa]"
                >
                  Edit
                </button>

                <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">RATE STARTING AT</div>
                <div className="mt-1 text-[44px] font-semibold leading-none text-pl-green">{formatUsd(266.44)}</div>

                <div className="mt-4 inline-flex items-center rounded-full bg-[#e9fbf1] px-3 py-1 text-[12px] font-semibold text-pl-green">
                  Eligible for LTL Shipping
                </div>

                <div className="mt-4 text-[13px] leading-6 text-[#2d2d2d]">
                  <span className="font-semibold">From</span> {pickup.city}, {pickup.state} {pickup.zip}{" "}
                  <span className="font-semibold">To</span> {delivery.city}, {delivery.state} {delivery.zip}
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-pl-border-2">
                  {[
                    ["Shipment Type", "LTL"],
                    ["Total weight", `${Math.round(totals.totalWeight)} lbs`],
                    ["Freight Class", totals.suggestedClass === "—" ? "—" : `Class ${totals.suggestedClass}`],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-6 border-b border-pl-border-2 px-4 py-3 last:border-b-0"
                    >
                      <div className="text-[13px] text-[#6a6a6a]">{k}</div>
                      <div className="text-[13px] font-semibold text-pl-dark">{v}</div>
                    </div>
                  ))}
                </div>

                <a
                  href="#instant-quote"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToQuoteCard();
                  }}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-pl-green text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
                >
                  GET INSTANT QUOTE
                </a>
                <div className="mt-3 text-center text-[13px] text-[#8a8a8a]">
                  or{" "}
                  <a href="#contact" className="underline decoration-[#bdbdbd] underline-offset-4 hover:text-pl-dark">
                    contact us directly
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED LOGISTICS BANNER */}
      <section id="services" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div className="relative overflow-hidden rounded-card bg-[#2f8f5c] p-8 text-white shadow-card lg:col-span-7">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/80">WHY PORTLANDIA</div>
              <div className="mt-3 text-balance text-[26px] font-semibold leading-[1.12]">
                Trusted logistics for every lane, every time.
              </div>
              <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-white/80">
                Our team works carrier relationships, pricing, and accessorial details so you can ship with confidence.
              </p>

              <a
                href="#instant-quote"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToQuoteCard();
                }}
                className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#101010] hover:bg-white/95"
              >
                START NOW
              </a>

              <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-12 right-10 h-48 w-48 rounded-full bg-white/10" />
            </div>

            <div className="grid gap-6 lg:col-span-5">
              <div className="overflow-hidden rounded-card shadow-card">
                <img src="/images/collage-tall.svg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-card shadow-card">
                  <img src="/images/collage-small-1.svg" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="overflow-hidden rounded-card shadow-card">
                  <img src="/images/collage-small-2.svg" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTANT QUOTE (MULTI-STEP FLOW) */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-card bg-[#0f5b3f] shadow-card">
                <img src="/images/trucks.svg" alt="Truck fleet" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                id="instant-quote"
                ref={(el) => {
                  quoteCardRef.current = el;
                }}
                className="scroll-mt-[96px] rounded-card border border-pl-border-2 bg-white shadow-card"
              >
                <div className="flex flex-col gap-6 border-b border-pl-border-2 px-7 py-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">GET AN INSTANT QUOTE</div>
                    <div className="mt-1 text-[20px] font-semibold text-pl-dark">Get your best rate</div>
                  </div>

                  <StepIndicator step={step} />
                </div>

                <div className="px-7 py-7">
                  {step === 1 && (
                    <>
                      {formError && (
                        <div className="mb-6 rounded-lg border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#8a1b1b]">
                          {formError}
                        </div>
                      )}

                      <div className="space-y-4">
                        <AccordionSection
                          id="pickup"
                          label="PICKUP"
                          activeId={activeAccordion}
                          setActiveId={setActiveAccordion}
                        >
                          <div className="grid gap-4 md:grid-cols-12">
                            <div className="md:col-span-4">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">Pickup Date</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                type="date"
                                value={pickup.date}
                                onChange={(e) => setPickup((p) => ({ ...p, date: e.target.value }))}
                              />
                            </div>
                            <div className="md:col-span-8" />

                            <div className="md:col-span-4">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">Zip Code</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                value={pickup.zip}
                                onChange={(e) => setPickup((p) => ({ ...p, zip: e.target.value }))}
                                placeholder="ZIP"
                                inputMode="numeric"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">City</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                value={pickup.city}
                                onChange={(e) => setPickup((p) => ({ ...p, city: e.target.value }))}
                                placeholder="City"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">State</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                value={pickup.state}
                                onChange={(e) => setPickup((p) => ({ ...p, state: e.target.value.toUpperCase() }))}
                                placeholder="State"
                              />
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-[12px] font-semibold text-[#6a6a6a]">Location Type</div>
                            <div className="mt-2 inline-flex rounded-full border border-pl-border-2 p-1">
                              <button
                                type="button"
                                onClick={() => setPickup((p) => ({ ...p, locationType: "business" }))}
                                className={cx(
                                  "h-9 rounded-full px-4 text-[13px] font-semibold",
                                  pickup.locationType === "business"
                                    ? "bg-pl-green text-white"
                                    : "text-pl-dark hover:bg-[#fafafa]",
                                )}
                              >
                                Business
                              </button>
                              <button
                                type="button"
                                onClick={() => setPickup((p) => ({ ...p, locationType: "residential" }))}
                                className={cx(
                                  "h-9 rounded-full px-4 text-[13px] font-semibold",
                                  pickup.locationType === "residential"
                                    ? "bg-pl-green text-white"
                                    : "text-pl-dark hover:bg-[#fafafa]",
                                )}
                              >
                                Residential
                              </button>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-[12px] font-semibold text-[#6a6a6a]">Accessorials</div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                { key: "liftgate", label: "Liftgate" },
                                { key: "insidePickup", label: "Inside Pickup" },
                                { key: "appointmentRequired", label: "Appointment Required" },
                                { key: "limitedAccess", label: "Limited Access" },
                              ].map(({ key, label }) => (
                                <label key={key} className="flex cursor-pointer items-center gap-2 text-[13px] text-pl-dark">
                                  <input
                                    type="checkbox"
                                    checked={pickup.accessorials[key as AccessorialKey]}
                                    onChange={(e) =>
                                      setPickup((p) => ({
                                        ...p,
                                        accessorials: { ...p.accessorials, [key]: e.target.checked },
                                      }))
                                    }
                                    className="h-4 w-4 accent-pl-green"
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </AccordionSection>

                        <AccordionSection
                          id="delivery"
                          label="DELIVERY"
                          activeId={activeAccordion}
                          setActiveId={setActiveAccordion}
                        >
                          <div className="grid gap-4 md:grid-cols-12">
                            <div className="md:col-span-4">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">Delivery Date</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                type="date"
                                value={delivery.date}
                                onChange={(e) => setDelivery((d) => ({ ...d, date: e.target.value }))}
                              />
                            </div>
                            <div className="md:col-span-8" />

                            <div className="md:col-span-4">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">Zip Code</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                value={delivery.zip}
                                onChange={(e) => setDelivery((d) => ({ ...d, zip: e.target.value }))}
                                placeholder="ZIP"
                                inputMode="numeric"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">City</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                value={delivery.city}
                                onChange={(e) => setDelivery((d) => ({ ...d, city: e.target.value }))}
                                placeholder="City"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">State</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                value={delivery.state}
                                onChange={(e) => setDelivery((d) => ({ ...d, state: e.target.value.toUpperCase() }))}
                                placeholder="State"
                              />
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-[12px] font-semibold text-[#6a6a6a]">Location Type</div>
                            <div className="mt-2 inline-flex rounded-full border border-pl-border-2 p-1">
                              <button
                                type="button"
                                onClick={() => setDelivery((d) => ({ ...d, locationType: "business" }))}
                                className={cx(
                                  "h-9 rounded-full px-4 text-[13px] font-semibold",
                                  delivery.locationType === "business"
                                    ? "bg-pl-green text-white"
                                    : "text-pl-dark hover:bg-[#fafafa]",
                                )}
                              >
                                Business
                              </button>
                              <button
                                type="button"
                                onClick={() => setDelivery((d) => ({ ...d, locationType: "residential" }))}
                                className={cx(
                                  "h-9 rounded-full px-4 text-[13px] font-semibold",
                                  delivery.locationType === "residential"
                                    ? "bg-pl-green text-white"
                                    : "text-pl-dark hover:bg-[#fafafa]",
                                )}
                              >
                                Residential
                              </button>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="text-[12px] font-semibold text-[#6a6a6a]">Accessorials</div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                { key: "liftgate", label: "Liftgate" },
                                { key: "insideDelivery", label: "Inside Delivery" },
                                { key: "appointmentRequired", label: "Appointment Required" },
                                { key: "limitedAccess", label: "Limited Access" },
                              ].map(({ key, label }) => (
                                <label key={key} className="flex cursor-pointer items-center gap-2 text-[13px] text-pl-dark">
                                  <input
                                    type="checkbox"
                                    checked={delivery.accessorials[key as AccessorialKey]}
                                    onChange={(e) =>
                                      setDelivery((d) => ({
                                        ...d,
                                        accessorials: { ...d.accessorials, [key]: e.target.checked },
                                      }))
                                    }
                                    className="h-4 w-4 accent-pl-green"
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </AccordionSection>

                        <AccordionSection
                          id="items"
                          label="ITEMS"
                          activeId={activeAccordion}
                          setActiveId={setActiveAccordion}
                        >
                          <div className="-mx-2 overflow-x-auto px-2">
                            <table className="w-full min-w-[980px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-pl-border-2">
                              <thead className="bg-[#fafafa]">
                                <tr className="text-left text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">
                                  {["QTY", "HANDLING UNIT", "L", "W", "H", "WEIGHT", "FREIGHT CLASS", "HAZMAT"].map(
                                    (h) => (
                                      <th key={h} className="border-b border-pl-border-2 px-3 py-3">
                                        {h}
                                      </th>
                                    ),
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((it) => {
                                  const vol = itemVolumeFt3(it);
                                  const wt = itemWeightLb(it);
                                  const density = vol > 0 ? wt / vol : 0;
                                  const fc = densityToFreightClass(density);
                                  return (
                                    <tr key={it.id} className="text-[13px] text-pl-dark">
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <input
                                          className={cx(inputClass, "h-10")}
                                          type="number"
                                          min={1}
                                          value={it.qty}
                                          onChange={(e) =>
                                            updateItem(it.id, { qty: Math.max(1, n(e.target.value)) })
                                          }
                                        />
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <select
                                          className={cx(inputClass, "h-10")}
                                          value={it.handlingUnit}
                                          onChange={(e) =>
                                            updateItem(it.id, { handlingUnit: e.target.value as HandlingUnit })
                                          }
                                        >
                                          {(
                                            [
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
                                            ] as const
                                          ).map((opt) => (
                                            <option key={opt} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <input
                                          className={cx(inputClass, "h-10")}
                                          type="number"
                                          min={0}
                                          value={it.lengthIn}
                                          onChange={(e) => updateItem(it.id, { lengthIn: n(e.target.value) })}
                                        />
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <input
                                          className={cx(inputClass, "h-10")}
                                          type="number"
                                          min={0}
                                          value={it.widthIn}
                                          onChange={(e) => updateItem(it.id, { widthIn: n(e.target.value) })}
                                        />
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <input
                                          className={cx(inputClass, "h-10")}
                                          type="number"
                                          min={0}
                                          value={it.heightIn}
                                          onChange={(e) => updateItem(it.id, { heightIn: n(e.target.value) })}
                                        />
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <input
                                          className={cx(inputClass, "h-10")}
                                          type="number"
                                          min={0}
                                          value={it.weightLb}
                                          onChange={(e) => updateItem(it.id, { weightLb: n(e.target.value) })}
                                        />
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <div className="flex h-10 items-center rounded-lg border border-pl-border-2 bg-[#fbfbfb] px-3 text-[13px] font-semibold text-pl-dark">
                                          {fc === "—" ? "—" : `Class ${fc}`}
                                        </div>
                                      </td>
                                      <td className="border-b border-pl-border-2 px-3 py-3">
                                        <label className="flex items-center justify-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={it.hazmat}
                                            onChange={(e) => updateItem(it.id, { hazmat: e.target.checked })}
                                            className="h-4 w-4 accent-pl-green"
                                          />
                                        </label>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <button
                            type="button"
                            onClick={addItem}
                            className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-pl-green hover:underline"
                          >
                            <span className="text-[16px] leading-none">+</span> Add Item
                          </button>

                          <div className="mt-6 grid gap-3 rounded-lg border border-pl-border-2 bg-[#fbfbfb] p-4 md:grid-cols-3">
                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">
                                TOTAL WEIGHT
                              </div>
                              <div className="mt-1 text-[15px] font-semibold text-pl-dark">
                                {Math.round(totals.totalWeight)} lbs
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">
                                TOTAL DENSITY
                              </div>
                              <div className="mt-1 text-[15px] font-semibold text-pl-dark">
                                {totals.density ? totals.density.toFixed(2) : "—"} lbs/ft³
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">
                                SUGGESTED FREIGHT CLASS
                              </div>
                              <div className="mt-1 text-[15px] font-semibold text-pl-dark">
                                {totals.suggestedClass === "—" ? "—" : `Class ${totals.suggestedClass}`}
                              </div>
                            </div>
                          </div>
                        </AccordionSection>

                        <AccordionSection
                          id="conditions"
                          label="CONDITIONS"
                          activeId={activeAccordion}
                          setActiveId={setActiveAccordion}
                        >
                          <div className="grid gap-4 md:grid-cols-12">
                            <div className="md:col-span-4">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">Declared Value ($)</label>
                              <input
                                className={cx(inputClass, "mt-2")}
                                inputMode="decimal"
                                value={conditions.declaredValueUsd}
                                onChange={(e) => setConditions((c) => ({ ...c, declaredValueUsd: e.target.value }))}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="md:col-span-8" />

                            <div className="md:col-span-12">
                              <label className="text-[12px] font-semibold text-[#6a6a6a]">Special Instructions</label>
                              <textarea
                                className={cx(
                                  "mt-2 w-full rounded-lg border border-pl-border-2 bg-white px-3 py-3 text-[14px] text-pl-dark placeholder:text-[#9b9b9b] focus:border-pl-green focus:outline-none",
                                )}
                                rows={4}
                                value={conditions.specialInstructions}
                                onChange={(e) =>
                                  setConditions((c) => ({ ...c, specialInstructions: e.target.value }))
                                }
                                placeholder="Add any notes for the carrier or driver..."
                              />
                            </div>

                            <div className="md:col-span-12">
                              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-pl-border-2 bg-[#fbfbfb] px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={conditions.termsAccepted}
                                  onChange={(e) =>
                                    setConditions((c) => ({ ...c, termsAccepted: e.target.checked }))
                                  }
                                  className="mt-1 h-4 w-4 accent-pl-green"
                                />
                                <div>
                                  <div className="text-[13px] font-semibold text-pl-dark">Terms &amp; Conditions</div>
                                  <div className="mt-1 text-[13px] leading-6 text-pl-text">
                                    I confirm the shipment details are accurate and agree to the carrier and brokerage
                                    terms.
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </AccordionSection>
                      </div>

                      <div className="mt-7">
                        <button
                          type="button"
                          disabled={quoteLoading}
                          onClick={submitForRates}
                          className={cx(
                            "inline-flex h-12 w-full items-center justify-center rounded-full bg-pl-green text-[14px] font-semibold text-white shadow-sm hover:brightness-95",
                            quoteLoading && "opacity-60",
                          )}
                        >
                          {quoteLoading ? "Getting Rates..." : "Get Carrier Rates"}
                        </button>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <div>
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">RESULTS</div>
                          <div className="mt-1 text-[20px] font-semibold text-pl-dark">Carrier Rates</div>
                          {quoteError && <div className="mt-2 text-[13px] text-[#7a7a7a]">{quoteError}</div>}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setStep(1);
                              setActiveAccordion("pickup");
                              scrollToQuoteCard();
                            }}
                            className="inline-flex h-11 items-center justify-center rounded-full border border-pl-border-2 bg-white px-5 text-[13px] font-semibold text-pl-dark hover:bg-[#fafafa]"
                          >
                            Edit Quote
                          </button>

                          <div className="inline-flex rounded-full border border-pl-border-2 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setRatesSort("lowest")}
                              className={cx(
                                "h-9 rounded-full px-4 text-[13px] font-semibold",
                                ratesSort === "lowest" ? "bg-pl-green text-white" : "text-pl-dark hover:bg-[#fafafa]",
                              )}
                            >
                              Lowest Price
                            </button>
                            <button
                              type="button"
                              onClick={() => setRatesSort("fastest")}
                              className={cx(
                                "h-9 rounded-full px-4 text-[13px] font-semibold",
                                ratesSort === "fastest" ? "bg-pl-green text-white" : "text-pl-dark hover:bg-[#fafafa]",
                              )}
                            >
                              Fastest
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-7 grid gap-4">
                        {sortedRates.map((r) => (
                          <div
                            key={r.id}
                            className="flex flex-col gap-4 rounded-lg border border-pl-border-2 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="text-[16px] font-semibold text-pl-dark">{r.carrierName}</div>
                                <div className="inline-flex items-center rounded-full border border-pl-border-2 bg-[#fbfbfb] px-3 py-1 text-[12px] font-semibold text-pl-dark">
                                  {r.transitDays ? `${r.transitDays} Transit Days` : "Transit TBD"}
                                </div>
                                {r.serviceLevel && (
                                  <div className="text-[12px] font-semibold text-[#6f6f6f]">{String(r.serviceLevel)}</div>
                                )}
                              </div>
                              <div className="mt-2 text-[13px] text-[#6f6f6f]">
                                {pickup.city}, {pickup.state} {pickup.zip} → {delivery.city}, {delivery.state}{" "}
                                {delivery.zip}
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              <div className="text-[22px] font-semibold text-pl-green">{formatUsd(r.totalPrice)}</div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRateId(r.id);
                                  setShipper((s) =>
                                    s.city || s.state || s.zip
                                      ? s
                                      : { ...s, city: pickup.city, state: pickup.state, zip: pickup.zip },
                                  );
                                  setConsignee((c) =>
                                    c.city || c.state || c.zip
                                      ? c
                                      : { ...c, city: delivery.city, state: delivery.state, zip: delivery.zip },
                                  );
                                  setStep(3);
                                  scrollToQuoteCard();
                                }}
                                className="inline-flex h-11 items-center justify-center rounded-full bg-pl-green px-6 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
                              >
                                Select Rate
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">STEP 3</div>
                          <div className="mt-1 text-[20px] font-semibold text-pl-dark">Shipper / Consignee</div>
                          {selectedRate && (
                            <div className="mt-2 text-[13px] text-[#6f6f6f]">
                              Selected: <span className="font-semibold text-pl-dark">{selectedRate.carrierName}</span> ·{" "}
                              <span className="font-semibold text-pl-green">
                                {formatUsd(selectedRate.totalPrice)}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setStep(2);
                            scrollToQuoteCard();
                          }}
                          className="inline-flex h-11 items-center justify-center rounded-full border border-pl-border-2 bg-white px-5 text-[13px] font-semibold text-pl-dark hover:bg-[#fafafa]"
                        >
                          Back to Rates
                        </button>
                      </div>

                      {bookingError && (
                        <div className="mt-6 rounded-lg border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#8a1b1b]">
                          {bookingError}
                        </div>
                      )}

                      <div className="mt-7 grid gap-6 lg:grid-cols-2">
                        <PartyCard title="Shipper" value={shipper} onChange={setShipper} inputClass={inputClass} />
                        <PartyCard title="Consignee" value={consignee} onChange={setConsignee} inputClass={inputClass} />
                      </div>

                      <div className="mt-6 rounded-lg border border-pl-border-2 bg-[#fbfbfb] p-5">
                        <div className="text-[12px] font-semibold tracking-[0.12em] text-[#6f6f6f]">REFERENCES</div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-[12px] font-semibold text-[#6a6a6a]">PO#</label>
                            <input
                              className={cx(inputClass, "mt-2")}
                              value={references.poNumber}
                              onChange={(e) => setReferences((r) => ({ ...r, poNumber: e.target.value }))}
                              placeholder="PO Number"
                            />
                          </div>
                          <div>
                            <label className="text-[12px] font-semibold text-[#6a6a6a]">Customer Ref</label>
                            <input
                              className={cx(inputClass, "mt-2")}
                              value={references.customerRef}
                              onChange={(e) => setReferences((r) => ({ ...r, customerRef: e.target.value }))}
                              placeholder="Reference"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-7">
                        <button
                          type="button"
                          disabled={bookingLoading}
                          onClick={confirmAndBook}
                          className={cx(
                            "inline-flex h-12 w-full items-center justify-center rounded-full bg-pl-green text-[14px] font-semibold text-white shadow-sm hover:brightness-95",
                            bookingLoading && "opacity-60",
                          )}
                        >
                          {bookingLoading ? "Confirming..." : "Confirm & Book"}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-[12px] font-semibold tracking-[0.12em] text-[#7a7a7a]">CONFIRMATION</div>
                          <div className="mt-1 flex items-center gap-3 text-[22px] font-semibold text-pl-dark">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pl-green text-white">
                              ✓
                            </span>
                            Booking Confirmed!
                          </div>
                          {bookingError && <div className="mt-2 text-[13px] text-[#7a7a7a]">{bookingError}</div>}
                        </div>

                        <button
                          type="button"
                          onClick={resetFlow}
                          className="inline-flex h-11 items-center justify-center rounded-full border border-pl-border-2 bg-white px-5 text-[13px] font-semibold text-pl-dark hover:bg-[#fafafa]"
                        >
                          Book Another
                        </button>
                      </div>

                      <div className="mt-7 grid gap-4 rounded-lg border border-pl-border-2 bg-white p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-lg border border-pl-border-2 bg-[#fbfbfb] p-4">
                            <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">BOL NUMBER</div>
                            <div className="mt-1 text-[18px] font-semibold text-pl-dark">{booking?.bolNumber ?? "—"}</div>
                          </div>
                          <div className="rounded-lg border border-pl-border-2 bg-[#fbfbfb] p-4">
                            <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">PRO NUMBER</div>
                            <div className="mt-1 text-[18px] font-semibold text-pl-dark">{booking?.proNumber ?? "—"}</div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <a
                            className={cx(
                              "inline-flex h-11 flex-1 items-center justify-center rounded-full border border-pl-border-2 bg-white px-5 text-[13px] font-semibold text-pl-dark hover:bg-[#fafafa]",
                              !booking?.bolUrl && "pointer-events-none opacity-50",
                            )}
                            href={booking?.bolUrl ?? "#"}
                          >
                            Download BOL
                          </a>
                          <a
                            className={cx(
                              "inline-flex h-11 flex-1 items-center justify-center rounded-full border border-pl-border-2 bg-white px-5 text-[13px] font-semibold text-pl-dark hover:bg-[#fafafa]",
                              !booking?.trackingUrl && "pointer-events-none opacity-50",
                            )}
                            href={booking?.trackingUrl ?? "#"}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Track Shipment
                          </a>
                          <button
                            type="button"
                            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-pl-green px-5 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
                            onClick={resetFlow}
                          >
                            Book Another
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DARK FEATURE GRID */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[26px] bg-[#1a1a1a] p-7 text-white shadow-[0_18px_60px_rgba(0,0,0,0.16)] md:p-10">
            <div className="text-center">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/60">FULL VISIBILITY</div>
              <div className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] md:text-[34px]">
                From quote to <span className="text-pl-green">booked</span>, all in one place.
              </div>
              <div className="mx-auto mt-4 max-w-[760px] text-[14px] leading-7 text-white/70">
                Compare carriers, review accessorials, and keep your team aligned with shipment details and documents.
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-card bg-white/8 p-6">
                <div className="text-[14px] font-semibold">Instant carrier comparison</div>
                <div className="mt-2 text-[13px] leading-6 text-white/70">
                  Sort by lowest price or fastest transit, then select the rate that fits your timeline.
                </div>
                <a
                  href="#instant-quote"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToQuoteCard();
                  }}
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-pl-green px-5 text-[12px] font-semibold tracking-[0.08em] text-white hover:brightness-95"
                >
                  GET RATES
                </a>
              </div>

              <div className="overflow-hidden rounded-card bg-[#2A50D9]/25 p-4">
                <img
                  src="/images/app-ui.svg"
                  alt=""
                  className="h-[240px] w-full rounded-card object-cover md:h-[270px]"
                />
              </div>

              <div className="overflow-hidden rounded-card bg-white/6">
                <img src="/images/road.svg" alt="" className="h-[240px] w-full object-cover md:h-[270px]" />
              </div>

              <div className="rounded-card bg-white/8 p-6">
                <div className="text-[14px] font-semibold">Team-ready booking details</div>
                <div className="mt-2 text-[13px] leading-6 text-white/70">
                  Keep shipper and consignee info, references, and special instructions together for a clean handoff.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["BOL", "PRO", "Tracking"].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-semibold text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[22px] bg-[#e9fbf1] p-8 shadow-card md:p-10">
            <div className="text-center">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-[#6a6a6a]">PERFORMANCE</div>
              <div className="mt-3 text-balance text-[26px] font-semibold leading-[1.12] text-pl-dark md:text-[32px]">
                Built for reliable freight execution.
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: "Fast quotes", v: "Minutes", d: "Response time" },
                { k: "Visibility", v: "24/7", d: "Tracking access" },
                { k: "Carrier options", v: "50+", d: "Regional & national" },
                { k: "Support", v: "Human", d: "When it matters" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-card border border-pl-border-2 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="text-[11px] font-semibold tracking-[0.12em] text-[#6f6f6f]">{m.k.toUpperCase()}</div>
                  <div className="mt-2 text-[22px] font-semibold text-pl-green">{m.v}</div>
                  <div className="mt-1 text-[13px] leading-6 text-pl-text">{m.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section id="insights" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.22em] text-[#7a7a7a]">INSIGHTS</div>
              <div className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] text-pl-dark">
                Shipping tips &amp; updates
              </div>
            </div>
            <a href="#instant-quote" className="text-[13px] font-semibold text-pl-green hover:underline">
              Get a quote →
            </a>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "How freight class is calculated", img: "/images/collage-small-2.svg" },
              { title: "Avoid re-class and re-weigh fees", img: "/images/collage-small-1.svg" },
              { title: "LTL accessorials explained", img: "/images/collage-tall.svg" },
            ].map((c) => (
              <div key={c.title} className="overflow-hidden rounded-card border border-pl-border-2 bg-white shadow-card">
                <div className="aspect-[16/10] overflow-hidden bg-[#f6f6f6]">
                  <img src={c.img} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-[14px] font-semibold text-pl-dark">{c.title}</div>
                  <div className="mt-2 text-[13px] leading-6 text-pl-text">
                    Practical guidance to help you ship accurately and keep costs predictable.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="rounded-[22px] bg-[#f3f3f3] p-8 shadow-card md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.22em] text-[#7a7a7a]">TESTIMONIALS</div>
                <div className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] text-pl-dark">
                  Take inspiration from shippers like you.
                </div>
              </div>
              <div className="text-[13px] font-semibold text-[#6f6f6f]">★ ★ ★ ★ ★</div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Operations Lead",
                  quote: "Fast rates, clear options, and a smooth booking flow. Exactly what we needed.",
                },
                {
                  name: "Shipping Manager",
                  quote: "The accessorial selections and totals make it easy to quote correctly the first time.",
                },
                { name: "Warehouse Admin", quote: "Carrier choices are straightforward and the confirmation step is quick." },
                { name: "Procurement", quote: "Great pricing visibility and responsive support whenever we have a question." },
              ].map((t) => (
                <div key={t.name} className="rounded-card border border-pl-border-2 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#e9fbf1]" />
                    <div className="text-[13px] font-semibold text-pl-dark">{t.name}</div>
                  </div>
                  <div className="mt-4 text-[13px] leading-6 text-pl-text">“{t.quote}”</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center">
            <div className="text-[11px] font-semibold tracking-[0.22em] text-[#7a7a7a]">FAQs</div>
            <h2 className="mt-2 text-balance text-[34px] font-semibold leading-[1.08] text-pl-dark">
              Questions, answered
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-card border border-pl-border-2 bg-white shadow-card">
            {faqItems.map((f, idx) => {
              const open = faqOpen === idx;
              return (
                <div key={f.q} className="border-b border-pl-border-2 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setFaqOpen((cur) => (cur === idx ? null : idx))}
                    className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left"
                  >
                    <span className="text-[15px] font-semibold text-pl-dark">{f.q}</span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full border text-[18px] leading-none",
                        open ? "border-pl-green bg-pl-green text-white" : "border-pl-border-2 bg-white text-pl-dark",
                      )}
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && <div className="px-7 pb-7 text-[14px] leading-7 text-pl-text">{f.a}</div>}
                </div>
              );
            })}
          </div>

          <div className="relative mt-10 overflow-hidden rounded-card border border-pl-border-2 bg-white p-8 shadow-card">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#e9fbf1]" />
            <svg
              className="absolute right-0 top-0 h-28 w-56 opacity-90"
              viewBox="0 0 320 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 92C44 66 83 62 120 76C156 90 188 114 232 116C276 118 302 98 320 84V160H0V92Z"
                fill="#00c950"
                fillOpacity="0.18"
              />
              <path
                d="M0 112C54 84 95 86 136 102C177 118 206 140 250 140C294 140 310 128 320 120V160H0V112Z"
                fill="#00c950"
                fillOpacity="0.12"
              />
            </svg>

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[18px] font-semibold text-pl-dark">Didn&apos;t find your answer?</div>
                <div className="mt-2 max-w-[640px] text-[14px] leading-7 text-pl-text">
                  Contact our team and we&apos;ll help you get the right rate and the right carrier — fast.
                </div>
              </div>
              <a
                href="#contact"
                className="inline-flex h-11 items-center justify-center rounded-full bg-pl-dark px-6 text-[13px] font-semibold text-white hover:brightness-110"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STAY UPDATED */}
      <section className="pt-16">
        <div className="relative overflow-hidden bg-[#0f1b18]">
          <div className="absolute inset-0">
            <img src="/images/trucks.svg" alt="" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-[#0f1b18]/85" />
          </div>

          <div className="relative mx-auto max-w-[1200px] px-6 py-16">
            <div className="max-w-[720px]">
              <div className="text-[12px] font-semibold tracking-[0.12em] text-white/60">NEWSLETTER</div>
              <h2 className="mt-2 text-balance text-[34px] font-semibold leading-[1.08] text-white">Stay Updated</h2>
              <p className="mt-3 text-pretty text-[15px] leading-7 text-white/70">
                Get the latest industry news, shipping insights, and service updates — delivered to your inbox.
              </p>
            </div>

            <form
              className="mt-7 flex w-full max-w-[640px] flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-[14px] text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
                type="email"
                placeholder="Email address"
                required
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-pl-green px-6 text-[13px] font-semibold text-white shadow-sm hover:brightness-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="pb-20 pt-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <div className="relative overflow-hidden rounded-card bg-[#2f8f5c] p-8 text-white shadow-card lg:col-span-7">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/80">NEED HELP?</div>
              <div className="mt-3 text-balance text-[26px] font-semibold leading-[1.12]">
                Talk to a freight specialist.
              </div>
              <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-white/80">
                Prefer to quote with a person? We&apos;ll validate details, confirm accessorials, and respond fast.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:quotes@portlandialogistics.com"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-[0.08em] text-[#101010] hover:bg-white/95"
                >
                  EMAIL US
                </a>
                <a
                  href="tel:+15035550199"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-[12px] font-semibold tracking-[0.08em] text-white hover:bg-white/15"
                >
                  CALL (503) 555-0199
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-card shadow-card lg:col-span-5">
              <img src="/images/hero-blue.svg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to mirror Figma vertical rhythm */}
      <div className="h-10" />
    </main>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: Array<{ n: Step; label: string }> = [
    { n: 1, label: "Step 1" },
    { n: 2, label: "Step 2" },
    { n: 3, label: "Step 3" },
    { n: 4, label: "Step 4" },
  ];

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, idx) => {
        const active = step === s.n;
        const done = step > s.n;
        return (
          <div key={s.n} className="flex items-center">
            <div
              className={cx(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[12px] font-semibold",
                active
                  ? "border-pl-green bg-[#e9fbf1] text-pl-dark"
                  : done
                    ? "border-pl-green bg-pl-green text-white"
                    : "border-pl-border-2 bg-white text-[#7a7a7a]",
              )}
            >
              <span
                className={cx(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  active ? "bg-pl-green text-white" : done ? "bg-white/25 text-white" : "bg-[#f2f2f2] text-[#7a7a7a]",
                )}
              >
                {s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {idx !== steps.length - 1 && <div className="mx-2 hidden h-[2px] w-6 bg-pl-border-2 sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function AccordionSection({
  id,
  label,
  activeId,
  setActiveId,
  children,
}: {
  id: AccordionId;
  label: string;
  activeId: AccordionId;
  setActiveId: (id: AccordionId) => void;
  children: React.ReactNode;
}) {
  const active = id === activeId;
  return (
    <div
      className={cx(
        "overflow-hidden rounded-lg border border-pl-border-2 bg-white",
        active ? "border-l-[6px] border-l-pl-green" : "border-l-[6px] border-l-transparent",
      )}
    >
      <button
        type="button"
        onClick={() => setActiveId(id)}
        className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left"
      >
        <span className="text-[12px] font-semibold tracking-[0.14em] text-[#5f5f5f]">{label}</span>
        <span
          aria-hidden="true"
          className={cx(
            "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[16px] leading-none",
            active ? "border-pl-green bg-[#e9fbf1] text-pl-green" : "border-pl-border-2 bg-white text-[#6f6f6f]",
          )}
        >
          {active ? "—" : "+"}
        </span>
      </button>
      {active && <div className="px-5 pb-6">{children}</div>}
    </div>
  );
}

function PartyCard({
  title,
  value,
  onChange,
  inputClass,
}: {
  title: string;
  value: PartyForm;
  onChange: (next: PartyForm) => void;
  inputClass: string;
}) {
  return (
    <div className="rounded-lg border border-pl-border-2 bg-white p-5">
      <div className="text-[12px] font-semibold tracking-[0.12em] text-[#6f6f6f]">{title.toUpperCase()}</div>

      <div className="mt-4 grid gap-4">
        <div>
          <label className="text-[12px] font-semibold text-[#6a6a6a]">Company</label>
          <input
            className={cx(inputClass, "mt-2")}
            value={value.company}
            onChange={(e) => onChange({ ...value, company: e.target.value })}
            placeholder="Company Name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold text-[#6a6a6a]">Contact</label>
            <input
              className={cx(inputClass, "mt-2")}
              value={value.contact}
              onChange={(e) => onChange({ ...value, contact: e.target.value })}
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#6a6a6a]">Phone</label>
            <input
              className={cx(inputClass, "mt-2")}
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              placeholder="(000) 000-0000"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#6a6a6a]">Email</label>
          <input
            className={cx(inputClass, "mt-2")}
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#6a6a6a]">Address 1</label>
          <input
            className={cx(inputClass, "mt-2")}
            value={value.address1}
            onChange={(e) => onChange({ ...value, address1: e.target.value })}
            placeholder="Street address"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#6a6a6a]">Address 2</label>
          <input
            className={cx(inputClass, "mt-2")}
            value={value.address2}
            onChange={(e) => onChange({ ...value, address2: e.target.value })}
            placeholder="Suite / Unit (optional)"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-[12px] font-semibold text-[#6a6a6a]">City</label>
            <input
              className={cx(inputClass, "mt-2")}
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              placeholder="City"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#6a6a6a]">State</label>
            <input
              className={cx(inputClass, "mt-2")}
              value={value.state}
              onChange={(e) => onChange({ ...value, state: e.target.value.toUpperCase() })}
              placeholder="ST"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#6a6a6a]">Zip</label>
          <input
            className={cx(inputClass, "mt-2")}
            value={value.zip}
            onChange={(e) => onChange({ ...value, zip: e.target.value })}
            placeholder="ZIP"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}

