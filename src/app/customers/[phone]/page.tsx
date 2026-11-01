import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CustomerProfile from "@/components/CustomerProfile";

export const metadata: Metadata = {
  title: "Customer Profile | MR MOBILE WALA",
  description:
    "View customer information, repair history and payment records.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CustomerProfilePage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="p-6 text-center text-slate-500">
            Loading customer profile...
          </div>
        }
      >
        <CustomerProfile />
      </Suspense>
    </DashboardLayout>
  );
}