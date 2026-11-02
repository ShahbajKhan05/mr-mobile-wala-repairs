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
    const [{ data: jobs, error: jobsError }, { data: parts, error: partsError }] = await Promise.all([
      supabase.from("repair_jobs").select("id,job_number,brand,model,problem,created_at,deleted_at,deleted_by,customer_id").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
      supabase.from("inventory_parts").select("id,data,deleted_at,deleted_by").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
    ]);
    if (jobsError) throw jobsError;
    if (partsError) throw partsError;

    const customerIds = [...new Set((jobs ?? []).map((job) => job.customer_id))];
    const { data: customers, error: customersError } = customerIds.length
      ? await supabase.from("customers").select("id,name,phone").in("id", customerIds)
      : { data: [], error: null };
    if (customersError) throw customersError;
    const customerMap = new Map((customers ?? []).map((customer) => [customer.id, customer]));

    const items = [
      ...(jobs ?? []).map((job) => {
        const customer = customerMap.get(job.customer_id);
        return {
          id: job.id,
          type: "job" as const,
          title: job.job_number,
          subtitle: [customer?.name ?? "Unknown customer", job.brand, job.model].filter(Boolean).join(" • "),
          detail: job.problem,
          deletedAt: job.deleted_at,
          deletedBy: job.deleted_by ?? "Admin",
        };
      }),
      ...(parts ?? []).map((part) => ({
        id: part.id,
        type: "inventory" as const,
        title: part.data?.name ?? part.id,
        subtitle: part.data?.category ?? "Inventory item",
        detail: part.data?.sku ? `SKU: ${part.data.sku}` : "Spare part",
        deletedAt: part.deleted_at,
        deletedBy: part.deleted_by ?? "Admin",
      })),
    ].sort((a, b) => new Date(b.deletedAt ?? 0).getTime() - new Date(a.deletedAt ?? 0).getTime());

    return NextResponse.json({ success: true, items }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Recycle bin load failed:", error);
    return fail("Unable to load Recycle Bin. Apply the recycle-bin migration in Supabase first.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const body = await request.json() as { action?: string; id?: string; type?: string };
    if (!body.id || body.id.length > 120 || !["job", "inventory"].includes(body.type ?? "")) {
      return fail("Invalid recycle-bin item.");
    }
    if (!["restore", "permanent-delete"].includes(body.action ?? "")) return fail("Invalid action.");

    const supabase = createSupabaseAdminClient();
    const table = body.type === "job" ? "repair_jobs" : "inventory_parts";
    if (body.action === "restore") {
      const { data, error } = await supabase.from(table)
        .update({ deleted_at: null, deleted_by: null })
        .eq("id", body.id)
        .not("deleted_at", "is", null)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return fail("Item not found or already restored.", 404);
      return NextResponse.json({ success: true });
    }

    if (body.type === "inventory") {
      const { error } = await supabase.from("inventory_parts").delete().eq("id", body.id).not("deleted_at", "is", null);
      if (error) throw error;
    } else {
      const { data: job, error: jobError } = await supabase.from("repair_jobs")
        .select("id")
        .eq("id", body.id)
        .not("deleted_at", "is", null)
        .maybeSingle();
      if (jobError) throw jobError;
      if (!job) return fail("Item not found.", 404);

      const { data: photos, error: photosError } = await supabase.from("job_photos").select("file_path").eq("job_id", job.id);
      if (photosError) throw photosError;
      const paths = (photos ?? []).map((photo) => photo.file_path).filter(Boolean);
      if (paths.length) {
        const { error: storageError } = await supabase.storage.from("repair-photos").remove(paths);
        if (storageError) throw storageError;
      }
      const { error: tokenError } = await supabase.from("customer_access_tokens").delete().eq("job_id", job.id);
      if (tokenError) throw tokenError;
      const { error: photoRowsError } = await supabase.from("job_photos").delete().eq("job_id", job.id);
      if (photoRowsError) throw photoRowsError;
      const { error: eventError } = await supabase.from("job_events").delete().eq("job_id", job.id);
      if (eventError) throw eventError;
      const { error: deleteError } = await supabase.from("repair_jobs").delete().eq("id", job.id);
      if (deleteError) throw deleteError;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Recycle bin action failed:", error);
    return fail("Unable to complete this Recycle Bin action. Related records may still be linked.", 500);
  }
}
