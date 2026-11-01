"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Smartphone,
  Users,
  Package,
  BarChart3,
  Settings,
  Headphones,
  ChevronRight,
  X,
  PlusCircle,
} from "lucide-react";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      {
        name: "All Repair Jobs",
        href: "/jobs/list",
        icon: ClipboardList,
      },
      {
        name: "New Job Card",
        href: "/jobs",
        icon: PlusCircle,
      },
      {
        name: "Devices",
        href: "/devices",
        icon: Smartphone,
      },
      {
        name: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        name: "Parts Inventory",
        href: "/inventory",
        icon: Package,
      },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (href === "/jobs") {
    return pathname === "/jobs";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#1E1E1E]/10 bg-[#FAFAF8] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center justify-between border-b border-[#1E1E1E]/10 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center"
          >
            <div>
              <Image
                src="/mr-mobile-wala-logo.png"
                alt="MR MOBILE WALA"
                width={190}
                height={64}
                priority
                className="h-auto w-[180px] object-contain"
              />

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[2px] text-[#1E1E1E]/45">
                Shop Management
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-[#1E1E1E]/60 transition hover:bg-[#1E1E1E]/5 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-7 overflow-y-auto px-4 py-7"
        >
          {navigation.map((section) => (
            <div key={section.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.5px] text-[#1E1E1E]/40">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-200 ${
                        active
                          ? "bg-[#1E1E1E] text-white shadow-sm"
                          : "text-[#1E1E1E]/60 hover:bg-[#1E1E1E]/5 hover:text-[#1E1E1E]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          size={19}
                          strokeWidth={active ? 2.3 : 1.9}
                        />

                        <span className="text-[13px] font-semibold">
                          {item.name}
                        </span>
                      </span>

                      {active && (
                        <ChevronRight
                          size={16}
                          className="text-white/70"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Support */}
        <div className="px-4 pb-5">
          <div className="rounded-2xl bg-[#1E1E1E] p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Headphones size={19} />
            </div>

            <p className="text-sm font-bold">Need help?</p>

            <p className="mt-1 text-xs leading-relaxed text-white/55">
              Manage your repair shop with confidence.
            </p>

            <a
              href="https://wa.me/919131383323"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Shop Profile */}
        <div className="border-t border-[#1E1E1E]/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E1E1E] text-sm font-bold text-white">
              MR
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1E1E1E]">
                MR MOBILE WALA
              </p>

              <p className="truncate text-xs text-[#1E1E1E]/45">
                Owner Account
              </p>
            </div>

            <Settings size={17} className="text-[#1E1E1E]/40" />
          </div>
        </div>
      </aside>
    </>
  );
}