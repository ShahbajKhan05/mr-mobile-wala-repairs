
import type { Metadata } from "next";
import ReadyBillClient from "./ReadyBillClient";

export const metadata: Metadata = {
  title: "Repair Bill & Payment | MR MOBILE WALA",
  description:
    "View your mobile repair invoice, payment status and warranty details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReadyPage() {
  return <ReadyBillClient />;
}
