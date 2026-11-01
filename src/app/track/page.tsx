
import type { Metadata } from "next";
import CustomerRepairApproval from "./CustomerRepairApproval";

export const metadata: Metadata = {
  title: "Repair Details & Estimate Approval | MR MOBILE WALA",
  description: "View your mobile repair details and review the repair estimate.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackPage() {
  return <CustomerRepairApproval />;
}
