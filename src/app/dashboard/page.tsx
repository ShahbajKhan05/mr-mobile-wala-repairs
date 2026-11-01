import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | MR MOBILE WALA REPAIRS",
  description: "Manage your mobile repair shop.",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}