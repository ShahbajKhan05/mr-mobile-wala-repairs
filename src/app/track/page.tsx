import type { Metadata } from "next";
import CustomerUtilityPage from "@/components/CustomerUtilityPage";

export const metadata: Metadata = {
  title: "Private Repair Tracking | MR MOBILE WALA REPAIRS",
  description: "Open the private repair tracking link shared by MR MOBILE WALA REPAIRS.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <CustomerUtilityPage type="track" />;
}
