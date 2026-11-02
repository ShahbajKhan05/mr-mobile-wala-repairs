import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { defaultShopSettings, type ShopSettings } from "@/lib/settings";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("shop_settings").select("data").eq("id", "shop-profile").maybeSingle();
    if (error) throw error;
    return NextResponse.json({ success: true, settings: { ...defaultShopSettings, ...(data?.data ?? {}), shopName: defaultShopSettings.shopName } }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Shop settings load failed:", error);
    return fail("Unable to load shop settings. Run the shared-data migration in Supabase first.", 500);
  }
}

export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const body = await request.json() as Partial<ShopSettings>;
    if (body.warrantyDays !== 7) return fail("Warranty duration is fixed at 7 days.");
    const settings: ShopSettings = {
      ...defaultShopSettings,
      ...body,
      shopName: defaultShopSettings.shopName,
      updatedAt: new Date().toISOString(),
    };
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("shop_settings").upsert({ id: "shop-profile", data: settings, updated_at: settings.updatedAt });
    if (error) throw error;
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Shop settings save failed:", error);
    return fail("Unable to save shop settings.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) return fail("Unauthorized.", 401);
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("shop_settings").delete().eq("id", "shop-profile");
    if (error) throw error;
    return NextResponse.json({ success: true, settings: defaultShopSettings });
  } catch (error) {
    console.error("Shop settings reset failed:", error);
    return fail("Unable to reset shop settings.", 500);
  }
}
