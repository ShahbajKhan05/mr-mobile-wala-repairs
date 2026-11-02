import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type Part = {
  id: string; name: string; category: string; sku: string; quantity: number;
  minStock: number; purchasePrice: number; sellingPrice: number; supplier: string;
  createdAt: string; updatedAt: string;
};

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function validPart(value: unknown): value is Part {
  if (!value || typeof value !== "object") return false;
  const part = value as Partial<Part>;
  return typeof part.id === "string" && !!part.id.trim()
    && typeof part.name === "string" && !!part.name.trim()
    && typeof part.category === "string"
    && typeof part.sku === "string"
    && Number.isInteger(part.quantity) && Number(part.quantity) >= 0
    && Number.isInteger(part.minStock) && Number(part.minStock) >= 0
    && Number.isFinite(part.purchasePrice) && Number(part.purchasePrice) >= 0
    && Number.isFinite(part.sellingPrice) && Number(part.sellingPrice) >= 0
    && typeof part.supplier === "string"
    && typeof part.createdAt === "string"
    && typeof part.updatedAt === "string";
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("inventory_parts").select("data");
    if (error) throw error;
    const parts = (data ?? []).map((row) => row.data as Part).sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ success: true, parts }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Inventory load failed:", error);
    return fail("Unable to load inventory. Run the shared-data migration in Supabase first.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const part = await request.json();
    if (!validPart(part)) return fail("Please provide valid inventory details.");
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("inventory_parts").upsert({ id: part.id, data: part, updated_at: part.updatedAt });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inventory save failed:", error);
    return fail("Unable to save inventory item.", 500);
  }
}
