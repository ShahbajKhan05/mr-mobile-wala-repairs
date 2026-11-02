"use client";

import { Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type DashboardLayoutProps = { children: ReactNode };

function SidebarFallback() {
  return (
    <aside
      aria-hidden="true"
      className="fixed inset-y-0 left-0 z-50 hidden w-[270px] border-r border-white/10 bg-[#15192b] lg:block"
    >
      <div className="h-[76px] border-b border-white/10 px-6 py-6">
        <div className="h-7 w-36 animate-pulse rounded-lg bg-white/10" />
      </div>
      <div className="space-y-3 px-4 py-8">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-11 animate-pulse rounded-xl bg-white/10" />
        ))}
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    async function verifySession() {
      try {
        const response = await fetch("/api/admin/profile", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401) {
          router.replace("/admin-login");
          return;
        }
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.success) {
          setAuthError(result?.message || "Admin session verify nahi ho paya.");
          return;
        }
        setAuthReady(true);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setAuthError("Server se connection nahi ho paya. Page refresh karke try karein.");
      }
    }
    void verifySession();
    if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-5">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-slate-800">{authError || "Verifying admin session..."}</p>
          {authError && <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">Retry</button>}
        </div>
      </main>
    );
  }

  return () => controller.abort();
  }, [router]);

  // Keep this callback stable. Sidebar listens for pathname/onClose changes;
  // an inline callback here caused its close effect to run on every render,
  // instantly closing the drawer after the menu button was tapped.
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f7fb]">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </Suspense>
      <div className="min-h-screen min-w-0 lg:pl-[270px]">
        <Header onMenuClick={openSidebar} />
        <div className="min-h-[calc(100vh-68px)] w-full min-w-0 sm:min-h-[calc(100vh-76px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
