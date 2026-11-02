import type { Metadata } from "next";
import CustomerWarrantyCard from "./CustomerWarrantyCard";

export const metadata: Metadata = {
  title: "Your Digital Warranty Card | MR MOBILE WALA REPAIRS",
  description: "View and print your private digital repair warranty card.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function CustomerWarrantyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <CustomerWarrantyCard token={token} />;
}
