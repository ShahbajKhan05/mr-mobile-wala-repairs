
"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Command,
} from "lucide-react";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

    setToday(formattedDate);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
          <CalendarDays size={17} />
          <span>{today || "Loading date..."}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 md:flex md:w-64">
          <Search size={17} className="text-slate-400" />

          <input
            type="search"
            aria-label="Search"
            placeholder="Search anything..."
            className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
          />

          <span className="flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            <Command size={10} /> K
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-14 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:w-80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Notifications
                </h3>

                <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                  New
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-800">
                  Welcome to MR MOBILE WALA!
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your repair management dashboard is ready.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              RS
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-slate-800">
                Shop Owner
              </p>

              <p className="text-[10px] text-slate-400">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-slate-400 sm:block"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-bold text-slate-800">
                  Shop Owner
                </p>

                <p className="text-[10px] text-slate-400">
                  Owner Account
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Close menu
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
