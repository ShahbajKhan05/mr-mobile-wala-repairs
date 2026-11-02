import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ phone: string }> }
) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const { phone: rawPhone } = await context.params;
    const phone = rawPhone.replace(/\D/g, "").slice(-10);
    if (!/^\d{10}$/.test(phone)) return fail("Invalid customer phone number.");

    const supabase = createSupabaseAdminClient();
    const { data: customers, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone);
    if (customerError) throw customerError;
    const customerIds = (customers ?? []).map((customer) => customer.id);
    if (!customerIds.length) return fail("Customer not found.", 404);

    const { data: jobs, error: jobsError } = await supabase
      .from("repair_jobs")
      .select("id")
      .in("customer_id", customerIds)
      .is("deleted_at", null);
    if (jobsError) throw jobsError;
    const ids = (jobs ?? []).map((job) => job.id);
    if (!ids.length) return fail("No active repair jobs found for this customer.", 404);

    const { data: moved, error: updateError } = await supabase
      .from("repair_jobs")
      .update({ deleted_at: new Date().toISOString(), deleted_by: "Admin" })
      .in("id", ids)
      .is("deleted_at", null)
      .select("id");
    if (updateError) throw updateError;

    return NextResponse.json({ success: true, movedCount: moved?.length ?? 0 });
  } catch (error) {
    console.error("Customer recycle-bin action failed:", error);
    return fail("Unable to move this customer's repair history to Recycle Bin.", 500);
  }
}
