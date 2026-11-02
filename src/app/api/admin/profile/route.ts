
import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Keep request-dependent APIs outside try/catch.
  // Next.js needs to handle its prerender bailout signal.
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSession(token)) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const username = process.env.ADMIN_USERNAME;

  if (!username) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin profile is not configured.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    profile: {
      username,
      role: "Administrator",
    },
  });
}
