import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mock carrier rate results
    const rates = [
      {
        id: "r1",
        carrier: "XPO Logistics",
        transitDays: 3,
        price: 266.44,
        serviceType: "Standard LTL",
      },
      {
        id: "r2",
        carrier: "Old Dominion",
        transitDays: 2,
        price: 312.88,
        serviceType: "Priority LTL",
      },
      {
        id: "r3",
        carrier: "Estes Express",
        transitDays: 4,
        price: 241.15,
        serviceType: "Economy LTL",
      },
      {
        id: "r4",
        carrier: "FedEx Freight",
        transitDays: 2,
        price: 298.50,
        serviceType: "Priority LTL",
      },
      {
        id: "r5",
        carrier: "SAIA Inc.",
        transitDays: 3,
        price: 255.30,
        serviceType: "Standard LTL",
      },
    ];

    return NextResponse.json({ success: true, rates });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}
