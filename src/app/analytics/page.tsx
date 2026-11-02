import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: "Business Analytics | MR MOBILE WALA REPAIRS",
  description:
    "Track mobile repair jobs, revenue, pending payments and inventory performance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <Analytics />
    </DashboardLayout>
  );
}