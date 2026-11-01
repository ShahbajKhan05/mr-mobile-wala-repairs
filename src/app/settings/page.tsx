
import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Settings from "@/components/Settings";

export const metadata: Metadata = {
  title: "Shop Settings | MR MOBILE WALA",
  description:
    "Manage shop profile, contact details, payment preferences and warranty settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Settings />
    </DashboardLayout>
  );
}
