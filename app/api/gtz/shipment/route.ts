import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mock booking confirmation
    const bolNumber = `BOL-${Date.now().toString(36).toUpperCase()}`;
    const proNumber = `PRO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      booking: {
        bolNumber,
        proNumber,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to book shipment" },
      { status: 500 }
    );
  }
}
