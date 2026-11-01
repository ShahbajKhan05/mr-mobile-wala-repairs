
import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import JobsList from "@/components/JobsList";

export const metadata: Metadata = {
  title: "All Repair Jobs | MR MOBILE WALA",
  description:
    "View and manage mobile repair jobs, customer details and repair status.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JobsListPage() {
  return (
    <DashboardLayout>
      <JobsList />
    </DashboardLayout>
  );
}
