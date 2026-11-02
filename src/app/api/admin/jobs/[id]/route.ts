import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const { id } = await context.params;
    const supabase = createSupabaseAdminClient();
    const { data: job, error } = await supabase.from("repair_jobs").select("*").eq("job_number", id).single();
    if (error || !job) return fail("Repair job not found.", 404);

    const [{ data: customer, error: customerError }, { data: photos, error: photosError }] = await Promise.all([
      supabase.from("customers").select("name,phone").eq("id", job.customer_id).single(),
      supabase.from("job_photos").select("photo_key,file_name,content_type,file_path").eq("job_id", job.id),
    ]);
    if (customerError) throw customerError;
    if (photosError) throw photosError;

    const photoItems = await Promise.all((photos ?? []).map(async (photo) => {
      const { data, error: urlError } = await supabase.storage.from("repair-photos").createSignedUrl(photo.file_path, 300);
      if (urlError) throw urlError;
      return { key: photo.photo_key, name: photo.file_name, type: photo.content_type, url: data.signedUrl };
    }));

    return NextResponse.json({ success: true, job: {
      id: job.job_number, customerName: customer.name, phone: customer.phone,
      brand: job.brand, model: job.model, problem: job.problem, estimate: Number(job.estimate),
      photos: photoItems, status: job.status, paymentStatus: job.payment_status,
      createdAt: job.created_at, paidAt: job.paid_at ?? undefined,
    }});
  } catch (error) {
    console.error("Admin job detail failed:", error);
    return fail("Unable to load repair job.", 500);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = createSupabaseAdminClient();
    const { data: job, error: findError } = await supabase.from("repair_jobs").select("id,status,payment_status,paid_at").eq("job_number", id).single();
    if (findError || !job) return fail("Repair job not found.", 404);

    const updates: Record<string, unknown> = {};
    let eventType = "";
    let description = "";

    if (body.status !== undefined) {
      if (!["Received", "Part Ordered", "Repairing", "Ready"].includes(body.status)) return fail("Invalid repair status.");
      updates.status = body.status;
      eventType = "status_updated";
      description = `Repair status changed from ${job.status} to ${body.status}.`;
    }

    if (body.paymentStatus !== undefined) {
      if (!["Pending", "Paid"].includes(body.paymentStatus)) return fail("Invalid payment status.");
      updates.payment_status = body.paymentStatus;
      updates.paid_at = body.paymentStatus === "Paid"
        ? (job.payment_status === "Paid" && job.paid_at ? job.paid_at : new Date().toISOString())
        : null;
      eventType = "payment_updated";
      description = `Payment marked as ${body.paymentStatus}.`;
      if (body.paymentStatus === "Paid") {
        updates.warranty_days = 30;
        updates.warranty_start_date = new Date().toISOString().slice(0, 10);
        const end = new Date();
        end.setDate(end.getDate() + 30);
        updates.warranty_end_date = end.toISOString().slice(0, 10);
      } else {
        updates.warranty_days = 0;
        updates.warranty_start_date = null;
        updates.warranty_end_date = null;
      }
    }

    if (!Object.keys(updates).length) return fail("No valid changes supplied.");
    const { error: updateError } = await supabase.from("repair_jobs").update(updates).eq("id", job.id);
    if (updateError) throw updateError;
    const { error: eventError } = await supabase.from("job_events").insert({
      job_id: job.id, event_type: eventType, description,
    });
    if (eventError) throw eventError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin job update failed:", error);
    return fail("Unable to update repair job.", 500);
  }
}
