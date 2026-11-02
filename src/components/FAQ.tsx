
"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  X,
} from "lucide-react";

const FAQS = [
  {
    question: "How can I book a mobile repair?",
    hindi: "मोबाइल रिपेयर कैसे बुक करें?",
    answer:
      "Select Repair Mobile in our booking form, enter your details and submit your request through WhatsApp.",
    answerHindi:
      "बुकिंग फॉर्म में Repair Mobile चुनें, अपनी जानकारी भरें और WhatsApp के जरिए अपनी रिक्वेस्ट भेजें।",
  },
  {
    question: "Do you repair all mobile brands?",
    hindi: "क्या आप सभी ब्रांड के मोबाइल रिपेयर करते हैं?",
    answer:
      "We assist with repairs for popular mobile brands. Contact us with your phone model to confirm service availability.",
    answerHindi:
      "हम लोकप्रिय मोबाइल ब्रांड्स की रिपेयरिंग में सहायता करते हैं। सर्विस की उपलब्धता जानने के लिए अपना मोबाइल मॉडल बताकर संपर्क करें।",
  },
  {
    question: "How much does a mobile repair cost?",
    hindi: "मोबाइल रिपेयर का खर्च कितना होगा?",
    answer:
      "Repair charges depend on your phone model and the actual problem. The estimated cost can be shared after inspection.",
    answerHindi:
      "रिपेयर का खर्च आपके मोबाइल मॉडल और खराबी पर निर्भर करता है। जांच के बाद आपको अनुमानित खर्च बताया जाएगा।",
  },
  {
    question: "Can I buy or sell a used mobile?",
    hindi: "क्या मैं पुराना मोबाइल खरीद या बेच सकता हूँ?",
    answer:
      "Yes! Submit a Buy Mobile or Sell Mobile request through our booking form. Our team will contact you with the next steps.",
    answerHindi:
      "बिल्कुल! हमारे बुकिंग फॉर्म में Buy Mobile या Sell Mobile चुनकर रिक्वेस्ट भेजें। हमारी टीम आगे की जानकारी के लिए आपसे संपर्क करेगी।",
  },
  {
    question: "How can I check my repair status?",
    hindi: "अपने मोबाइल रिपेयर का स्टेटस कैसे चेक करें?",
    answer:
      "Contact our team on WhatsApp with your job card or booking details to get an update.",
    answerHindi:
      "अपने जॉब कार्ड या बुकिंग की जानकारी के साथ WhatsApp पर संपर्क करें और रिपेयर का अपडेट प्राप्त करें।",
  },
  {
    question: "Do you provide a repair warranty?",
    hindi: "क्या रिपेयर पर वारंटी मिलती है?",
    answer:
      "Warranty depends on the repair and parts used. Applicable warranty details will be mentioned on your repair bill.",
    answerHindi:
      "वारंटी रिपेयर और इस्तेमाल किए गए पार्ट्स पर निर्भर करती है। लागू वारंटी की जानकारी आपके रिपेयर बिल पर दी जाएगी।",
  },
];

export default function FAQ() {
  const [fullView, setFullView] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full bg-white/55 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-4xl">

        {/* Compact FAQ Header */}
        <div className="relative overflow-hidden rounded-2xl border border-[#202B32]/10 bg-[#FCFCFB] px-6 py-9 sm:px-10 sm:py-11">

          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#B69A69]/[0.06] blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">

            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-indigo-600">
                Got Questions?
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>

              <p className="mt-3 text-sm font-medium text-indigo-600">
                अक्सर पूछे जाने वाले सवाल
              </p>

              <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                Everything you need to know about our mobile services.
                <br />
                हमारी मोबाइल सर्विस से जुड़ी जरूरी जानकारी यहाँ पाएँ।
              </p>

              <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#A0A09A]">
                {FAQS.length} QUESTIONS · ENGLISH & HINDI
              </p>
            </div>

            {/* Full View Arrow */}
            <button
              type="button"
              onClick={() => setFullView(!fullView)}
              aria-expanded={fullView}
              aria-controls="faq-full-content"
              className="group flex shrink-0 items-center gap-4 rounded-full border border-[#202B32]/15 bg-white/55 py-3 pl-5 pr-3 transition-all duration-300 hover:border-[#B69A69] hover:shadow-[0_8px_25px_rgba(32,43,50,0.07)]"
            >
              <span className="text-left">
                <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                  {fullView ? "Close FAQs" : "Explore Answers"}
                </span>

                <span className="mt-1 block text-xs font-semibold text-slate-900">
                  {fullView ? "BACK TO OVERVIEW" : "CLICK TO FULL VIEW"}
                </span>
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202B32] text-white transition-all duration-300 group-hover:bg-[#A58A5B]">
                {fullView ? (
                  <X size={17} />
                ) : (
                  <ArrowUpRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </span>
            </button>
          </div>

          {/* Bottom indicator */}
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#F0EDE7]">
            <div
              className={`h-full bg-[#B69A69] transition-all duration-500 ${
                fullView ? "w-full" : "w-[12%]"
              }`}
            />
          </div>
        </div>

        {/* Full FAQ View */}
        <div
          id="faq-full-content"
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
            fullView
              ? "mt-8 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="divide-y divide-[#202B32]/10 border-y border-[#202B32]/10">

              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-5 py-6 text-left transition-colors duration-200 hover:text-indigo-600 sm:py-7"
                    >
                      <span className="min-w-0">
                        <span className="mb-2 block text-[9px] font-semibold tracking-[0.2em] text-[#B69A69]">
                          QUESTION 0{index + 1}
                        </span>

                        <span className="block text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                          {faq.question}
                        </span>

                        <span className="mt-1 block text-xs leading-6 text-slate-500 sm:text-sm">
                          {faq.hindi}
                        </span>
                      </span>

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 border-[#A58A5B] bg-[#A58A5B] text-white"
                            : "border-[#202B32]/10 text-slate-900"
                        }`}
                      >
                        <ChevronDown size={17} />
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="max-w-3xl pb-6 pr-8 sm:pb-7">
                          <p className="text-sm leading-7 text-slate-500">
                            {faq.answer}
                          </p>

                          <p className="mt-2 text-sm leading-7 text-slate-500">
                            {faq.answerHindi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-7 text-center text-xs leading-6 text-slate-500">
              Still have questions? Contact us on WhatsApp.
              <br />
              अभी भी कोई सवाल है? WhatsApp पर हमसे संपर्क करें।
            </p>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setFullView(false)}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 transition-colors hover:bg-[#A58A5B]/10"
              >
                <ArrowDown size={14} className="rotate-180" />
                Close Full View
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
