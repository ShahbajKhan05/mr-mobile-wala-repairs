import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id: jobNumber } = await context.params;
    const supabase = createSupabaseAdminClient();
    const { data: job, error: jobError } = await supabase
      .from("repair_jobs")
      .select("id")
      .eq("job_number", jobNumber)
      .maybeSingle();

    if (jobError) throw jobError;
    if (!job) return NextResponse.json({ success: false, message: "Repair job not found." }, { status: 404 });

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error: insertError } = await supabase.from("customer_access_tokens").insert({
      job_id: job.id,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    });
    if (insertError) throw insertError;

    const { error: revokeError } = await supabase
      .from("customer_access_tokens")
      .update({ revoked_at: new Date().toISOString() })
      .eq("job_id", job.id)
      .neq("token_hash", tokenHash)
      .is("revoked_at", null);
    if (revokeError) throw revokeError;

    return NextResponse.json({
      success: true,
      trackingUrl: `${request.nextUrl.origin}/track/${token}`,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Private tracking link generation failed:", error);
    return NextResponse.json({ success: false, message: "Unable to generate a private tracking link." }, { status: 500 });
  }
}
