import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createRepairPhotoUrl } from "@/lib/supabase/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token || token.length < 40 || token.length > 100) {
      return NextResponse.json({ success: false, message: "This private tracking link is invalid or expired." }, { status: 404 });
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const supabase = createSupabaseAdminClient();
    const now = new Date().toISOString();

    const { data: access, error: accessError } = await supabase
      .from("customer_access_tokens")
      .select("id,job_id")
      .eq("token_hash", tokenHash)
      .is("revoked_at", null)
      .gt("expires_at", now)
      .maybeSingle();

    if (accessError) throw accessError;
    if (!access) {
      return NextResponse.json({ success: false, message: "This private tracking link is invalid or expired. Please contact the shop for a new link." }, { status: 404 });
    }

    const [{ data: job, error: jobError }, { data: events, error: eventsError }, { data: photos, error: photosError }] = await Promise.all([
      supabase.from("repair_jobs")
        .select("id,job_number,customer_id,brand,model,problem,estimate,status,payment_status,created_at,paid_at,warranty_days,warranty_start_date,warranty_end_date,pickup_status")
        .eq("id", access.job_id)
        .maybeSingle(),
      supabase.from("job_events")
        .select("event_type,description,created_at")
        .eq("job_id", access.job_id)
        .order("created_at", { ascending: true }),
      supabase.from("job_photos")
        .select("photo_key,file_name,content_type,file_path")
        .eq("job_id", access.job_id),
    ]);

    if (jobError) throw jobError;
    if (eventsError) throw eventsError;
    if (photosError) throw photosError;
    if (!job) {
      return NextResponse.json({ success: false, message: "Repair record not found." }, { status: 404 });
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("name")
      .eq("id", job.customer_id)
      .maybeSingle();
    if (customerError) throw customerError;

    const safePhotos = await Promise.all((photos ?? []).map(async (photo) => ({
      key: photo.photo_key,
      name: photo.file_name,
      type: photo.content_type,
      url: await createRepairPhotoUrl(photo.file_path),
    })));

    const warrantyActive = job.payment_status === "Paid" && Boolean(job.paid_at);
    const warrantyStart = warrantyActive ? (job.warranty_start_date || new Date(job.paid_at).toISOString().slice(0, 10)) : null;
    const warrantyEnd = warrantyActive ? (() => {
      if (job.warranty_end_date) return job.warranty_end_date;
      const expiry = new Date(job.paid_at);
      expiry.setUTCDate(expiry.getUTCDate() + 7);
      return expiry.toISOString().slice(0, 10);
    })() : null;

    return NextResponse.json({
      success: true,
      job: {
        jobNumber: job.job_number,
        customerName: customer?.name ?? "Customer",
        brand: job.brand,
        model: job.model,
        problem: job.problem,
        estimate: Number(job.estimate),
        status: job.status,
        paymentStatus: job.payment_status,
        pickupStatus: job.pickup_status ?? "Pending",
        createdAt: job.created_at,
        paidAt: job.paid_at,
        warrantyDays: warrantyActive ? 7 : 0,
        warrantyStartDate: warrantyStart,
        warrantyEndDate: warrantyEnd,
        photos: safePhotos,
        events: events ?? [],
      },
    }, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  } catch (error) {
    console.error("Private customer tracking failed:", error);
    return NextResponse.json({ success: false, message: "Unable to load repair details right now. Please try again." }, { status: 500 });
  }
}
