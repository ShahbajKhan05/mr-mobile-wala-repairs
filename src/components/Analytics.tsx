
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  RefreshCw,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getJobs, type RepairJob } from "@/lib/jobs";
import {
  getInventoryParts,
  type InventoryPart,
} from "@/lib/inventory";
import type { ReactNode } from "react";

const STATUS_COLORS: Record<string, string> = {
  Received: "#64748b",
  "Part Ordered": "#f59e0b",
  Repairing: "#3b82f6",
  Ready: "#10b981",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", { month: "short" });
}

export default function Analytics() {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [parts, setParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Date ko client-side mount hone ke baad set karenge.
  // Isse Next.js prerender error nahi aayega.
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  async function loadAnalytics() {
    setLoading(true);
    setError("");

    try {
      const [jobsData, partsData] = await Promise.all([
        getJobs(),
        getInventoryParts(),
      ]);

      setJobs(jobsData);
      setParts(partsData);
    } catch (err) {
      console.error(err);
      setError("Analytics data load nahi ho paaya. Please refresh karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentDate(new Date());
    void loadAnalytics();
  }, []);

  const metrics = useMemo(() => {
    const paidJobs = jobs.filter(
      (job) => job.paymentStatus === "Paid"
    );

    const pendingJobs = jobs.filter(
      (job) => job.paymentStatus === "Pending"
    );

    const revenue = paidJobs.reduce(
      (total, job) => total + Number(job.estimate || 0),
      0
    );

    const pendingAmount = pendingJobs.reduce(
      (total, job) => total + Number(job.estimate || 0),
      0
    );

    const completedJobs = jobs.filter(
      (job) => job.status === "Ready"
    ).length;

    const activeJobs = jobs.filter(
      (job) => job.status !== "Ready"
    ).length;

    const stockValue = parts.reduce(
      (total, part) =>
        total + part.quantity * part.purchasePrice,
      0
    );

    const lowStock = parts.filter(
      (part) => part.quantity <= part.minStock
    ).length;

    return {
      totalJobs: jobs.length,
      paidJobs: paidJobs.length,
      pendingJobs: pendingJobs.length,
      completedJobs,
      activeJobs,
      revenue,
      pendingAmount,
      stockValue,
      lowStock,
    };
  }, [jobs, parts]);

  const monthlyRevenue = useMemo(() => {
    // Date available hone tak empty chart data return karo.
    if (!currentDate) return [];

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - (5 - index),
        1
      );

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: getMonthLabel(date),
        revenue: 0,
        jobs: 0,
      };
    });

    const monthMap = new Map(
      months.map((month) => [month.key, month])
    );

    jobs.forEach((job) => {
      if (job.paymentStatus !== "Paid") return;

      const paymentDate = job.paidAt
        ? new Date(job.paidAt)
        : new Date(job.createdAt);

      if (Number.isNaN(paymentDate.getTime())) return;

      const key = `${paymentDate.getFullYear()}-${paymentDate.getMonth()}`;
      const month = monthMap.get(key);

      if (month) {
        month.revenue += Number(job.estimate || 0);
        month.jobs += 1;
      }
    });

    return months;
  }, [jobs, currentDate]);

  const statusData = useMemo(() => {
    const statuses = [
      "Received",
      "Part Ordered",
      "Repairing",
      "Ready",
    ] as const;

    return statuses.map((status) => ({
      name: status,
      value: jobs.filter((job) => job.status === status).length,
      color: STATUS_COLORS[status],
    }));
  }, [jobs]);

  const brandData = useMemo(() => {
    const brandMap = new Map<string, number>();

    jobs.forEach((job) => {
      const brand = job.brand.trim() || "Other";
      brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
    });

    return Array.from(brandMap.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [jobs]);

  const averageRevenue =
    metrics.paidJobs > 0
      ? metrics.revenue / metrics.paidJobs
      : 0;

  const currentMonthRevenue =
    monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;

  const previousMonthRevenue =
    monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;

  const revenueChange =
    previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) /
          previousMonthRevenue) *
        100
      : null;

  if (loading) {
    return (
      <main className="box-border w-full min-w-0 px-3 py-6 sm:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading business analytics...
        </div>
      </main>
    );
  }

  return (
    <main className="box-border w-full min-w-0 max-w-full overflow-x-clip px-3 py-4 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <Activity size={16} />
              Business Overview
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Business Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your repair shop performance and revenue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAnalytics()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <RefreshCw size={17} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main Stats */}
        <section className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            title="Total Jobs"
            value={metrics.totalJobs.toLocaleString("en-IN")}
            description="All repair registrations"
            icon={<Smartphone size={20} />}
            color="blue"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(metrics.revenue)}
            description={`${metrics.paidJobs} paid jobs`}
            icon={<Wallet size={20} />}
            color="emerald"
          />

          <StatCard
            title="Pending Payments"
            value={formatCurrency(metrics.pendingAmount)}
            description={`${metrics.pendingJobs} unpaid jobs`}
            icon={<Clock3 size={20} />}
            color="amber"
          />

          <StatCard
            title="Completed Jobs"
            value={metrics.completedJobs.toLocaleString("en-IN")}
            description={`${metrics.activeJobs} jobs not ready yet`}
            icon={<CheckCircle2 size={20} />}
            color="violet"
          />
        </section>

        {/* Secondary Stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniStat
            label="Average Paid Job"
            value={formatCurrency(averageRevenue)}
            icon={<IndianRupee size={17} />}
          />

          <MiniStat
            label="Inventory Value"
            value={formatCurrency(metrics.stockValue)}
            icon={<Package size={17} />}
          />

          <MiniStat
            label="Low Stock Items"
            value={metrics.lowStock.toString()}
            icon={<AlertTriangle size={17} />}
          />
        </section>

        {/* Charts */}
        <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-3">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Revenue Overview
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Last 6 months · Paid repair jobs only
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">
                  Current Month
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(currentMonthRevenue)}
                </p>
              </div>
            </div>

            {metrics.paidJobs === 0 ? (
              <EmptyChart message="Paid jobs hone ke baad revenue chart dikhega." />
            ) : (
              <div className="h-[260px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRevenue}
                    margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        value >= 1000
                          ? `₹${value / 1000}k`
                          : `₹${value}`
                      }
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {revenueChange !== null && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                {revenueChange >= 0 ? (
                  <ArrowUpRight size={15} className="text-emerald-600" />
                ) : (
                  <ArrowDownRight size={15} className="text-red-600" />
                )}
                <span
                  className={
                    revenueChange >= 0
                      ? "font-semibold text-emerald-700"
                      : "font-semibold text-red-700"
                  }
                >
                  {Math.abs(revenueChange).toFixed(1)}%
                </span>
                <span className="text-slate-500">
                  compared with previous month
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
            <h2 className="font-bold text-slate-900">
              Repair Status
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Current job distribution
            </p>

            {jobs.length === 0 ? (
              <EmptyChart message="Repair jobs add hone par status chart dikhega." />
            ) : (
              <>
                <div className="h-[220px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {statusData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {statusData.map((item) => (
                    <div
                      key={item.name}
                      className="flex min-w-0 items-center gap-2 text-xs"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="min-w-0 truncate text-slate-600">
                        {item.name}
                      </span>
                      <span className="ml-auto font-bold text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Bottom Sections */}
        <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Popular Brands */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">
                Popular Device Brands
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Based on total repair registrations
              </p>
            </div>

            {brandData.length === 0 ? (
              <EmptyChart message="Abhi koi repair brand data available nahi hai." />
            ) : (
              <div className="space-y-5">
                {brandData.map((item) => {
                  const percentage =
                    (item.count / metrics.totalJobs) * 100;

                  return (
                    <div key={item.brand}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium text-slate-700">
                          {item.brand}
                        </span>
                        <span className="shrink-0 font-semibold text-slate-900">
                          {item.count} jobs
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Business Summary */}
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">
                Business Summary
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Overall shop performance
              </p>
            </div>

            <div className="space-y-4">
              <SummaryRow
                label="Total Registered Jobs"
                value={metrics.totalJobs.toString()}
              />
              <SummaryRow
                label="Paid Jobs"
                value={metrics.paidJobs.toString()}
                valueClass="text-emerald-600"
              />
              <SummaryRow
                label="Pending Payment Jobs"
                value={metrics.pendingJobs.toString()}
                valueClass="text-amber-600"
              />
              <SummaryRow
                label="Active Repairs"
                value={metrics.activeJobs.toString()}
              />
              <SummaryRow
                label="Ready for Pickup"
                value={metrics.completedJobs.toString()}
              />

              <div className="border-t border-slate-100 pt-4">
                <SummaryRow
                  label="Total Collected Revenue"
                  value={formatCurrency(metrics.revenue)}
                  valueClass="text-emerald-700"
                  large
                />
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-slate-400">
          Analytics are calculated from repair jobs and inventory saved in this browser.
        </p>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  color: "blue" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          {title}
        </p>
        <div className={`shrink-0 rounded-xl p-2 ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs">
        {description}
      </p>
    </article>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500 sm:text-xs">{label}</p>
        <p className="mt-1 break-words text-sm font-bold text-slate-900 sm:text-base">
          {value}
        </p>
      </div>
    </article>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = "text-slate-900",
  large = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0 text-sm text-slate-500">{label}</span>
      <span
        className={`shrink-0 font-bold ${valueClass} ${
          large ? "text-lg" : "text-sm"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-xl bg-slate-100 p-3 text-slate-400">
        <Activity size={24} />
      </div>
      <p className="mt-3 max-w-xs text-sm text-slate-500">{message}</p>
    </div>
  );
}
