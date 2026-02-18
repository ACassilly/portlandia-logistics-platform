import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const bolNumber = `BOL-${Date.now().toString(36).toUpperCase()}`;
    const proNumber = `PRO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      booking: {
        bolNumber,
        proNumber,
        status: "confirmed",
        estimatedPickup: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}
