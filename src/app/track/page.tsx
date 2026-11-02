import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Link2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Private Repair Tracking | MR MOBILE WALA REPAIRS",
  description: "Open the private repair tracking link shared by MR MOBILE WALA REPAIRS.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function TrackPage() {
  return (
    <main className="min-h-screen glass-page px-3 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-lg">
        <header className="mb-4 flex justify-between">
          <Link href="/" className="text-xs font-semibold text-slate-600">← Home</Link>
          <Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={160} height={54} className="h-auto w-28 object-contain" priority />
        </header>
        <section className="glass-panel rounded-[20px] p-4 text-center sm:rounded-[26px] sm:p-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <ShieldCheck size={26} />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Private Customer Portal</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Track your repair securely</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your repair tracking link is unique to your job. Open the private link sent to your WhatsApp by MR MOBILE WALA REPAIRS.
          </p>
          <div className="mt-4 rounded-2xl border border-white/80 bg-white/60 p-4 text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><Link2 size={17} className="text-indigo-600" /> Can&apos;t find your link?</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Message our team on WhatsApp and ask for your private repair tracking link.</p>
          </div>
          <a href="https://wa.me/919131383323?text=Hello%20MR%20MOBILE%20WALA%2C%20please%20share%20my%20private%20repair%20tracking%20link." target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700">
            <WhatsAppIcon size={17} /> Request Tracking Link
          </a>
        </section>
        <p className="mt-4 text-center text-[10px] text-slate-400">MR MOBILE WALA REPAIRS . Rewa</p>
      </div>
    </main>
  );
}
