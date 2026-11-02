
import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Customers from "@/components/Customers";

export const metadata: Metadata = {
  title: "Customers | MR MOBILE WALA REPAIRS",
  description:
    "Manage customer details, repair history, WhatsApp contacts and payment records.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <Customers />
    </DashboardLayout>
  );
}
