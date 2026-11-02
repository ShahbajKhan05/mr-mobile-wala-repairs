
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Search,
  RefreshCw,
  ClipboardList,
  Wrench,
  CheckCircle2,
  Clock,
  Package,
  CalendarDays,
  ArrowUpRight,
  MonitorSmartphone,
  Trash2,
} from "lucide-react";
import { getJobs, type RepairJob } from "@/lib/jobs";

type DeviceSummary = {
  key: string;
  brand: string;
  model: string;
  totalRepairs: number;
  received: number;
  repairing: number;
  ready: number;
  lastRepair: string;
  latestJob: RepairJob;
};

function formatDate(date: string) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Devices() {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingDevice, setDeletingDevice] = useState("");

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setJobs(await getJobs());
    } catch {
      setError("Devices load nahi ho paye. Please dobara try karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  async function deleteDevice(device: DeviceSummary) {
    const confirmed = window.confirm(
      `Delete ${device.brand} ${device.model} and move all ${device.totalRepairs} linked repair job(s) to Recycle Bin? You can restore them later.`
    );
    if (!confirmed || deletingDevice) return;
    setDeletingDevice(device.key);
    setError("");
    try {
      const params = new URLSearchParams({ brand: device.brand, model: device.model });
      const response = await fetch(`/api/admin/devices?${params.toString()}`, { method: "DELETE" });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.message || "Device delete nahi hua.");
      await loadDevices();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Device delete nahi hua.");
    } finally {
      setDeletingDevice("");
    }
  }

  const devices = useMemo<DeviceSummary[]>(() => {
    const grouped = new Map<string, DeviceSummary>();

    jobs.forEach((job) => {
      const brand = job.brand.trim() || "Unknown Brand";
      const model = job.model.trim() || "Unknown Model";
      const key = `${brand.toLowerCase()}-${model.toLowerCase()}`;

      const existing = grouped.get(key);

      if (existing) {
        existing.totalRepairs += 1;

        if (job.status === "Received") existing.received += 1;
        if (job.status === "Repairing") existing.repairing += 1;
        if (job.status === "Ready") existing.ready += 1;

        if (
          new Date(job.createdAt).getTime() >
          new Date(existing.lastRepair).getTime()
        ) {
          existing.lastRepair = job.createdAt;
          existing.latestJob = job;
        }
      } else {
        grouped.set(key, {
          key,
          brand,
          model,
          totalRepairs: 1,
          received: job.status === "Received" ? 1 : 0,
          repairing: job.status === "Repairing" ? 1 : 0,
          ready: job.status === "Ready" ? 1 : 0,
          lastRepair: job.createdAt,
          latestJob: job,
        });
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => b.totalRepairs - a.totalRepairs
    );
  }, [jobs]);

  const filteredDevices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return devices;

    return devices.filter(
      (device) =>
        device.brand.toLowerCase().includes(query) ||
        device.model.toLowerCase().includes(query)
    );
  }, [devices, search]);

  const repairingCount = jobs.filter(
    (job) => job.status === "Repairing"
  ).length;

  const readyCount = jobs.filter(
    (job) => job.status === "Ready"
  ).length;

  return (
    <div className="box-border w-full min-w-0 max-w-full overflow-x-clip px-3 py-4 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-4 sm:space-y-6">

        {/* Header */}
        <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <MonitorSmartphone size={14} />
              DEVICE MANAGEMENT
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Devices
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your mobile devices and repair history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadDevices()}
            disabled={loading}
            className="flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* Stats */}
        <section className="grid w-full min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            title="Unique Devices"
            value={devices.length}
            icon={<Smartphone size={19} />}
            color="blue"
          />

          <StatCard
            title="Total Repairs"
            value={jobs.length}
            icon={<ClipboardList size={19} />}
            color="violet"
          />

          <StatCard
            title="Repairing"
            value={repairingCount}
            icon={<Wrench size={19} />}
            color="amber"
          />

          <StatCard
            title="Ready Devices"
            value={readyCount}
            icon={<CheckCircle2 size={19} />}
            color="emerald"
          />
        </section>

        {/* Device Records */}
        <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Search Header */}
          <div className="flex min-w-0 flex-col gap-4 border-b border-slate-100 p-3 sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">
                Device Records
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredDevices.length} devices found
              </p>
            </div>

            <div className="relative w-full min-w-0 md:max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brand or model..."
                className="box-border h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:m-5 sm:p-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="px-4 py-16 text-center">
              <RefreshCw
                size={26}
                className="mx-auto animate-spin text-blue-600"
              />
              <p className="mt-3 text-sm text-slate-500">
                Loading devices...
              </p>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <Smartphone
                size={30}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 font-bold text-slate-900">
                {search ? "No devices found" : "No devices yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search
                  ? "Try another brand or model."
                  : "Create your first repair job. Devices will appear here automatically."}
              </p>

              {!search && (
                <Link
                  href="/jobs"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Job Card
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <div className="grid w-full min-w-0 grid-cols-1 divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              {filteredDevices.map((device) => (
                <article
                  key={device.key}
                  className="box-border w-full min-w-0 p-3 transition hover:bg-slate-50/70 sm:p-5"
                >
                  {/* Device Info */}
                  <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                      <Smartphone size={22} />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                        {device.brand}
                      </p>

                      <h3 className="break-words text-sm font-bold text-slate-900 sm:text-lg">
                        {device.model}
                      </h3>
                    </div>

                    <div className="shrink-0 rounded-lg bg-blue-50 px-2 py-2 text-center sm:px-3">
                      <p className="text-base font-bold leading-none text-blue-700 sm:text-lg">
                        {device.totalRepairs}
                      </p>
                      <p className="mt-1 text-[9px] font-bold text-blue-600 sm:text-[10px]">
                        REPAIRS
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4 grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2">
                    <StatusCount
                      label="Received"
                      count={device.received}
                      icon={<Package size={13} />}
                      color="blue"
                    />

                    <StatusCount
                      label="Repairing"
                      count={device.repairing}
                      icon={<Clock size={13} />}
                      color="amber"
                    />

                    <StatusCount
                      label="Ready"
                      count={device.ready}
                      icon={<CheckCircle2 size={13} />}
                      color="emerald"
                    />
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        Last repair
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDate(device.lastRepair)}
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      <Link
                        href={`/jobs/${encodeURIComponent(device.latestJob.id)}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        Latest Repair
                        <ArrowUpRight size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void deleteDevice(device)}
                        disabled={deletingDevice === device.key}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        {deletingDevice === device.key ? "Moving..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "violet" | "amber" | "emerald";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="box-border w-full min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="flex min-w-0 items-center justify-between gap-1.5">
        <p className="min-w-0 break-words text-[11px] font-medium leading-4 text-slate-500 sm:text-sm sm:leading-5">
          {title}
        </p>

        <div className={`shrink-0 rounded-lg p-2 sm:rounded-xl sm:p-2.5 ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function StatusCount({
  label,
  count,
  icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: "blue" | "amber" | "emerald";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="box-border min-w-0 overflow-hidden rounded-lg bg-slate-50 p-2 sm:rounded-xl sm:p-3">
      <div className={`mb-2 inline-flex rounded-md p-1.5 ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-base font-bold text-slate-900 sm:text-lg">
        {count}
      </p>

      <p className="truncate text-[9px] font-semibold text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  );
}
