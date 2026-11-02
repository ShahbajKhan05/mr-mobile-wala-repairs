import Link from "next/link";
import { ArrowUpRight, Wrench, ShoppingBag, RefreshCw, ShieldCheck, Clock3 } from "lucide-react";

const services = [
  { icon: Wrench, eyebrow: "REPAIR", title: "Expert mobile repair", description: "Display, battery, charging, software and other phone repair enquiries handled with care.", action: "Book a repair", href: "/#booking", tone: "from-indigo-500/15 to-sky-400/10" },
  { icon: ShoppingBag, eyebrow: "BUY", title: "Find your next phone", description: "Tell us your preferred brand and budget. We’ll help you explore available options.", action: "Explore buying", href: "/#booking", tone: "from-violet-500/15 to-fuchsia-400/10" },
  { icon: RefreshCw, eyebrow: "SELL", title: "Sell your old phone", description: "Share your phone model and condition to start a selling enquiry with our team.", action: "Start selling", href: "/#booking", tone: "from-cyan-500/15 to-blue-400/10" },
];

export default function ServiceShowcase() {
  return (
    <section id="services" className="glass-page scroll-mt-28 px-4 py-10 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600 shadow-sm backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-indigo-500" /> One place, all phone needs
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.055em] text-slate-900 sm:text-5xl">
            What can we help <span className="text-indigo-600">you with?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Choose a service and send your request directly to our team on WhatsApp.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map(({ icon: Icon, eyebrow, title, description, action, href, tone }) => (
            <article key={eyebrow} className="glass-card group relative overflow-hidden rounded-[20px] p-4 sm:rounded-[28px] sm:p-8">
              <div className={`pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br ${tone} blur-2xl transition-transform duration-500 group-hover:scale-125`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.22em] text-indigo-600">{eyebrow}</span>
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-indigo-600 shadow-sm"><Icon size={22} /></div>
                </div>
                <h3 className="mt-5 text-lg sm:mt-8 sm:text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">{description}</p>
                <Link href={href} className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-3 text-xs font-bold text-indigo-700 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white">
                  {action}<ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="glass-panel mt-4 flex flex-col gap-3 rounded-2xl p-4 sm:mt-6 sm:gap-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck size={21} /></div>
            <div><p className="text-sm font-semibold text-slate-800">Repair progress, made simple</p><p className="mt-1 text-xs text-slate-500">Already submitted a repair? Check its latest status online.</p></div>
          </div>
          <Link href="/track" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700">Track your repair <Clock3 size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
