import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import JobDetails from "@/components/JobDetails";

export const metadata: Metadata = {
  title: "Repair Job Details | MR MOBILE WALA REPAIRS",
  description: "View customer, device, repair and payment details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function JobDetailsPage() {
  await connection();

  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="p-6 text-center text-slate-500">
            Loading job details...
          </div>
        }
      >
        <JobDetails />
      </Suspense>
    </DashboardLayout>
  );
}
