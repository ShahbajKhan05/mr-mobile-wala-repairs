import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobNumber = String(body.jobNumber ?? "").trim().toUpperCase();
    const phone = String(body.phone ?? "").replace(/\D/g, "").slice(-10);
    if (!jobNumber || !/^\d{10}$/.test(phone)) return NextResponse.json({ success: false, message: "Enter a valid job number and 10-digit mobile number." }, { status: 400 });
    const supabase = createSupabaseAdminClient();
    const { data: job, error } = await supabase.from("repair_jobs").select("id,job_number,customer_id,brand,model,problem,estimate,status,payment_status,created_at,warranty_days,warranty_start_date,warranty_end_date").eq("job_number", jobNumber).maybeSingle();
    if (error) throw error;
    if (!job) return NextResponse.json({ success: false, message: "No repair found. Check your job number and mobile number." }, { status: 404 });
    const { data: customer, error: customerError } = await supabase.from("customers").select("name,phone").eq("id", job.customer_id).maybeSingle();
    if (customerError) throw customerError;
    const savedPhone = String(customer?.phone ?? "").replace(/\D/g, "").slice(-10);
    if (!customer || savedPhone !== phone) return NextResponse.json({ success: false, message: "No repair found. Check your job number and mobile number." }, { status: 404 });
    const { data: events, error: eventsError } = await supabase.from("job_events").select("event_type,description,created_at").eq("job_id", job.id).order("created_at", { ascending: true });
    if (eventsError) throw eventsError;
    return NextResponse.json({ success: true, job: { jobNumber: job.job_number, customerName: customer.name, brand: job.brand, model: job.model, problem: job.problem, estimate: Number(job.estimate), status: job.status, paymentStatus: job.payment_status, createdAt: job.created_at, warrantyDays: job.warranty_days ?? 0, warrantyStartDate: job.warranty_start_date, warrantyEndDate: job.warranty_end_date, events: events ?? [] } });
  } catch (error) {
    console.error("Customer repair tracking failed:", error);
    return NextResponse.json({ success: false, message: "Unable to check repair right now. Please try again." }, { status: 500 });
  }
}
