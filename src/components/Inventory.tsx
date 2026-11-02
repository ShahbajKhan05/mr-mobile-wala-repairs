
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  IndianRupee,
  Package,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Truck,
  Layers3,
} from "lucide-react";
import {
  deleteInventoryPart,
  getInventoryParts,
  saveInventoryPart,
  type InventoryPart,
} from "@/lib/inventory";

const categories = [
  "Display",
  "Battery",
  "Charging",
  "Camera",
  "Speaker",
  "Other",
];

const emptyForm = {
  name: "",
  category: "Display",
  sku: "",
  quantity: "0",
  minStock: "2",
  purchasePrice: "0",
  sellingPrice: "0",
  supplier: "",
};

type PartForm = typeof emptyForm;

const currency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Inventory() {
  const [parts, setParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<InventoryPart | null>(null);
  const [form, setForm] = useState<PartForm>(emptyForm);
  const [error, setError] = useState("");

  const loadParts = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getInventoryParts();
      setParts(data);
    } catch (err) {
      console.error(err);
      setError("Inventory load nahi ho paayi. Please refresh karke try karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadParts();
  }, [loadParts]);

  const lowStockParts = useMemo(
    () => parts.filter((part) => part.quantity <= part.minStock),
    [parts]
  );

  const totalUnits = useMemo(
    () => parts.reduce((total, part) => total + part.quantity, 0),
    [parts]
  );

  const stockValue = useMemo(
    () =>
      parts.reduce(
        (total, part) => total + part.quantity * part.purchasePrice,
        0
      ),
    [parts]
  );

  const filteredParts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return parts.filter((part) => {
      const matchesSearch =
        !query ||
        part.name.toLowerCase().includes(query) ||
        part.category.toLowerCase().includes(query) ||
        part.sku.toLowerCase().includes(query) ||
        part.supplier.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || part.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [parts, search, categoryFilter]);

  function openAddModal() {
    setEditingPart(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(part: InventoryPart) {
    setEditingPart(part);
    setForm({
      name: part.name,
      category: part.category,
      sku: part.sku,
      quantity: String(part.quantity),
      minStock: String(part.minStock),
      purchasePrice: String(part.purchasePrice),
      sellingPrice: String(part.sellingPrice),
      supplier: part.supplier,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingPart(null);
    setForm(emptyForm);
    setError("");
  }

  function updateField<K extends keyof PartForm>(
    field: K,
    value: PartForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const quantity = Number(form.quantity);
    const minStock = Number(form.minStock);
    const purchasePrice = Number(form.purchasePrice);
    const sellingPrice = Number(form.sellingPrice);

    if (!name) {
      setError("Part ka naam enter karo.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      !Number.isInteger(minStock) ||
      quantity < 0 ||
      minStock < 0
    ) {
      setError("Quantity aur minimum stock valid non-negative numbers hone chahiye.");
      return;
    }

    if (
      !Number.isFinite(purchasePrice) ||
      !Number.isFinite(sellingPrice) ||
      purchasePrice < 0 ||
      sellingPrice < 0
    ) {
      setError("Purchase aur selling price valid amount hone chahiye.");
      return;
    }

    const now = new Date().toISOString();

    const part: InventoryPart = {
      id: editingPart?.id ?? (
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `PART-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      ),
      name,
      category: form.category,
      sku: form.sku.trim(),
      quantity,
      minStock,
      purchasePrice,
      sellingPrice,
      supplier: form.supplier.trim(),
      createdAt: editingPart?.createdAt ?? now,
      updatedAt: now,
    };

    setSaving(true);

    try {
      await saveInventoryPart(part);
      await loadParts();
      setModalOpen(false);
      setEditingPart(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      setError("Part save nahi hua. Please dobara try karo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(part: InventoryPart) {
    const confirmed = window.confirm(
      `"${part.name}" ko inventory se permanently delete karna hai?`
    );

    if (!confirmed) return;

    try {
      await deleteInventoryPart(part.id);
      await loadParts();
    } catch (err) {
      console.error(err);
      window.alert("Part delete nahi hua. Please dobara try karo.");
    }
  }

  return (
    <main className="box-border w-full min-w-0 max-w-full overflow-x-clip px-3 py-4 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 sm:space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <Package size={16} />
              Business Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Parts Inventory
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage spare parts, stock levels and supplier details.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            <Plus size={19} />
            Add New Part
          </button>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard
            title="Total Parts"
            value={parts.length.toString()}
            description="Unique inventory items"
            icon={<Boxes size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Available Units"
            value={totalUnits.toLocaleString("en-IN")}
            description="Total quantity in stock"
            icon={<Layers3 size={20} />}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Stock Value"
            value={currency(stockValue)}
            description="Based on purchase price"
            icon={<IndianRupee size={20} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Low Stock"
            value={lowStockParts.length.toString()}
            description="Items at minimum stock or below"
            icon={<AlertTriangle size={20} />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        {/* Low Stock Alert */}
        {lowStockParts.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                <AlertTriangle size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-amber-900">
                  Low Stock Alert
                </h2>
                <p className="mt-1 text-sm text-amber-800">
                  {lowStockParts.length} item(s) ko restock karne ki zaroorat ho sakti hai.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {lowStockParts.slice(0, 6).map((part) => (
                    <span
                      key={part.id}
                      className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-900"
                    >
                      {part.name}: {part.quantity} left
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Inventory Table */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4 border-b border-slate-100 p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Inventory Records
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter and manage your spare parts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search part, SKU or supplier..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex min-w-0 gap-2">
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 sm:w-48 sm:flex-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => void loadParts()}
                  title="Refresh inventory"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-100"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading inventory...
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="flex flex-col items-center px-3 py-8 sm:px-4 sm:py-12 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                <Package size={30} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">
                {parts.length === 0 ? "No Parts Added Yet" : "No Matching Parts"}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {parts.length === 0
                  ? "Start by adding your first spare part to the inventory."
                  : "Try changing your search or category filter."}
              </p>

              {parts.length === 0 && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add First Part
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:hidden">
                {filteredParts.map((part) => (
                  <article
                    key={part.id}
                    className="min-w-0 rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-slate-900">
                          {part.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {part.category}
                          {part.sku ? ` • ${part.sku}` : ""}
                        </p>
                      </div>

                      <StockBadge part={part} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <Info label="Quantity" value={`${part.quantity} units`} />
                      <Info label="Min. Stock" value={`${part.minStock} units`} />
                      <Info label="Purchase Price" value={currency(part.purchasePrice)} />
                      <Info label="Selling Price" value={currency(part.sellingPrice)} />
                    </div>

                    {part.supplier && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Truck size={14} />
                        <span className="break-words">{part.supplier}</span>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(part)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(part)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden w-full overflow-x-auto sm:block">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Part Details</th>
                      <th className="px-4 py-4 font-semibold">Stock</th>
                      <th className="px-4 py-4 font-semibold">Purchase</th>
                      <th className="px-4 py-4 font-semibold">Selling</th>
                      <th className="px-4 py-4 font-semibold">Supplier</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredParts.map((part) => (
                      <tr key={part.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{part.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {part.category}
                            {part.sku ? ` • SKU: ${part.sku}` : ""}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <StockBadge part={part} />
                          <p className="mt-1 text-xs text-slate-500">
                            Minimum: {part.minStock}
                          </p>
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-700">
                          {currency(part.purchasePrice)}
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-700">
                          {currency(part.sellingPrice)}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {part.supplier || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(part)}
                              title="Edit part"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(part)}
                              title="Delete part"
                              className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-5">
            Showing {filteredParts.length} of {parts.length} inventory items
          </div>
        </section>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section className="my-auto max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingPart ? "Edit Inventory Part" : "Add New Part"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Spare part ki details enter karo.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Part Name *">
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="e.g. iPhone 13 Display"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Category *">
                  <select
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    className="form-input"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="SKU / Part Code">
                  <input
                    value={form.sku}
                    onChange={(event) => updateField("sku", event.target.value)}
                    placeholder="e.g. IP13-DSP-01"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Supplier Name">
                  <input
                    value={form.supplier}
                    onChange={(event) => updateField("supplier", event.target.value)}
                    placeholder="Supplier / Shop name"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Available Quantity *">
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={(event) => updateField("quantity", event.target.value)}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Minimum Stock Alert *">
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.minStock}
                    onChange={(event) => updateField("minStock", event.target.value)}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Purchase Price (₹) *">
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.purchasePrice}
                    onChange={(event) => updateField("purchasePrice", event.target.value)}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Selling Price (₹) *">
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.sellingPrice}
                    onChange={(event) => updateField("sellingPrice", event.target.value)}
                    className="form-input"
                  />
                </FormField>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : editingPart ? "Update Part" : "Save Part"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <style jsx>{`
        .form-input {
          width: 100%;
          min-width: 0;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          padding: 11px 12px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: border-color 150ms, background 150ms, box-shadow 150ms;
        }

        .form-input:focus {
          border-color: #60a5fa;
          background: #fff;
          box-shadow: 0 0 0 3px rgb(59 130 246 / 12%);
        }
      `}</style>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 sm:text-sm">{title}</p>
        <div className={`shrink-0 rounded-xl p-2 ${iconClass}`}>{icon}</div>
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

function StockBadge({ part }: { part: InventoryPart }) {
  const low = part.quantity <= part.minStock;

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        low
          ? "bg-amber-100 text-amber-800"
          : "bg-emerald-100 text-emerald-800"
      }`}
    >
      {part.quantity} units {low ? "• Low" : "• In Stock"}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
