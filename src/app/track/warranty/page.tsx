
import type { Metadata } from "next";
import WarrantyCard from "./WarrantyCard";

export const metadata: Metadata = {
  title: "Digital Warranty Card | MR MOBILE WALA",
  description:
    "View your mobile repair warranty card and warranty validity.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WarrantyPage() {
  return <WarrantyCard />;
}
