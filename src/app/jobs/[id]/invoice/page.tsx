import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import JobInvoice from "@/components/JobInvoice";

export const metadata: Metadata = {
  title: "Repair Invoice | MR MOBILE WALA REPAIRS",
  description: "View and save your mobile repair payment invoice.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InvoicePage() {
  await connection();

  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="p-6 text-center text-slate-500">
            Loading invoice...
          </div>
        }
      >
        <JobInvoice />
      </Suspense>
    </DashboardLayout>
  );
}
