import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const { id } = await context.params;
    if (!id || id.length > 120) return fail("Invalid inventory item.");
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("inventory_parts").update({ deleted_at: new Date().toISOString(), deleted_by: "Admin" }).eq("id", id).is("deleted_at", null);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inventory move to recycle bin failed:", error);
    return fail("Unable to move inventory item to Recycle Bin.", 500);
  }
}
