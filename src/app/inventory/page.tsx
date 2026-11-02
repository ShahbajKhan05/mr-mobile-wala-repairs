
import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import Inventory from "@/components/Inventory";

export const metadata: Metadata = {
  title: "Parts Inventory | MR MOBILE WALA REPAIRS",
  description:
    "Manage mobile repair spare parts, stock quantities, suppliers, purchase prices and low stock alerts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InventoryPage() {
  return (
    <DashboardLayout>
      <Inventory />
    </DashboardLayout>
  );
}
