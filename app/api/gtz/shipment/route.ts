import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Stub: return mock booking. Replace with actual GTZ API integration.
    return NextResponse.json({
      bolNumber: "BOL-2024-" + String(Math.floor(1000 + Math.random() * 9000)),
      proNumber: "PRO-2024-" + String(Math.floor(1000 + Math.random() * 9000)),
    });
  } catch {
    return NextResponse.json({ error: "Shipment creation failed" }, { status: 500 });
  }
}
