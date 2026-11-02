import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSession(session)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from("repair_jobs")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful.",
    });
  } catch (error) {
    console.error("Supabase health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Supabase connection failed.",
      },
      { status: 500 },
    );
  }
}
