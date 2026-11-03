import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";

export default function MobileQuickActions() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] flex items-center gap-2 rounded-2xl border border-white/80 bg-white/85 p-2 shadow-[0_14px_45px_rgba(15,23,42,.18)] backdrop-blur-2xl sm:hidden">
      <a
        href="https://wa.me/919131383323"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white transition active:scale-[.98]"
      >
        <MessageCircle size={16} /> WhatsApp
      </a>
      <Link
        href="/#booking"
        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-xs font-bold text-white transition active:scale-[.98]"
      >
        Book a service <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}
