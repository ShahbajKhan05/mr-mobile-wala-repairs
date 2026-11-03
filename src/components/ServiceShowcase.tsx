import Link from "next/link";
import { ArrowUpRight, Wrench, ShoppingBag, RefreshCw, ShieldCheck, Clock3 } from "lucide-react";

const services = [
  {
    icon: Wrench,
    eyebrow: "01 / REPAIR",
    title: "Bring it back\nto brilliant.",
    description: "Display, battery, charging, software and more. Tell us what happened and we’ll help with the next step.",
    action: "Book a repair",
    href: "/?service=repair#booking",
    visual: "bg-[#eaf2ff] text-[#1769c2]",
  },
  {
    icon: ShoppingBag,
    eyebrow: "02 / BUY",
    title: "Find the one\nthat fits you.",
    description: "Share your preferred brand and budget. We’ll help you explore the right phone for your needs.",
    action: "Find a phone",
    href: "/?service=buy#booking",
    visual: "bg-[#f1edff] text-[#7253c6]",
  },
  {
    icon: RefreshCw,
    eyebrow: "03 / SELL",
    title: "A good phone\nhas a next life.",
    description: "Tell us your phone model and condition to start a simple selling enquiry with our team.",
    action: "Sell your phone",
    href: "/?service=sell#booking",
    visual: "bg-[#e8f6ef] text-[#27845b]",
  },
];

export default function ServiceShowcase() {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 bg-[#f5f5f7] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-9 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6e6e73] sm:text-[11px]">One destination. Three ways to help.</p>
            <h2 id="services-heading" className="text-[clamp(2.35rem,6vw,5rem)] font-semibold leading-[0.96] tracking-[-0.075em] text-[#1d1d1f]">
              Your phone&apos;s next
              <br className="hidden sm:block" /> chapter starts here.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#6e6e73] sm:pb-1 sm:text-base sm:leading-7">
            From a careful repair to a new-to-you device, start with what you need.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {services.map(({ icon: Icon, eyebrow, title, description, action, href, visual }) => (
            <article key={eyebrow} className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-[#e5e5ea] bg-white p-5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)] sm:min-h-[450px] sm:rounded-[2rem] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-[0.16em] text-[#86868b]">{eyebrow}</span>
                <span className={\`flex size-12 items-center justify-center rounded-2xl \${visual} transition-transform duration-500 group-hover:scale-110 sm:size-14\`}>
                  <Icon size={23} strokeWidth={1.65} />
                </span>
              </div>
              <div className="mt-12 sm:mt-16">
                <h3 className="whitespace-pre-line text-[clamp(1.8rem,3vw,2.55rem)] font-semibold leading-[1.02] tracking-[-0.065em] text-[#1d1d1f]">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e6e73]">{description}</p>
              </div>
              <Link href={href} className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 pt-8 text-sm font-semibold text-[#0066cc] transition-colors hover:text-[#004f9e]">
                {action}<ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-16 size-52 rounded-full border border-[#f0f0f2] transition-transform duration-700 group-hover:scale-125" />
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-[1.5rem] border border-[#e5e5ea] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.75rem] sm:px-7 sm:py-6">
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]"><ShieldCheck size={20} /></span>
            <div>
              <p className="text-sm font-semibold text-[#1d1d1f]">Already left your phone with us?</p>
              <p className="mt-1 text-xs leading-5 text-[#6e6e73]">Follow its repair progress with your private tracking link.</p>
            </div>
          </div>
          <Link href="/track" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 text-xs font-semibold text-white transition hover:bg-black">
            Track your repair <Clock3 size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
