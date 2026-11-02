"use client";

import { Suspense, useState, type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type DashboardLayoutProps = { children: ReactNode };

function SidebarFallback() {
  return <aside aria-hidden="true" className="fixed inset-y-0 left-0 z-50 hidden w-[270px] border-r border-white/10 bg-[#15192b] lg:block"><div className="h-[76px] border-b border-white/10 px-6 py-6"><div className="h-7 w-36 animate-pulse rounded-lg bg-white/10"/></div><div className="space-y-3 px-4 py-8">{Array.from({length:7}).map((_,index)=><div key={index} className="h-11 animate-pulse rounded-xl bg-white/10"/>)}</div></aside>;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="min-h-screen bg-[#f6f7fb]">
    <Suspense fallback={<SidebarFallback/>}><Sidebar isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)}/></Suspense>
    <div className="min-h-screen lg:pl-[270px]">
      <Header onMenuClick={()=>setSidebarOpen(true)}/>
      <div className="min-h-[calc(100vh-76px)] w-full">{children}</div>
    </div>
  </div>;
}
