
"use client";

import { Suspense, useState, type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type DashboardLayoutProps = {
  children: ReactNode;
};

function SidebarFallback() {
  return (
    <aside
      aria-hidden="true"
      className="fixed inset-y-0 left-0 z-50 hidden w-[260px] border-r border-slate-200 bg-white lg:block"
    >
      <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-100" />
      </div>

      <div className="space-y-4 px-4 py-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>

      <div className="min-h-screen lg:pl-[260px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="min-h-[calc(100vh-76px)]">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
