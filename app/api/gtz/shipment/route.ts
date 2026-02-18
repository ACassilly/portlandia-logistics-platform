import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const bolNumber = "BOL-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const proNumber = "PRO-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  return NextResponse.json({
    success: true,
    bolNumber,
    proNumber,
    message: "Shipment booked successfully",
  });
}
