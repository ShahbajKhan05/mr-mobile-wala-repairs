
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Command,
  UserRound,
  ShieldCheck,
  ClipboardList,
  CheckCheck,
  Clock,
  PackageCheck,
  IndianRupee,
  X,
} from "lucide-react";

import { getJobs, type RepairJob } from "@/lib/jobs";

type HeaderProps = {
  onMenuClick?: () => void;
};

type AdminProfile = {
  username: string;
  role: string;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  href: string;
  type: "job" | "ready" | "payment" | "repair";
};

const READ_NOTIFICATIONS_KEY = "mr-mobile-wala-read-notifications";

export default function Header({ onMenuClick }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [today, setToday] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Date
  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  // Admin Profile
  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const response = await fetch("/api/admin/profile", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load admin profile.");
        }

        const data = await response.json();

        if (
          data.success &&
          typeof data.profile?.username === "string"
        ) {
          setProfile({
            username: data.profile.username,
            role: data.profile.role || "Administrator",
          });
        } else {
          throw new Error("Invalid profile response.");
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Admin profile error:", error);
        setProfile(null);
      } finally {
        if (!controller.signal.aborted) {
          setProfileLoading(false);
        }
      }
    }

    loadProfile();

    return () => controller.abort();
  }, []);

  // Load Read Notification IDs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(READ_NOTIFICATIONS_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setReadIds(
            parsed.filter((item): item is string => typeof item === "string")
          );
        }
      }
    } catch (error) {
      console.error("Notification storage error:", error);
    }
  }, []);

  // Convert repair jobs into notifications
  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      try {
        const jobs = await getJobs();

        if (!mounted) return;

        const items: NotificationItem[] = jobs.map((job: RepairJob) => {
          const href = `/jobs/list`;

          if (job.status === "Ready") {
            return {
              id: `${job.id}-ready`,
              title: "Repair Ready",
              message: `${job.customerName} - ${job.brand} ${job.model} is ready for delivery.`,
              time: job.createdAt,
              href,
              type: "ready",
            };
          }

          if (job.paymentStatus === "Pending") {
            return {
              id: `${job.id}-payment`,
              title: "Payment Pending",
              message: `${job.customerName} has a pending payment of Rs.${job.estimate}.`,
              time: job.createdAt,
              href,
              type: "payment",
            };
          }

          if (job.status === "Received") {
            return {
              id: `${job.id}-received`,
              title: "New Repair Job",
              message: `${job.customerName} submitted ${job.brand} ${job.model}.`,
              time: job.createdAt,
              href,
              type: "job",
            };
          }

          return {
            id: `${job.id}-repair`,
            title: "Repair In Progress",
            message: `${job.customerName} - ${job.brand} ${job.model}: ${job.status}.`,
            time: job.createdAt,
            href,
            type: "repair",
          };
        });

        setNotifications(items);
      } catch (error) {
        console.error("Unable to load notifications:", error);
      } finally {
        if (mounted) {
          setNotificationsLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  // Refresh notifications when tab becomes active
  useEffect(() => {
    const refresh = async () => {
      try {
        const jobs = await getJobs();

        const items: NotificationItem[] = jobs.map((job) => {
          let type: NotificationItem["type"] = "repair";
          let title = "Repair In Progress";
          let message = `${job.customerName} - ${job.brand} ${job.model}: ${job.status}.`;

          if (job.status === "Ready") {
            type = "ready";
            title = "Repair Ready";
            message = `${job.customerName} - ${job.brand} ${job.model} is ready for delivery.`;
          } else if (job.paymentStatus === "Pending") {
            type = "payment";
            title = "Payment Pending";
            message = `${job.customerName} has a pending payment of Rs.${job.estimate}.`;
          } else if (job.status === "Received") {
            type = "job";
            title = "New Repair Job";
            message = `${job.customerName} submitted ${job.brand} ${job.model}.`;
          }

          return {
            id: `${job.id}-${type}`,
            title,
            message,
            time: job.createdAt,
            href: "/jobs/list",
            type,
          };
        });

        setNotifications(items);
      } catch (error) {
        console.error("Notification refresh error:", error);
      }
    };

    const handleFocus = () => {
      refresh();
    };

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Outside click and Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/jobs/list?search=${encodeURIComponent(query)}`);
    setMobileSearchOpen(false);
  };

  const getInitials = (username: string) => {
    const words = username.trim().split(/[\s._-]+/).filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return username.slice(0, 2).toUpperCase();
  };

  const markAsRead = (id: string) => {
    setReadIds((previous) => {
      const updated = previous.includes(id)
        ? previous
        : [...previous, id];

      try {
        localStorage.setItem(
          READ_NOTIFICATIONS_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Unable to save notification state:", error);
      }

      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((item) => item.id);

    setReadIds((previous) => {
      const updated = Array.from(new Set([...previous, ...allIds]));

      try {
        localStorage.setItem(
          READ_NOTIFICATIONS_KEY,
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Unable to save notification state:", error);
      }

      return updated;
    });
  };

  const displayName = profile?.username || "Admin";
  const initials = getInitials(displayName);
  const role = profile?.role || "Administrator";

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item.id)
  ).length;

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ready":
        return <PackageCheck size={18} />;

      case "payment":
        return <IndianRupee size={18} />;

      case "job":
        return <ClipboardList size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  const getNotificationColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ready":
        return "bg-emerald-50 text-emerald-700";

      case "payment":
        return "bg-amber-50 text-amber-700";

      case "job":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatTime = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Recently";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  };

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-2 border-b border-white/75 bg-white/65 shadow-[0_8px_35px_rgba(39,55,95,0.06)] px-3 backdrop-blur-xl sm:h-[76px] sm:px-6 lg:px-8">

      {mobileSearchOpen && (
        <form onSubmit={submitSearch} className="absolute left-3 right-3 top-[calc(100%+8px)] z-40 flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-xl md:hidden">
          <Search size={18} className="ml-2 shrink-0 text-slate-400" />
          <input
            autoFocus
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search repair jobs"
            placeholder="Job ID, customer, phone or model..."
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
          />
          <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Search</button>
        </form>
      )}

      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3">

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="admin-sidebar"
          className="shrink-0 rounded-xl border border-white/80 bg-white/55 p-2 text-slate-600 transition hover:bg-white/70 lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Logo Only */}
        <Image
          src="/mr-mobile-wala-logo.png"
          alt="MR MOBILE WALA REPAIRS"
          width={180}
          height={60}
          priority
          className="h-10 w-auto max-w-[145px] object-contain sm:h-12 sm:max-w-[180px]"
        />

        {/* Date */}
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 text-sm text-slate-500 lg:flex">
          <CalendarDays size={17} />
          <span>{today || "Loading date..."}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">

        {/* Search */}
        <form onSubmit={submitSearch} className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 md:flex md:w-64">
          <Search size={17} className="shrink-0 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search repair jobs"
            placeholder="Search jobs or customers..."
            className="w-full min-w-0 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button type="submit" aria-label="Submit search" className="rounded border border-white/80 bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-white">
            <Command size={10} />
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMobileSearchOpen((open) => !open)}
          aria-label="Open repair search"
          aria-expanded={mobileSearchOpen}
          className="rounded-xl border border-white/80 bg-white/55 p-2 text-slate-600 transition hover:bg-white/70 md:hidden"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((previous) => !previous);
              setProfileOpen(false);
            }}
            className="relative rounded-xl border border-white/80 bg-white/55 p-2 text-slate-600 transition hover:bg-white/70 sm:p-2.5"
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border border-white/80 bg-white/85 shadow-[0_20px_60px_rgba(39,55,95,0.16)] backdrop-blur-2xl sm:top-14">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/70 p-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h3>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {unreadCount} unread notifications
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <CheckCheck size={17} />
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[380px] overflow-y-auto">

                {notificationsLoading ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#D6BD87] border-t-transparent" />

                    <p className="mt-3 text-xs text-slate-400">
                      Loading notifications...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                      <Bell size={21} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      No notifications yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      New repair updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isRead = readIds.includes(item.id);

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          markAsRead(item.id);
                          setNotificationsOpen(false);
                        }}
                        className={`flex gap-3 border-b border-white/70 p-4 transition hover:bg-white/70 ${
                          !isRead ? "bg-indigo-50/45" : "bg-white/45"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getNotificationColor(item.type)}`}
                        >
                          {getNotificationIcon(item.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-slate-800">
                              {item.title}
                            </p>

                            {!isRead && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#B89555]" />
                            )}
                          </div>

                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                            {item.message}
                          </p>

                          <p className="mt-2 text-[10px] text-slate-400">
                            {formatTime(item.time)}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              <div className="border-t border-white/70 p-3">
                <Link
                  href="/jobs/list"
                  onClick={() => setNotificationsOpen(false)}
                  className="block rounded-xl bg-white/65 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  View All Repair Jobs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-label="Admin profile menu"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((previous) => !previous);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-xl p-1 transition hover:bg-white/70 sm:gap-2 sm:p-1.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-xs font-bold text-indigo-700">
              {profileLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D6BD87] border-t-transparent" />
              ) : (
                initials
              )}
            </div>

            <div className="hidden max-w-[150px] text-left sm:block">
              <p className="truncate text-xs font-bold text-slate-800">
                {profileLoading ? "Loading..." : displayName}
              </p>

              <p className="text-[10px] text-slate-400">
                {role}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-slate-400 transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border border-white/80 bg-white/85 shadow-[0_20px_60px_rgba(39,55,95,0.16)] backdrop-blur-2xl sm:top-14">

              <div className="border-b border-slate-100 bg-white/55 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-700">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {profileLoading ? "Loading profile..." : displayName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <UserRound size={17} className="text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">
                      Admin Username
                    </p>

                    <p className="truncate text-xs font-semibold text-slate-700">
                      {profile?.username || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <ShieldCheck size={17} className="text-slate-400" />

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Account Access
                    </p>

                    <p className="text-xs font-semibold text-slate-700">
                      {role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white/70"
                >
                  Close Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
