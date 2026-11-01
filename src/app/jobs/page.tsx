
import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import NewJobCard from "../../components/NewJobCard";

export const metadata: Metadata = {
  title: "New Job Card | MR MOBILE WALA",
  description:
    "Create mobile repair job cards, add customer and device details, and prepare repair estimates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JobsPage() {
  return (
    <DashboardLayout>
      <NewJobCard />
    </DashboardLayout>
  );
}
