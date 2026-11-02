
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Camera,
  Mail,
  Menu,
  Store,
  X,
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const NAV_LINKS = [
  { label: "Home", href: "/", comingSoon: false },
  { label: "Services", href: "/#services", comingSoon: false },
  { label: "Track Repair", href: "/track", comingSoon: false },
  { label: "Warranty Card", href: "/warranty", comingSoon: false },
  { label: "Contact", href: "https://wa.me/919131383323", comingSoon: false },
];

const SOCIAL_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/919131383323",
    icon: "whatsapp",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/mrmobilewala.2.0",
    icon: Camera,
  },
  {
    label: "Email",
    href: "mailto:mrmobilewala610@gmail.com",
    icon: Mail,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  if (pathname?.startsWith("/admin") && pathname !== "/admin-login") {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-2 pt-2 sm:px-5 sm:pt-4">
      <nav className="relative mx-auto flex min-h-[58px] max-w-[1440px] items-center justify-between rounded-[18px] border border-white/80 bg-white/65 px-3 shadow-[0_18px_55px_rgba(39,55,95,0.10)] backdrop-blur-2xl sm:min-h-[76px] sm:rounded-full sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          href="/"
          aria-label="MR MOBILE WALA REPAIRS Home"
          onClick={() => setIsOpen(false)}
          className="relative z-10 flex shrink-0 items-center"
        >
          <Image
            src="/mr-mobile-wala-logo.png"
            alt="MR MOBILE WALA REPAIRS"
            width={190}
            height={65}
            priority
            className="h-auto w-[112px] object-contain sm:w-[150px] lg:w-[165px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 xl:flex">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;

            return (
              <div key={item.label} className="group relative">
                {item.comingSoon ? (
                  <button
                    type="button"
                    disabled
                    title={`${item.label} - Coming Soon`}
                    className="flex cursor-not-allowed items-center gap-1.5 rounded-full px-3 py-3 text-[12px] font-semibold text-[#92928b]"
                  >
                    {item.label}
                    <span className="rounded-full bg-[#f1f0ec] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#85857e]">
                      Soon
                    </span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative flex items-center rounded-full px-4 py-3 text-[12px] font-semibold transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-white/80 hover:text-indigo-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 xl:flex">

          {/* Social Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSocialOpen((prev) => !prev)}
              aria-label="Open contact links"
              aria-expanded={isSocialOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                isSocialOpen
                  ? "border-[#1e1e1e] bg-slate-900 text-white"
                  : "border-slate-200/80 bg-white/60 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              <WhatsAppIcon size={19} />
            </button>

            {isSocialOpen && (
              <div className="absolute right-0 top-[calc(100%+14px)] w-56 overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-2 shadow-[0_20px_60px_rgba(39,55,95,0.16)] backdrop-blur-2xl">
                <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#999990]">
                  Get in touch
                </p>

                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={() => setIsSocialOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#44443e] transition-colors hover:bg-[#f7f7f4]"
                  >
                    {icon === "whatsapp" ? <WhatsAppIcon size={18} /> : label === "Instagram" ? <Camera size={17} /> : <Mail size={17} />}
                    {label}
                    <ArrowUpRight size={14} className="ml-auto text-[#999990]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin-login"
            className="inline-flex min-h-10 items-center justify-center rounded-full px-4 text-xs font-semibold text-[#55554e] transition-colors hover:bg-[#f5f4f0] hover:text-[#1e1e1e]"
          >
            Admin Login
          </Link>

          <Link
            href="/#booking"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-950/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[0_6px_18px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            <Store size={15} />
            Book a Service
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/admin-login"
            className="rounded-full border border-[#e8e7e2] px-3 py-2 text-[10px] font-bold text-[#33332e] transition-colors hover:bg-[#f5f4f0] sm:text-xs"
          >
            Admin
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 ${
              isOpen
                ? "bg-[#eeeeea] text-[#1e1e1e]"
                : "bg-[#1e1e1e] text-white"
            }`}
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-[22px] border border-white/80 bg-white/85 p-4 shadow-[0_20px_60px_rgba(39,55,95,0.16)] backdrop-blur-2xl xl:hidden">

            <div className="mb-3 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999990]">
                Explore MR Mobile Wala
              </span>
              <span className="rounded-full bg-[#f3f2ee] px-2 py-1 text-[9px] font-bold text-[#77776f]">
                MENU
              </span>
            </div>

            <div className="space-y-1">
              {NAV_LINKS.map((item) => (
                <div key={item.label}>
                  {item.comingSoon ? (
                    <div className="flex min-h-[49px] items-center justify-between rounded-xl px-3 text-sm font-semibold text-[#92928b]">
                      {item.label}
                      <span className="rounded-full bg-[#f3f2ee] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#85857e]">
                        Coming Soon
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-[49px] items-center justify-between rounded-xl px-3 text-sm font-semibold text-[#33332e] hover:bg-[#f7f7f4]"
                    >
                      {item.label}
                      <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-[#eeeee9] pt-3">
              <Link
                href="/#booking"
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1e1e1e] text-sm font-bold text-white transition-colors hover:bg-indigo-700"
              >
                <Store size={16} />
                Book a Service
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e7e2] text-[#55554e] transition-colors hover:bg-[#f5f4f0]"
                >
                  {icon === "whatsapp" ? <WhatsAppIcon size={19} /> : label === "Instagram" ? <Camera size={17} /> : <Mail size={17} />}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
