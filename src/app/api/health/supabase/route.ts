import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";



export async function GET() {
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
      { status: 500 }
    );
  }
}