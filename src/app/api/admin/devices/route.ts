import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const brand = request.nextUrl.searchParams.get("brand")?.trim() ?? "";
    const model = request.nextUrl.searchParams.get("model")?.trim() ?? "";
    if (!brand || !model || brand.length > 100 || model.length > 160) {
      return fail("Valid device brand and model are required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: allJobs, error: jobsError } = await supabase
      .from("repair_jobs")
      .select("id,brand,model")
      .is("deleted_at", null);
    if (jobsError) throw jobsError;
    const ids = (allJobs ?? [])
      .filter((job) => String(job.brand).trim().toLowerCase() === brand.toLowerCase()
        && String(job.model).trim().toLowerCase() === model.toLowerCase())
      .map((job) => job.id);
    if (!ids.length) return fail("No active repair history found for this device.", 404);

    const { data: moved, error: updateError } = await supabase
      .from("repair_jobs")
      .update({ deleted_at: new Date().toISOString(), deleted_by: "Admin" })
      .in("id", ids)
      .is("deleted_at", null)
      .select("id");
    if (updateError) throw updateError;

    return NextResponse.json({ success: true, movedCount: moved?.length ?? 0 });
  } catch (error) {
    console.error("Device recycle-bin action failed:", error);
    return fail("Unable to move this device's repair history to Recycle Bin.", 500);
  }
}
