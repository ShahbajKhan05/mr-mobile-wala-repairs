import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import WarrantyCards from "@/components/WarrantyCards";

export const metadata: Metadata = {
  title: "Warranty Cards | MR MOBILE WALA REPAIRS",
  description: "Manage paid repair warranty cards.",
  robots: { index: false, follow: false },
};

export default function AdminWarrantyPage() {
  return <DashboardLayout><WarrantyCards /></DashboardLayout>;
}
