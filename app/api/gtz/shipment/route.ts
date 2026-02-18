import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock shipment booking response
    const bolNumber = `BOL-${Date.now().toString().slice(-8)}`;
    const proNumber = `PRO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      booking: {
        bolNumber,
        proNumber,
        status: "confirmed",
        estimatedPickup: new Date(
          Date.now() + 86400000
        ).toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to book shipment" },
      { status: 500 }
    );
  }
}
