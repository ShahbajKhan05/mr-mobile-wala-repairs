import type { Metadata } from "next";
import CustomerInvoice from "./CustomerInvoice";

export const metadata: Metadata = {
  title: "Repair Invoice | MR MOBILE WALA REPAIRS",
  description: "View and print your paid repair invoice.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function CustomerInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <CustomerInvoice token={token} />;
}
