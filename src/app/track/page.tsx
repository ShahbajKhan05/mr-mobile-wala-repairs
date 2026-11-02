import type { Metadata } from "next";
import CustomerRepairTracker from "./CustomerRepairTracker";

export const metadata: Metadata = {
  title: "Track Your Mobile Repair | MR MOBILE WALA REPAIRS",
  description: "Securely check your mobile repair progress, payment status and digital warranty.",
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return <CustomerRepairTracker />;
}
