import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const carriers = [
    {
      id: "carrier-1",
      name: "XPO Logistics",
      transitDays: 3,
      price: 266.44,
      serviceType: "Standard LTL",
    },
    {
      id: "carrier-2",
      name: "Estes Express",
      transitDays: 4,
      price: 289.99,
      serviceType: "Standard LTL",
    },
    {
      id: "carrier-3",
      name: "Old Dominion",
      transitDays: 2,
      price: 312.5,
      serviceType: "Priority LTL",
    },
    {
      id: "carrier-4",
      name: "SAIA Inc.",
      transitDays: 5,
      price: 241.0,
      serviceType: "Economy LTL",
    },
    {
      id: "carrier-5",
      name: "FedEx Freight",
      transitDays: 3,
      price: 298.75,
      serviceType: "Standard LTL",
    },
  ];

  return NextResponse.json({ rates: carriers });
}
