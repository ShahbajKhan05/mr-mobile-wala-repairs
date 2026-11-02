
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
    number: "01",
    icon: ShieldCheck,
    title: "Trusted Service",
    hindi: "भरोसेमंद सर्विस",
    description: "आपके मोबाइल की पूरी जिम्मेदारी के साथ सेवा।",
  },
  {
    number: "02",
    icon: Wrench,
    title: "Expert Repairs",
    hindi: "एक्सपर्ट रिपेयरिंग",
    description: "मोबाइल की हर समस्या का सही समाधान।",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Quality Products",
    hindi: "बेहतरीन क्वालिटी",
    description: "अच्छे और भरोसेमंद मोबाइल व एक्सेसरीज।",
  },
  {
    number: "04",
    icon: Wallet,
    title: "Fair Pricing",
    hindi: "सही और वाजिब दाम",
    description: "आपके बजट के अनुसार सही कीमत।",
  },
  {
    number: "05",
    icon: Headset,
    title: "Customer Support",
    hindi: "हमेशा आपकी मदद",
    description: "आपकी जरूरत पर हमारी पूरी सहायता।",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="glass-page px-4 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section Heading */}
        <div className="mb-9 text-center sm:mb-14">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
            The MR MOBILE WALA REPAIRS Difference
          </p>

          <h2
            id="why-choose-heading"
            className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl"
          >
            Why Choose{" "}
            <span className="font-serif font-normal italic text-[#765A2B]">
              MR MOBILE WALA REPAIRS?
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            आपके मोबाइल की हर जरूरत के लिए एक भरोसेमंद जगह।
            Quality, care और service — सब एक साथ।
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="glass-card group relative rounded-[24px] p-5 sm:rounded-[28px] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border border-[#E9E5DC] text-[#765A2B] transition-all duration-300 group-hover:border-[#A58A5B] group-hover:bg-[#A58A5B] group-hover:text-white">
                    <Icon size={21} strokeWidth={1.6} />
                  </div>

                  <span className="text-[11px] font-medium tracking-widest text-[#625D52]">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#202B32]">
                  {feature.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-[#765A2B]">
                  {feature.hindi}
                </p>

                <p className="mt-3 text-[13px] leading-6 text-[#626B70]">
                  {feature.description}
                </p>

                <ArrowUpRight
                  size={17}
                  className="absolute bottom-5 right-5 text-[#625D52] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#765A2B] sm:bottom-7 sm:right-7"
                />
              </article>
            );
          })}
        </div>

        {/* Bottom Promise */}
        <div className="mt-8 border-t border-white/70 pt-6 text-center sm:mt-12 sm:pt-8">
          <p className="text-sm font-semibold text-[#202B32]">
            आपकी संतुष्टि, हमारी प्राथमिकता।
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#765A2B]">
            Quality You Trust. Service You Deserve.
          </p>
        </div>

      </div>
    </section>
  );
}