import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import JobWarranty from "@/components/JobWarranty";

export const metadata: Metadata = {
  title: "Digital Warranty Card | MR MOBILE WALA REPAIRS",
  description: "View and print your mobile repair digital warranty card.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WarrantyPage() {
  await connection();

  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="p-6 text-center text-slate-500">
            Loading warranty card...
          </div>
        }
      >
        <JobWarranty />
      </Suspense>
    </DashboardLayout>
  );
}
