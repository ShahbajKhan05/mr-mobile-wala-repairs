
import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Devices from "@/components/Devices";

export const metadata: Metadata = {
  title: "Devices Management | MR MOBILE WALA",
  description:
    "Manage mobile devices, view repair counts, track device status and access repair history.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevicesPage() {
  return (
    <DashboardLayout>
      <Devices />
    </DashboardLayout>
  );
}
