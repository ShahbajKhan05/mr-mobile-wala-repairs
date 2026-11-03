import {
  ShieldCheck,
  Wrench,
  BadgeCheck,
  Wallet,
  Headset,
  ArrowUpRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Bharose ke saath",
    english: "Service you can trust",
    description: "Aapke phone ko dhyan se handle karte hain.",
    tone: "bg-[#eaf2ff] text-[#1769c2]",
  },
  {
    icon: Wrench,
    title: "Phone ki sahi repair",
    english: "Repair made simple",
    description: "Problem samjhein, phir repair ka raasta chunein.",
    tone: "bg-[#f0edff] text-[#7253c6]",
  },
  {
    icon: Wallet,
    title: "Saaf aur sahi daam",
    english: "Clear pricing",
    description: "Kaam shuru karne se pehle estimate samjhein.",
    tone: "bg-[#e8f6ef] text-[#27845b]",
  },
  {
    icon: BadgeCheck,
    title: "Achhe phone ke options",
    english: "Buy with confidence",
    description: "Phone kharidne ya bechne mein madad paayein.",
    tone: "bg-[#fff3e5] text-[#b56b1c]",
  },
  {
    icon: Headset,
    title: "Madad paas hi hai",
    english: "We're easy to reach",
    description: "Sawaal ho to seedha WhatsApp par baat karein.",
    tone: "bg-[#e9f5f8] text-[#26778a]",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why"
      aria-labelledby="why-choose-heading"
      className="glass-page px-3 py-7 sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-5 grid gap-2 sm:mb-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1769c2] sm:text-xs">
              Aapka phone, hamari zimmedari
            </p>
            <h2 id="why-choose-heading" className="mt-1 text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl">
              Humein kyun chunein?
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-[#666] sm:text-sm">
              Seedhi baat, saaf jaankari aur zaroorat par madad.
            </p>
          </div>
          <span className="hidden rounded-full border border-[#e5e7eb] bg-white px-3 py-2 text-[11px] font-semibold text-[#555] sm:inline-flex">
            MR MOBILE WALA REPAIRS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {FEATURES.map(({ icon: Icon, title, english, description, tone }, index) => (
            <article
              key={title}
              className="group relative min-h-[145px] overflow-hidden rounded-2xl border border-[#e7e9ed] bg-white p-3 shadow-[0_3px_16px_rgba(20,35,60,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,35,60,0.09)] sm:min-h-[178px] sm:rounded-3xl sm:p-4"
            >
              <div className="flex items-center justify-between">
                <span className={"flex size-9 items-center justify-center rounded-xl " + tone + " sm:size-10"}>
                  <Icon size={19} strokeWidth={2} />
                </span>
                <span className="text-[10px] font-bold tabular-nums text-[#b0b2b8]">0{index + 1}</span>
              </div>
              <h3 className="mt-3 text-[13px] font-extrabold leading-tight text-[#202124] sm:text-sm">{title}</h3>
              <p className="mt-1 text-[10px] font-semibold text-[#1769c2] sm:text-[11px]">{english}</p>
              <p className="mt-2 text-[10px] leading-[1.55] text-[#666a73] sm:text-xs">{description}</p>
              <ArrowUpRight size={14} className="absolute bottom-3 right-3 text-[#a0a3aa] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1769c2]" />
            </article>
          ))}
        </div>

        <a
          href="https://wa.me/919131383323"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-[#1d1d1f] px-4 py-3 text-white transition hover:bg-[#303036] sm:mt-4 sm:px-5"
        >
          <span className="min-w-0">
            <span className="block text-xs font-bold sm:text-sm">Koi sawaal hai? Humse baat karein.</span>
            <span className="mt-0.5 block text-[10px] text-white/65 sm:text-xs">WhatsApp par seedha message bhejein</span>
          </span>
          <span className="shrink-0 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-[#1d1d1f]">WhatsApp ↗</span>
        </a>
      </div>
    </section>
  );
}
