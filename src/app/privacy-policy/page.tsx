import type { Metadata } from "next";
import CustomerLegalPage from "@/components/CustomerLegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy of MR MOBILE WALA REPAIRS and understand how your booking information is handled.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <CustomerLegalPage type="privacy" />;
}
