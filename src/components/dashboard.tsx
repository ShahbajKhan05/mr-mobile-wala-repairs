
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Smartphone,
  Wrench,
  Package,
  Wallet,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  ClipboardList,
  X,
} from "lucide-react";

type JobStatus = "Ready" | "Repairing" | "Part Ordered" | "Received";

type Job = {
  id: string;
  name: string;
  device: string;
  issue: string;
  amount: string;
  status: JobStatus;
};

const initialJobs: Job[] = [
  {
    id: "RA-2048",
    name: "Aarav Sharma",
    device: "iPhone 13",
    issue: "Display replacement",
    amount: "₹6,500",
    status: "Ready",
  },
  {
    id: "RA-2047",
    name: "Priya Verma",
    device: "Samsung S22",
    issue: "Battery issue",
    amount: "₹2,800",
    status: "Repairing",
  },
  {
    id: "RA-2046",
    name: "Kabir Khan",
    device: "OnePlus 11",
    issue: "Charging port",
    amount: "₹1,800",
    status: "Part Ordered",
  },
  {
    id: "RA-2045",
    name: "Meera Patel",
    device: "Redmi Note 12",
    issue: "Back panel cracked",
    amount: "₹1,200",
    status: "Received",
  },
];

const chartData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 83 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 79 },
];

const statusStyles: Record<JobStatus, string> = {
  Ready: "bg-green-50 text-green-700",
  Repairing: "bg-blue-50 text-blue-700",
  "Part Ordered": "bg-orange-50 text-orange-700",
  Received: "bg-slate-100 text-slate-600",
};

export default function Dashboard() {
  const [jobs, setJobs] = useState(initialJobs);
  const [totalJobs, setTotalJobs] = useState(48);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [today, setToday] = useState("");
  const [greeting, setGreeting] = useState("Welcome back!");

  useEffect(() => {
    const now = new Date();

    setToday(
      now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    const hour = now.getHours();

    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening"
    );
  }, []);

  function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const customer = String(formData.get("customer") || "").trim();
    const device = String(formData.get("device") || "").trim();
    const issue = String(formData.get("issue") || "").trim();
    const estimate = Number(formData.get("estimate") || 0);

    if (!customer || !device || !issue || estimate < 0) return;

    const newJob: Job = {
      id: `RA-${String(Date.now()).slice(-4)}`,
      name: customer,
      device,
      issue,
      amount: `₹${estimate.toLocaleString("en-IN")}`,
      status: "Received",
    };

    setJobs((currentJobs) => [newJob, ...currentJobs]);
    setTotalJobs((currentTotal) => currentTotal + 1);
    setIsModalOpen(false);
    event.currentTarget.reset();
  }

  const readyCount = jobs.filter((job) => job.status === "Ready").length;
  const repairingCount = jobs.filter(
    (job) => job.status === "Repairing"
  ).length;

  const stats = [
    {
      title: "Total Jobs",
      value: String(totalJobs),
      change: "+12.8%",
      icon: Smartphone,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "In Progress",
      value: String(repairingCount + 8),
      change: "+4.2%",
      icon: Wrench,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      title: "Ready for Pickup",
      value: String(readyCount + 2).padStart(2, "0"),
      change: "2 new",
      icon: Package,
      iconStyle: "bg-orange-50 text-orange-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹48,650",
      change: "+18.6%",
      icon: Wallet,
      iconStyle: "bg-green-50 text-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fc] p-5 md:p-8">
      {/* Dashboard header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
            {today || "Your Repair Shop Dashboard"}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            {greeting}, Namaste! 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening at your repair shop today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          <Plus size={18} />
          New Job Card
        </button>
      </header>

      {/* Statistics */}
      <section
        aria-label="Shop statistics"
        className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
                  <Icon size={21} aria-hidden="true" />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-slate-800">
                {stat.value}
              </h2>

              <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp size={14} aria-hidden="true" />
                {stat.change}
                <span className="font-normal text-slate-400">
                  vs last month
                </span>
              </p>
            </article>
          );
        })}
      </section>

      {/* Revenue and daily summary */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-7 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Revenue Overview
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Your shop&apos;s weekly performance
              </p>
            </div>

            <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
              This week
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-3xl font-bold text-slate-800">
              ₹48,650
            </h3>

            <p className="mt-2 text-xs font-semibold text-green-600">
              <ArrowUpRight size={14} className="inline" />
              18.6% growth this month
            </p>
          </div>

          <div
            className="flex h-44 items-end justify-between gap-3"
            role="img"
            aria-label="Weekly revenue chart showing Monday to Sunday performance"
          >
            {chartData.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div
                  style={{ height: `${item.value}%` }}
                  className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition hover:from-blue-700 hover:to-blue-500"
                />

                <span className="text-xs text-slate-400">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            Today&apos;s Summary
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your repair shop activity
          </p>

          <div className="mt-6 space-y-6">
            <Summary
              icon={<ClipboardList size={19} />}
              title="New Jobs"
              subtitle="Received today"
              count="08"
              color="blue"
            />

            <Summary
              icon={<Clock size={19} />}
              title="Pending Pickup"
              subtitle="Awaiting customers"
              count="03"
              color="orange"
            />

            <Summary
              icon={<CheckCircle2 size={19} />}
              title="Completed"
              subtitle="Ready for handover"
              count="05"
              color="green"
            />
          </div>
        </article>
      </section>

      {/* Recent jobs */}
      <section className="mt-7 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Job Cards
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Latest customer repair requests
            </p>
          </div>

          <a
            href="/jobs"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View All →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="px-6 py-4">Job ID</th>
                <th scope="col" className="px-6 py-4">Customer</th>
                <th scope="col" className="px-6 py-4">Device</th>
                <th scope="col" className="px-6 py-4">Issue</th>
                <th scope="col" className="px-6 py-4">Estimate</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t border-slate-100 text-sm transition hover:bg-slate-50"
                >
                  <td className="px-6 py-5 font-semibold text-blue-600">
                    {job.id}
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-700">
                    {job.name}
                  </td>

                  <td className="px-6 py-5 text-slate-500">
                    {job.device}
                  </td>

                  <td className="px-6 py-5 text-slate-500">
                    {job.issue}
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-700">
                    {job.amount}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* New job modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-job-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="new-job-title"
                  className="text-xl font-bold text-slate-800"
                >
                  Create New Job Card
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the customer and device details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label
                  htmlFor="customer"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Customer Name
                </label>
                <input
                  id="customer"
                  name="customer"
                  required
                  placeholder="Enter customer name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label
                  htmlFor="device"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Device
                </label>
                <input
                  id="device"
                  name="device"
                  required
                  placeholder="e.g. iPhone 13"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label
                  htmlFor="issue"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Repair Issue
                </label>
                <input
                  id="issue"
                  name="issue"
                  required
                  placeholder="e.g. Display replacement"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label
                  htmlFor="estimate"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Estimated Amount (₹)
                </label>
                <input
                  id="estimate"
                  name="estimate"
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="Enter estimated amount"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Create Job Card
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function Summary({
  icon,
  title,
  subtitle,
  count,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: string;
  color: "blue" | "orange" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-xl p-3 ${colors[color]}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-slate-700">
          {title}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      <strong className="text-xl font-bold text-slate-800">
        {count}
      </strong>
    </div>
  );
}
