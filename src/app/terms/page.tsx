import type { Metadata } from "next";
import CustomerLegalPage from "@/components/CustomerLegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions for mobile repair, buying and selling services at MR MOBILE WALA REPAIRS.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <CustomerLegalPage type="terms" />;
}
