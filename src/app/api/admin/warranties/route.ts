import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const supabase = createSupabaseAdminClient();
    const { data: jobs, error } = await supabase
      .from("repair_jobs")
      .select("job_number,customer_id,brand,model,payment_status,paid_at")
      .eq("payment_status", "Paid")
      .not("paid_at", "is", null)
      .order("paid_at", { ascending: false });
    if (error) throw error;
    if (!jobs?.length) return NextResponse.json({ success: true, warranties: [] });

    const customerIds = [...new Set(jobs.map((job) => job.customer_id))];
    const { data: customers, error: customerError } = await supabase
      .from("customers")
      .select("id,name,phone")
      .in("id", customerIds);
    if (customerError) throw customerError;

    const customerMap = new Map((customers ?? []).map((customer) => [customer.id, customer]));
    const warranties = jobs.map((job) => {
      const customer = customerMap.get(job.customer_id);
      return {
        id: job.job_number,
        customerName: customer?.name ?? "Unknown customer",
        phone: customer?.phone ?? "",
        brand: job.brand,
        model: job.model,
        paymentStatus: job.payment_status,
        paidAt: job.paid_at,
      };
    });
    return NextResponse.json({ success: true, warranties }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin warranty list failed:", error);
    return fail("Unable to load warranty cards.", 500);
  }
}
