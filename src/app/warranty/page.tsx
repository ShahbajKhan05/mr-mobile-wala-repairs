import type { Metadata } from "next";
import CustomerUtilityPage from "@/components/CustomerUtilityPage";

export const metadata: Metadata = {
  title: "Digital Warranty Card | MR MOBILE WALA REPAIRS",
  description: "Access your MR MOBILE WALA REPAIRS digital repair warranty card.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <CustomerUtilityPage type="warranty" />;
}
