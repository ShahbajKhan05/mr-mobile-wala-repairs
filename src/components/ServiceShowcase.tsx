import Link from "next/link";
import { ArrowUpRight, Wrench, ShoppingBag, RefreshCw, ShieldCheck, Clock3 } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Phone Repair",
    simple: "Phone theek karwayein",
    action: "Book karein",
    href: "/?service=repair#booking",
    visual: "bg-[#eaf2ff] text-[#1769c2]",
  },
  {
    icon: ShoppingBag,
    title: "Buy Phone",
    simple: "Naya phone kharidein",
    action: "Phone dekhein",
    href: "/?service=buy#booking",
    visual: "bg-[#f1edff] text-[#7253c6]",
  },
  {
    icon: RefreshCw,
    title: "Sell Phone",
    simple: "Apna phone bechein",
    action: "Phone bechein",
    href: "/?service=sell#booking",
    visual: "bg-[#e8f6ef] text-[#27845b]",
  },
];

export default function ServiceShowcase() {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-20 bg-[#f5f6f8] px-3 py-7 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1769c2] sm:text-xs">Aapko kya karwana hai?</p>
            <h2 id="services-heading" className="mt-1 text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl">
              Apna kaam chunein
            </h2>
          </div>
          <span className="hidden text-xs font-medium text-[#777] sm:block">Bas ek button dabayein</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {services.map(({ icon: Icon, title, simple, action, href, visual }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-[154px] flex-col rounded-2xl border border-[#e5e7eb] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#c8d9f2] hover:shadow-[0_14px_32px_rgba(20,50,90,0.10)] active:scale-[0.98] sm:min-h-[190px] sm:rounded-3xl sm:p-5"
            >
              <span className={"flex size-9 items-center justify-center rounded-xl " + visual + " sm:size-11 sm:rounded-2xl"}>
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="mt-3 text-[13px] font-extrabold leading-tight text-[#1d1d1f] sm:mt-4 sm:text-lg">{title}</span>
              <span className="mt-1 text-[10px] font-medium leading-4 text-[#666] sm:text-sm">{simple}</span>
              <span className="mt-auto flex items-center gap-1 pt-3 text-[10px] font-bold text-[#1769c2] sm:text-xs">
                {action} <ArrowUpRight size={13} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#e1e5eb] bg-white px-3 py-3 sm:mt-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#edf4ff] text-[#1769c2]"><ShieldCheck size={18} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#222] sm:text-sm">Repair ka status dekhna hai?</p>
              <p className="text-[10px] leading-4 text-[#666] sm:text-xs">Apni repair tracking yahan dekhein</p>
            </div>
          </div>
          <Link href="/track" className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#1d1d1f] px-3 text-[10px] font-bold text-white transition hover:bg-[#333] sm:px-4 sm:text-xs">
            Track karein <Clock3 size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
