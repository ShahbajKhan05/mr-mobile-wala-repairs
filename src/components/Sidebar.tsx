"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  Wrench,
  ShieldCheck,
} from "lucide-react";

type SidebarProps = { isOpen: boolean; onClose: () => void };

const navigation = [
  { title: "OVERVIEW", items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    title: "WORKSPACE",
    items: [
      { name: "All Repair Jobs", href: "/jobs/list", icon: ClipboardList },
      { name: "New Job Card", href: "/jobs", icon: PlusCircle },
      { name: "Devices", href: "/devices", icon: Smartphone },
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Parts Inventory", href: "/inventory", icon: Package },
      { name: "Warranty Cards", href: "/admin-warranty", icon: ShieldCheck },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/jobs") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation overlay"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        id="admin-sidebar"
        aria-label="Admin sidebar"
        aria-hidden={!isOpen && !isDesktop}
        inert={!isOpen && !isDesktop}
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(292px,88vw)] flex-col overflow-hidden border-r border-slate-200/80 bg-white text-slate-800 shadow-2xl transition-transform duration-300 ease-out lg:w-[270px] lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="relative flex h-[64px] shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:h-[72px] sm:px-5">
          <Link href="/dashboard" onClick={onClose} className="flex min-w-0 items-center">
            <div>
              <Image
                src="/mr-mobile-wala-logo.png"
                alt="MR MOBILE WALA REPAIRS"
                width={190}
                height={64}
                priority
                className="h-auto w-[164px] object-contain"
              />
              <p className="mt-0.5 pl-1 text-[9px] font-bold uppercase tracking-[2px] text-slate-500">
                Repair Management
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mx-3 mt-3 flex shrink-0 items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2.5 sm:mx-4 sm:mt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <Wrench size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800">Shop workspace</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Manage daily operations</p>
          </div>
          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" />
        </div>

        <nav
          aria-label="Main navigation"
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:space-y-5 sm:px-4"
        >
          {navigation.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[9px] font-extrabold tracking-[.19em] text-slate-400">
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
                      className={`group relative flex min-h-11 items-center justify-between rounded-xl px-3 transition-colors duration-150 ${active ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"}`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
                        <span className="truncate text-[12px] font-semibold">{item.name}</span>
                      </span>
                      {active ? (
                        <ChevronRight size={15} className="shrink-0 text-white/90" />
                      ) : (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-transparent transition group-hover:bg-slate-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-100 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:p-4">
          <Link
            href="/settings"
            onClick={onClose}
            className="group flex min-h-12 items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-extrabold text-white">
              MR
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-slate-800">
                MR MOBILE WALA REPAIRS
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                Administrator
              </span>
            </span>
            <Settings size={16} className="shrink-0 text-slate-400 transition group-hover:text-indigo-600" />
          </Link>
        </div>
      </aside>
    </>
  );
}
