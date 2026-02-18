import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock carrier rate response for demonstration
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
        serviceType: "Economy LTL",
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
        name: "FedEx Freight",
        transitDays: 3,
        price: 275.0,
        serviceType: "Standard LTL",
      },
      {
        id: "carrier-5",
        name: "SAIA Inc.",
        transitDays: 5,
        price: 245.75,
        serviceType: "Economy LTL",
      },
    ];

    return NextResponse.json({ success: true, rates: carriers });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}
