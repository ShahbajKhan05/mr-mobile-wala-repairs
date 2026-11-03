"use client";

import Image from "next/image";
import Link from "next/link";
import { Link2, ShieldCheck, LockKeyhole, ArrowUpRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Navbar from "@/components/Navbar";
import { useCustomerLanguage } from "@/components/CustomerLanguageProvider";

export default function CustomerUtilityPage({ type }: { type: "track" | "warranty" }) {
  const { language } = useCustomerLanguage();
  const hindi = language === "hi";
  const isTrack = type === "track";

  const title = isTrack
    ? (hindi ? "अपनी रिपेयर का स्टेटस देखें" : "Track your repair securely")
    : (hindi ? "आपका डिजिटल वारंटी कार्ड" : "Your Digital Warranty Card");
  const description = isTrack
    ? (hindi ? "आपकी रिपेयर ट्रैकिंग लिंक आपके काम के लिए अलग और सुरक्षित होती है। WhatsApp पर हमारी टीम द्वारा भेजी गई प्राइवेट लिंक खोलें।" : "Your repair tracking link is unique to your job. Open the private link sent to your WhatsApp by MR MOBILE WALA REPAIRS.")
    : (hindi ? "आपका वारंटी कार्ड आपकी प्राइवेट रिपेयर ट्रैकिंग लिंक के साथ सुरक्षित है। पेमेंट Paid होने के बाद हमारी टीम द्वारा भेजी गई लिंक खोलें।" : "Your warranty card is securely attached to your private repair tracking link. Open the link shared by our team after your payment is marked as Paid.");
  const helpTitle = isTrack
    ? (hindi ? "लिंक नहीं मिल रही?" : "Can't find your link?")
    : (hindi ? "आपकी जानकारी सुरक्षित है" : "Private access protects your repair details");
  const helpCopy = isTrack
    ? (hindi ? "WhatsApp पर हमारी टीम को मैसेज करके अपनी प्राइवेट रिपेयर ट्रैकिंग लिंक माँगें।" : "Message our team on WhatsApp and ask for your private repair tracking link.")
    : (hindi ? "आपकी सुरक्षा के लिए, इस पेज पर फोन नंबर या जॉब आईडी से वारंटी कार्ड नहीं खोजा जा सकता। दुकान द्वारा भेजी गई प्राइवेट लिंक का उपयोग करें।" : "For your privacy, warranty cards are not searchable by phone number or job ID on this public page. Use the unique private link sent to you by the shop.");
  const primary = isTrack
    ? (hindi ? "ट्रैकिंग लिंक माँगें" : "Request Tracking Link")
    : (hindi ? "प्राइवेट ट्रैकिंग खोलें" : "Open Private Tracking");
  const secondary = hindi ? "WhatsApp पर वारंटी लिंक माँगें" : "Request Warranty Link on WhatsApp";

  return (
    <>
      <Navbar />
      <main className="min-h-screen glass-page px-3 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-32">
        <div className="mx-auto max-w-lg">
          <header className="mb-4 flex justify-between">
            <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-700">{hindi ? "← होम" : "← Home"}</Link>
            <Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={160} height={54} className="h-auto w-28 object-contain" priority />
          </header>
          <section className="glass-panel rounded-[20px] p-4 text-center sm:rounded-[26px] sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              {isTrack ? <ShieldCheck size={26} /> : <LockKeyhole size={26} />}
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">MR MOBILE WALA REPAIRS</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            <div className="mt-4 rounded-2xl border border-white/80 bg-white/60 p-4 text-left">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                {isTrack ? <Link2 size={17} className="text-indigo-600" /> : <LockKeyhole size={17} className="text-indigo-600" />}
                {helpTitle}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">{helpCopy}</p>
            </div>
            {isTrack ? (
              <a href="https://wa.me/919131383323?text=Hello%20MR%20MOBILE%20WALA%2C%20please%20share%20my%20private%20repair%20tracking%20link." target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                <WhatsAppIcon size={17} /> {primary}
              </a>
            ) : (
              <>
                <Link href="/track" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
                  {primary} <ArrowUpRight size={16} />
                </Link>
                <a href="https://wa.me/919131383323?text=Hello%20MR%20MOBILE%20WALA%20REPAIRS%2C%20please%20share%20my%20private%20repair%20tracking%20link%20and%20digital%20warranty%20card." target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100">
                  <WhatsAppIcon size={17} /> {secondary}
                </a>
              </>
            )}
          </section>
          <p className="mt-4 text-center text-[10px] text-slate-400">
            {hindi ? (isTrack ? "MR MOBILE WALA REPAIRS · रीवा" : "7 दिन की रिपेयर वारंटी · रीवा, मध्य प्रदेश") : (isTrack ? "MR MOBILE WALA REPAIRS · Rewa" : "7-day repair warranty · Rewa, Madhya Pradesh")}
          </p>
        </div>
      </main>
    </>
  );
}
