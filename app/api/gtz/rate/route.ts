import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mock carrier rates for demonstration
    const carriers = [
      {
        id: "car_1",
        name: "XPO Logistics",
        transitDays: 3,
        price: 266.44,
        serviceType: "Standard LTL",
      },
      {
        id: "car_2",
        name: "Old Dominion",
        transitDays: 2,
        price: 312.50,
        serviceType: "Priority LTL",
      },
      {
        id: "car_3",
        name: "Estes Express",
        transitDays: 4,
        price: 241.00,
        serviceType: "Economy LTL",
      },
      {
        id: "car_4",
        name: "FedEx Freight",
        transitDays: 2,
        price: 345.75,
        serviceType: "Express LTL",
      },
      {
        id: "car_5",
        name: "SAIA Inc.",
        transitDays: 3,
        price: 278.20,
        serviceType: "Standard LTL",
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
