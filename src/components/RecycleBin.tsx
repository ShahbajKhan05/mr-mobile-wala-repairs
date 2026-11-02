"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Archive, RefreshCw, RotateCcw, Search, Trash2, Smartphone, Package, Clock3 } from "lucide-react";

type TrashItem = {
  id: string;
  type: "job" | "inventory";
  title: string;
  subtitle: string;
  detail: string;
  deletedAt: string | null;
  deletedBy: string;
};

async function readJson(response: Response) {
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) throw new Error(result?.message || "Request failed.");
  return result;
}

export default function RecycleBin() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "job" | "inventory">("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await readJson(await fetch("/api/admin/recycle-bin", { cache: "no-store" }));
      setItems(result.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recycle Bin load nahi hua.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadItems(); }, [loadItems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = filter === "all" || item.type === filter;
      const matchesQuery = !q || [item.title, item.subtitle, item.detail].join(" ").toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [items, search, filter]);

  async function performAction(item: TrashItem, action: "restore" | "permanent-delete") {
    if (action === "permanent-delete" && !window.confirm(`"${item.title}" ko permanently delete karna hai? Is action ko undo nahi kar sakte.`)) return;
    setBusyId(item.id);
    setError("");
    setNotice("");
    try {
      await readJson(await fetch("/api/admin/recycle-bin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, type: item.type, action }),
      }));
      setNotice(action === "restore" ? "Item successfully restore ho gaya." : "Item permanently delete ho gaya.");
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action complete nahi hua.");
    } finally {
      setBusyId("");
    }
  }

  const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 px-3 py-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Admin tools</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Recycle Bin & Delete History</h1>
            <p className="mt-1 text-sm text-slate-500">Deleted repair jobs and inventory items can be restored from here.</p>
          </div>
          <button type="button" onClick={() => void loadItems()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh
          </button>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Deleted records</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{items.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Repair jobs</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">{items.filter((item) => item.type === "job").length}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-1">
            <p className="text-xs text-slate-500">Inventory items</p>
            <p className="mt-1 text-2xl font-bold text-violet-600">{items.filter((item) => item.type === "inventory").length}</p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:p-4">
            <div className="relative min-w-0 flex-1">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search deleted records..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"/>
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
              <option value="all">All deleted items</option><option value="job">Repair jobs</option><option value="inventory">Inventory</option>
            </select>
          </div>

          {error && <p role="alert" className="m-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {notice && <p role="status" className="m-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading delete history...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <span className="rounded-2xl bg-slate-100 p-4 text-slate-400"><Archive size={28}/></span>
              <h2 className="mt-4 font-bold text-slate-900">Recycle Bin is empty</h2>
              <p className="mt-1 text-sm text-slate-500">Deleted jobs and stock items will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const Icon = item.type === "job" ? Smartphone : Package;
                const busy = busyId === item.id;
                return (
                  <article key={item.type + item.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="rounded-xl bg-slate-100 p-3 text-slate-600"><Icon size={19}/></span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-all text-sm font-bold text-slate-900">{item.title}</h3>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600">{item.type === "job" ? "Repair job" : "Inventory"}</span>
                        </div>
                        <p className="mt-1 break-words text-xs text-slate-600">{item.subtitle}</p>
                        <p className="mt-1 break-words text-xs text-slate-500">{item.detail}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400"><span className="inline-flex items-center gap-1"><Clock3 size={12}/> Deleted {date(item.deletedAt)}</span><span>By {item.deletedBy}</span></p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <button type="button" disabled={busy} onClick={() => void performAction(item, "restore")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 sm:flex-none"><RotateCcw size={14}/> Restore</button>
                      <button type="button" disabled={busy} onClick={() => void performAction(item, "permanent-delete")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 sm:flex-none"><Trash2 size={14}/> {busy ? "Please wait" : "Delete forever"}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        <p className="text-xs leading-relaxed text-slate-500">Restore se record active list mein wapas aa jayega. Delete forever ke baad record aur uski linked repair photos permanently remove ho jayengi.</p>
      </div>
    </main>
  );
}
