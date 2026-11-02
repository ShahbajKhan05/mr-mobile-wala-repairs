
"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,

  ShoppingBag,
  Tag,
  Wrench,
  ShieldCheck,
  Smartphone,
  ChevronDown,
} from "lucide-react";

type BookingType = "Buy Mobile" | "Sell Mobile" | "Repair Mobile";

const SERVICES = [
  { label: "Buy Mobile" as const, title: "Buy", subtitle: "Find a phone", icon: ShoppingBag },
  { label: "Sell Mobile" as const, title: "Sell", subtitle: "Get best value", icon: Tag },
  { label: "Repair Mobile" as const, title: "Repair", subtitle: "Fix your phone", icon: Wrench },
];

const PHONE_MODELS: Record<string, string[]> = {
  Apple: [
    "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17",
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15",
    "iPhone 14", "iPhone 13", "iPhone 12", "Other / Not listed",
  ],
  Samsung: [
    "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25",
    "Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23",
    "Galaxy A56", "Galaxy A36", "Galaxy A55",
    "Galaxy M35", "Galaxy M15", "Other / Not listed",
  ],
  Redmi: [
    "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14",
    "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13",
    "Redmi 14C", "Redmi 13", "Other / Not listed",
  ],
  OnePlus: [
    "OnePlus 13", "OnePlus 13R", "OnePlus 12",
    "OnePlus 12R", "OnePlus Nord 4", "OnePlus Nord CE4",
    "Other / Not listed",
  ],
  Vivo: [
    "Vivo X200 Pro", "Vivo X200", "Vivo V50",
    "Vivo V40", "Vivo V30", "Vivo T3",
    "Other / Not listed",
  ],
  OPPO: [
    "OPPO Find X8", "OPPO Reno 13 Pro", "OPPO Reno 13",
    "OPPO Reno 12", "OPPO F27 Pro+", "OPPO A5",
    "Other / Not listed",
  ],
  realme: [
    "realme GT 7 Pro", "realme GT 6", "realme 14 Pro+",
    "realme 14 Pro", "realme 13 Pro+", "realme Narzo 70",
    "Other / Not listed",
  ],
  Motorola: [
    "Motorola Edge 60 Pro", "Motorola Edge 50 Pro",
    "Moto G85", "Moto G64", "Moto G45", "Other / Not listed",
  ],
  Nothing: [
    "Nothing Phone (3)", "Nothing Phone (3a) Pro",
    "Nothing Phone (3a)", "Nothing Phone (2a)",
    "CMF Phone 2 Pro", "Other / Not listed",
  ],
  "Google Pixel": [
    "Pixel 10 Pro XL", "Pixel 10 Pro", "Pixel 10",
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9",
    "Pixel 8", "Other / Not listed",
  ],
};

const BRANDS = [
  "Apple",
  "Samsung",
  "Redmi",
  "OnePlus",
  "Vivo",
  "OPPO",
  "realme",
  "Motorola",
  "Nothing",
  "Google Pixel",
  "Other",
];

const PROBLEMS = [
  "Display",
  "Battery",
  "Charging",
  "Speaker",
  "Camera",
  "Network",
  "Software",
  "Water Damage",
  "Other",
];

const BUDGETS = [
  "Under ₹5,000",
  "₹5k – ₹10k",
  "₹10k – ₹20k",
  "₹20k – ₹35k",
  "₹35k – ₹50k",
  "Above ₹50k",
];

const CONDITIONS = ["Like New", "Good", "Average", "Damaged"];

const PRICES = [
  "Under ₹5,000",
  "₹5k – ₹10k",
  "₹10k – ₹20k",
  "₹20k – ₹30k",
  "Above ₹30k",
  "Not Sure",
];

const inputClass =
  "glass-input h-[52px] w-full appearance-none rounded-xl px-4 pr-10 text-sm text-slate-800 outline-none transition focus:ring-4 focus:ring-indigo-500/10";

const labelClass =
  "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600";

export default function BookingForm() {
  const [bookingType, setBookingType] =
    useState<BookingType>("Repair Mobile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [problem, setProblem] = useState("");
  const [budget, setBudget] = useState("");
  const [condition, setCondition] = useState("Good");
  const [expectedPrice, setExpectedPrice] = useState("");

  const modelOptions = PHONE_MODELS[brand] || [];

  const needsCustomModel =
    brand === "Other" || model === "Other / Not listed";

  const finalModel = needsCustomModel
    ? customModel.trim()
    : model;

  const handleServiceChange = (type: BookingType) => {
    setBookingType(type);
    setProblem("");
    setBudget("");
    setExpectedPrice("");
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    setModel("");
    setCustomModel("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPhone = phone.replace(/\D/g, "");

    if (
      cleanPhone.length !== 10 ||
      !name.trim() ||
      !brand ||
      !finalModel ||
      (bookingType === "Repair Mobile" && !problem)
    ) {
      return;
    }

    const message = [
      "*NEW BOOKING REQUEST - MR MOBILE WALA REPAIRS*",
      "",
      `*Service:* ${bookingType}`,
      `*Customer Name:* ${name.trim()}`,
      `*WhatsApp Number:* ${cleanPhone}`,
      `*Brand:* ${brand}`,
      `*Mobile Model:* ${finalModel}`,
      "",
      ...(bookingType === "Buy Mobile"
        ? [`*Budget:* ${budget || "Not specified"}`]
        : []),
      ...(bookingType === "Sell Mobile"
        ? [
            `*Phone Condition:* ${condition}`,
            `*Expected Price:* ${expectedPrice || "Not sure"}`,
          ]
        : []),
      ...(bookingType === "Repair Mobile"
        ? [`*Problem:* ${problem}`]
        : []),
      "",
      "Please contact me regarding this request.",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/919131383323?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const isFormValid =
    name.trim().length > 0 &&
    /^\d{10}$/.test(phone) &&
    brand.length > 0 &&
    finalModel.length > 0 &&
    (bookingType !== "Repair Mobile" || problem.length > 0);

  return (
    <section
      id="booking"
      className="glass-page w-full px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24"
    >
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 shadow-sm backdrop-blur-xl px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B69A69]" />
            MR MOBILE WALA REPAIRS
          </span>

          <h2 className="text-3xl font-semibold tracking-[-0.055em] text-slate-900 sm:text-4xl md:text-5xl">
            How can we help{" "}
            <span className="font-serif font-normal italic text-[#765A2B]">
              you?
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Just a few quick selections. No complicated form.
          </p>
          <p className="mt-1 text-xs text-[#5E6668]">
            बस कुछ आसान विकल्प चुनें और बुकिंग करें।
          </p>
        </div>

        {/* Booking Card */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel overflow-hidden rounded-[26px] sm:rounded-[32px]"
        >
          {/* Service Selection */}
          <div className="border-b border-white/70 bg-white/30 p-4 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202B32]">
                Choose your service
              </h3>
              <span className="text-[10px] font-semibold text-[#5E6668]">
                STEP 01
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {SERVICES.map(({ label, title, subtitle, icon: Icon }) => {
                const active = bookingType === label;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleServiceChange(label)}
                    aria-pressed={active}
                    className={`relative flex min-h-[105px] flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 sm:min-h-[125px] ${
                      active
                        ? "border-indigo-600 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                        : "border-white/80 bg-white/55 text-slate-700 hover:border-indigo-300 hover:bg-white/85"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.7} />
                    <span className="mt-2 text-xs font-bold sm:text-sm">
                      {title}
                    </span>
                    <span className={`mt-1 text-[9px] sm:text-[10px] ${
                      active ? "text-white/65" : "text-[#5E6668]"
                    }`}>
                      {subtitle}
                    </span>

                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D9C39A] text-[#26343C]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Selection */}
          <div className="space-y-5 p-4 sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#202B32]">
                Choose your phone
              </h3>
              <span className="text-[10px] font-semibold text-[#5E6668]">
                STEP 02
              </span>
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="booking-brand" className={labelClass}>
                Mobile brand *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#765A2B]" size={18} />
                <select
                  id="booking-brand"
                  value={brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className={`${inputClass} pl-11`}
                  required
                >
                  <option value="">Select mobile brand</option>
                  {BRANDS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5E6668]" size={16} />
              </div>
            </div>

            {/* Model */}
            {brand && brand !== "Other" && (
              <div>
                <label htmlFor="booking-model" className={labelClass}>
                  Select model *
                </label>
                <div className="relative">
                  <select
                    id="booking-model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Choose your {brand} model</option>
                    {modelOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5E6668]" size={16} />
                </div>
              </div>
            )}

            {needsCustomModel && (
              <div>
                <label htmlFor="booking-custom-model" className={labelClass}>
                  Enter phone brand / model *
                </label>
                <input
                  id="booking-custom-model"
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="e.g. Nokia G42"
                  maxLength={100}
                  className={inputClass}
                  required
                />
              </div>
            )}

            {/* Repair Problems */}
            {bookingType === "Repair Mobile" && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className={labelClass}>
                    What&apos;s the problem? *
                  </label>
                  <span className="text-[10px] text-[#5E6668]">Select one</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PROBLEMS.map((item) => {
                    const active = problem === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setProblem(item)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition-all ${
                          active
                            ? "border-[#26343C] bg-[#26343C] text-white"
                            : "border-[#EAE8E2] bg-white text-[#59636A] hover:border-[#B69A69]"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Buy Budget */}
            {bookingType === "Buy Mobile" && (
              <div>
                <label className={labelClass}>Your budget</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBudget(budget === item ? "" : item)}
                      aria-pressed={budget === item}
                      className={`rounded-full border px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        budget === item
                          ? "border-[#26343C] bg-[#26343C] text-white"
                          : "border-[#EAE8E2] bg-white text-[#59636A] hover:border-[#B69A69]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sell Options */}
            {bookingType === "Sell Mobile" && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Phone condition</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CONDITIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCondition(item)}
                        aria-pressed={condition === item}
                        className={`rounded-xl border px-3 py-3 text-xs font-semibold transition-all ${
                          condition === item
                            ? "border-[#26343C] bg-[#26343C] text-white"
                            : "border-[#EAE8E2] text-[#59636A] hover:border-[#B69A69]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Expected selling price</label>
                  <div className="flex flex-wrap gap-2">
                    {PRICES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setExpectedPrice(expectedPrice === item ? "" : item)}
                        aria-pressed={expectedPrice === item}
                        className={`rounded-full border px-3.5 py-2.5 text-xs font-semibold transition-all ${
                          expectedPrice === item
                            ? "border-[#26343C] bg-[#26343C] text-white"
                            : "border-[#EAE8E2] text-[#59636A] hover:border-[#B69A69]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="border-t border-white/70 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#202B32]">
                  Your contact details
                </h3>
                <span className="text-[10px] font-semibold text-[#5E6668]">
                  STEP 03
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-name" className={labelClass}>
                    Your name *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    maxLength={60}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="booking-phone" className={labelClass}>
                    WhatsApp number *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className={inputClass}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-white/70 pt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className="group flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-6 text-sm font-bold text-white shadow-[0_16px_35px_rgba(49,46,129,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <WhatsAppIcon size={19} />
                Send Booking on WhatsApp
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-[#899194] sm:text-xs">
                <ShieldCheck size={15} className="shrink-0 text-[#765A2B]" />
                No payment required. We&apos;ll contact you to confirm.
              </div>
            </div>
          </div>
        </form>

        <p className="mt-5 text-center text-[10px] text-[#5E6668]">
          Simple booking · Quick response · Personal assistance
        </p>
      </div>
    </section>
  );
}