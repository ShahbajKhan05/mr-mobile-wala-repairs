"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, Smartphone, Users, Package,
  BarChart3, Settings, ChevronRight, X, PlusCircle, Wrench,
} from "lucide-react";

type SidebarProps = { isOpen: boolean; onClose: () => void };

const navigation = [
  { title: "OVERVIEW", items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  { title: "WORKSPACE", items: [
    { name: "All Repair Jobs", href: "/jobs/list", icon: ClipboardList },
    { name: "New Job Card", href: "/jobs", icon: PlusCircle },
    { name: "Devices", href: "/devices", icon: Smartphone },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Parts Inventory", href: "/inventory", icon: Package },
  ]},
  { title: "BUSINESS", items: [
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]},
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/jobs") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => { onClose(); }, [pathname, onClose]);

  return <>
    <button type="button" aria-label="Close navigation overlay" tabIndex={isOpen ? 0 : -1} onClick={onClose} className={`fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} />
    <aside id="admin-sidebar" aria-label="Admin sidebar" aria-hidden={!isOpen} className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col overflow-hidden border-r border-white/10 bg-[#15192b] text-white shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link href="/dashboard" onClick={onClose} className="flex min-w-0 items-center">
          <div><Image src="/mr-mobile-wala-logo.png" alt="MR MOBILE WALA REPAIRS" width={190} height={64} priority className="h-auto w-[174px] object-contain brightness-0 invert"/><p className="mt-0.5 pl-1 text-[9px] font-bold uppercase tracking-[2px] text-slate-400">Repair Management</p></div>
        </Link>
        <button type="button" onClick={onClose} aria-label="Close sidebar" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"><X size={19}/></button>
      </div>
      <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-200"><Wrench size={18}/></span>
        <div className="min-w-0"><p className="text-xs font-bold text-white">Shop workspace</p><p className="mt-0.5 text-[10px] text-slate-400">Manage daily operations</p></div><span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.12)]"/>
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-4 py-7">
        {navigation.map((section)=><div key={section.title}><p className="mb-3 px-3 text-[9px] font-extrabold tracking-[.19em] text-slate-500">{section.title}</p><div className="space-y-1">{section.items.map((item)=>{const Icon=item.icon;const active=isActiveRoute(pathname,item.href);return <Link key={item.href} href={item.href} onClick={onClose} aria-current={active?"page":undefined} className={`group relative flex min-h-11 items-center justify-between rounded-xl px-3 transition-all duration-200 ${active?"bg-indigo-500 text-white shadow-lg shadow-indigo-950/30":"text-slate-400 hover:bg-white/[0.07] hover:text-white"}`}><span className="flex items-center gap-3"><Icon size={18} strokeWidth={active?2.3:1.8}/><span className="text-[12px] font-semibold">{item.name}</span></span>{active?<ChevronRight size={15} className="text-white/80"/>:<span className="h-1.5 w-1.5 rounded-full bg-transparent transition group-hover:bg-slate-500"/>}</Link>})}</div></div>)}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-4"><Link href="/settings" onClick={onClose} className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.07]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-indigo-400 to-violet-600 text-xs font-extrabold text-white">MR</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-white">MR MOBILE WALA</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">Administrator</span></span><Settings size={16} className="text-slate-500 transition group-hover:text-white"/></Link></div>
    </aside>
  </>;
}
