import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Phone and job-number tracking is no longer available. Please use your private tracking link or contact the shop for a new one.",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
