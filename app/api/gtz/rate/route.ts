import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Stub: return mock rates. Replace with actual GTZ API integration.
    const rates = [
      { id: "1", carrier: "Carrier A", transitDays: 3, price: 266.44 },
      { id: "2", carrier: "Carrier B", transitDays: 2, price: 289.0 },
      { id: "3", carrier: "Carrier C", transitDays: 4, price: 245.0 },
    ];
    return NextResponse.json({ rates });
  } catch {
    return NextResponse.json({ error: "Rate request failed" }, { status: 500 });
  }
}
