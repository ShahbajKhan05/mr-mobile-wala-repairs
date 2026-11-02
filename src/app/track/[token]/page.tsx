import type { Metadata } from "next";
import PrivateRepairTracker from "./PrivateRepairTracker";

export const metadata: Metadata = {
  title: "Private Repair Tracking | MR MOBILE WALA REPAIRS",
  description: "Privately view your mobile repair progress and updates.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function PrivateTrackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PrivateRepairTracker token={token} />;
}
