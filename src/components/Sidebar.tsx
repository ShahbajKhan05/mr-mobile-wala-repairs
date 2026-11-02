
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  Smartphone,
  Users,
  Package,
  BarChart3,
  Settings,
  ChevronRight,
  X,
  PlusCircle,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
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
  if (href === "/dashboard" || href === "/jobs") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Close after navigation
  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <button
        type="button"
        aria-label="Close sidebar overlay"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Admin sidebar"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#1E1E1E]/10 bg-[#FAFAF8] shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#1E1E1E]/10 px-5">
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

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1E1E1E]/10 text-[#1E1E1E]/70 transition hover:bg-[#1E1E1E]/5 hover:text-[#1E1E1E] active:scale-95 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-4 py-7"
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

        {/* Shop Profile */}
        <div className="shrink-0 border-t border-[#1E1E1E]/10 p-4">
          <Link
            href="/settings"
            onClick={onClose}
            className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#1E1E1E]/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] text-sm font-bold text-white">
              MR
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1E1E1E]">
                MR MOBILE WALA
              </p>

              <p className="truncate text-xs text-[#1E1E1E]/45">
                Admin Account
              </p>
            </div>

            <Settings
              size={17}
              className="text-[#1E1E1E]/40 transition group-hover:text-[#1E1E1E]"
            />
          </Link>
        </div>
      </aside>
    </>
  );
}
