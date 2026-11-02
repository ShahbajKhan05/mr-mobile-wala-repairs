import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createRepairPhotoUrl } from "@/lib/supabase/storage";

export const runtime = "nodejs";

const photoKeys = ["front", "back", "left", "right"] as const;
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);

  try {
    const supabase = createSupabaseAdminClient();
    const { data: jobs, error } = await supabase
      .from("repair_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!jobs?.length) return NextResponse.json({ success: true, jobs: [] });

    const customerIds = [...new Set(jobs.map((job) => job.customer_id))];
    const jobIds = jobs.map((job) => job.id);
    const [{ data: customers, error: customerError }, { data: photos, error: photoError }] =
      await Promise.all([
        supabase.from("customers").select("id,name,phone").in("id", customerIds),
        supabase.from("job_photos").select("id,job_id,photo_key,file_path,file_name,content_type").in("job_id", jobIds),
      ]);

    if (customerError) throw customerError;
    if (photoError) throw photoError;

    const customerMap = new Map((customers ?? []).map((customer) => [customer.id, customer]));
    const jobsWithDetails = await Promise.all(jobs.map(async (job) => {
      const jobPhotos = await Promise.all((photos ?? [])
        .filter((photo) => photo.job_id === job.id)
        .map(async (photo) => ({
          key: photo.photo_key,
          name: photo.file_name,
          type: photo.content_type,
          url: await createRepairPhotoUrl(photo.file_path),
        })));

      const customer = customerMap.get(job.customer_id);
      return {
        id: job.job_number,
        customerName: customer?.name ?? "Unknown customer",
        phone: customer?.phone ?? "",
        brand: job.brand,
        model: job.model,
        problem: job.problem,
        estimate: Number(job.estimate),
        photos: jobPhotos,
        status: job.status,
        paymentStatus: job.payment_status,
        createdAt: job.created_at,
        paidAt: job.paid_at ?? undefined,
        databaseId: job.id,
      };
    }));

    return NextResponse.json({ success: true, jobs: jobsWithDetails });
  } catch (error) {
    console.error("Admin jobs load failed:", error);
    return fail("Unable to load repair jobs.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);

  const supabase = createSupabaseAdminClient();
  let createdJobId: string | null = null;
  const uploadedPaths: string[] = [];

  try {
    const form = await request.formData();
    const customerName = String(form.get("customerName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").replace(/\\D/g, "");
    const brand = String(form.get("brand") ?? "").trim();
    const model = String(form.get("model") ?? "").trim();
    const problem = String(form.get("problem") ?? "").trim();
    const estimate = Number(form.get("estimate"));
    const jobNumber = String(form.get("jobNumber") ?? "").trim();

    if (!customerName || !brand || !model || !problem || !jobNumber || !/^\\d{10}$/.test(phone)) {
      return fail("Please provide valid customer and repair details.");
    }
    if (!Number.isFinite(estimate) || estimate < 0) return fail("Invalid repair estimate.");

    const files = photoKeys.map((key) => ({ key, file: form.get(key) }));
    if (files.some(({ file }) => !(file instanceof File) || file.size === 0)) {
      return fail("All four device photos are required.");
    }
    for (const { file } of files) {
      if (!(file instanceof File) || !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
        return fail("Photos must be JPG, PNG or WebP and under 10 MB each.");
      }
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert({ name: customerName, phone }, { onConflict: "phone" })
      .select("id")
      .single();
    if (customerError) throw customerError;

    const { data: job, error: jobError } = await supabase
      .from("repair_jobs")
      .insert({
        job_number: jobNumber,
        customer_id: customer.id,
        brand,
        model,
        problem,
        estimate,
        status: "Received",
        payment_status: "Pending",
      })
      .select("id")
      .single();
    if (jobError) throw jobError;
    createdJobId = job.id;

    for (const { key, file } of files) {
      if (!(file instanceof File)) continue;
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const filePath = `${job.id}/${key}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("repair-photos")
        .upload(filePath, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      uploadedPaths.push(filePath);

      const { error: photoError } = await supabase.from("job_photos").insert({
        job_id: job.id,
        photo_key: key,
        file_path: filePath,
        file_name: file.name,
        content_type: file.type,
      });
      if (photoError) throw photoError;
    }

    const { error: eventError } = await supabase.from("job_events").insert({
      job_id: job.id,
      event_type: "job_created",
      description: "Repair job card created.",
    });
    if (eventError) throw eventError;

    return NextResponse.json({ success: true, jobNumber }, { status: 201 });
  } catch (error) {
    console.error("Admin job creation failed:", error);
    if (uploadedPaths.length) {
      await supabase.storage.from("repair-photos").remove(uploadedPaths);
    }
    if (createdJobId) {
      await supabase.from("job_photos").delete().eq("job_id", createdJobId);
      await supabase.from("job_events").delete().eq("job_id", createdJobId);
      await supabase.from("repair_jobs").delete().eq("id", createdJobId);
    }
    return fail("Job card could not be saved. Please try again.", 500);
  }
}
