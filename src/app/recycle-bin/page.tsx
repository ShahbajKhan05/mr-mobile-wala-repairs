import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import RecycleBin from "@/components/RecycleBin";

export const metadata: Metadata = {
  title: "Recycle Bin | MR MOBILE WALA REPAIRS",
  description: "Restore deleted repair jobs and inventory records.",
  robots: { index: false, follow: false },
};

export default function RecycleBinPage() {
  return <DashboardLayout><RecycleBin /></DashboardLayout>;
}
