import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import JobWarranty from "@/components/JobWarranty";

export const metadata: Metadata = {
  title: "Digital Warranty Card | MR MOBILE WALA",
  description: "View and print your mobile repair digital warranty card.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WarrantyPage() {
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