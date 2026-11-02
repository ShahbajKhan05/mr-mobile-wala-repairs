import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShieldCheck, ArrowUpRight, LockKeyhole } from "lucide-react";

export const metadata: Metadata = {
  title: "Digital Warranty Card | MR MOBILE WALA REPAIRS",
  description: "Access your MR MOBILE WALA REPAIRS digital repair warranty card.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function PublicWarrantyPage() {
  return (
    <main className="min-h-screen glass-page px-3 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-700">← Home</Link>
          <Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={170} height={58} className="h-auto w-28 object-contain" priority />
        </header>
        <section className="glass-panel rounded-[20px] p-4 text-center sm:rounded-[26px] sm:p-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ShieldCheck size={28} />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">MR MOBILE WALA REPAIRS</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Your Digital Warranty Card</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your warranty card is securely attached to your private repair tracking link. Open the link shared by our team after your payment is marked as Paid.
          </p>
          <div className="mt-4 rounded-2xl border border-white/80 bg-white/65 p-4 text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><LockKeyhole size={17} className="text-indigo-600" /> Private access protects your repair details</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">For your privacy, warranty cards are not searchable by phone number or job ID on this public page. Use the unique private link sent to you by the shop.</p>
          </div>
          <Link href="/track" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
            Open Private Tracking <ArrowUpRight size={16} />
          </Link>
          <a href="https://wa.me/919131383323?text=Hello%20MR%20MOBILE%20WALA%20REPAIRS%2C%20please%20share%20my%20private%20repair%20tracking%20link%20and%20digital%20warranty%20card." target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100">
            <MessageCircle size={17} /> Request Warranty Link on WhatsApp
          </a>
        </section>
        <p className="mt-4 text-center text-[10px] text-slate-400">7-day repair warranty · Rewa, Madhya Pradesh</p>
      </div>
    </main>
  );
}
