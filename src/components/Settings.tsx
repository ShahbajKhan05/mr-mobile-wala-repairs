
"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Store,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Star,
  ShieldCheck,
  FileText,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import {
  defaultShopSettings,
  getShopSettings,
  resetShopSettings,
  saveShopSettings,
  type ShopSettings,
} from "@/lib/settings";

export default function Settings() {
  const [settings, setSettings] = useState<ShopSettings>(
    defaultShopSettings
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getShopSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
      setError("Settings load nahi ho paayi. Please refresh karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  function updateField<K extends keyof ShopSettings>(
    field: K,
    value: ShopSettings[K]
  ) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
    setMessage("");
    setError("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!settings.shopName.trim()) {
      setError("Shop name required hai.");
      return;
    }

    if (
      settings.phone &&
      !/^[0-9+\-\s()]{7,18}$/.test(settings.phone.trim())
    ) {
      setError("Valid phone number enter karo.");
      return;
    }

    if (
      settings.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email.trim())
    ) {
      setError("Valid email address enter karo.");
      return;
    }

    if (
      settings.warrantyDays !== 7
    ) {
      setError("Warranty duration fixed 7 days hai.");
      return;
    }

    if (settings.googleReviewLink) {
      try {
        const url = new URL(settings.googleReviewLink);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        setError("Valid Google Review URL enter karo.");
        return;
      }
    }

    setSaving(true);

    try {
      await saveShopSettings({
        ...settings,
        shopName: settings.shopName.trim(),
        ownerName: settings.ownerName.trim(),
        phone: settings.phone.trim(),
        email: settings.email.trim(),
        address: settings.address.trim(),
        upiId: settings.upiId.trim(),
        googleReviewLink: settings.googleReviewLink.trim(),
        invoiceFooter: settings.invoiceFooter.trim(),
      });

      setMessage("Shop settings successfully save ho gayi!");
    } catch (err) {
      console.error(err);
      setError("Settings save nahi hui. Please dobara try karo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Kya tum shop settings ko default values par reset karna chahte ho?"
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await resetShopSettings();
      setSettings(defaultShopSettings);
      setMessage("Settings default values par reset ho gayi.");
    } catch (err) {
      console.error(err);
      setError("Settings reset nahi ho paayi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="box-border w-full min-w-0 max-w-full overflow-x-clip px-3 py-5 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
        <div className="mx-auto w-full max-w-[1100px] rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 sm:p-10">
          Loading shop settings...
        </div>
      </main>
    );
  }

  return (
    <main className="box-border w-full min-w-0 max-w-full overflow-x-clip px-3 py-4 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
      <div className="mx-auto w-full min-w-0 max-w-[1100px] space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header */}
        <header className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <Store size={17} className="shrink-0" />
            Business Configuration
          </div>

          <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Shop Settings
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your shop profile, contact details and business preferences.
          </p>
        </header>

        {/* Status Messages */}
        {message && (
          <div
            role="status"
            className="flex min-w-0 items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 sm:p-4"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p className="min-w-0 break-words">{message}</p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex min-w-0 items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p className="min-w-0 break-words">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="min-w-0 space-y-4 sm:space-y-5">
          {/* Shop Profile */}
          <SettingsSection
            icon={<Store size={20} />}
            title="Shop Profile"
            description="Your business identity and owner information."
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Shop Name *">
                <input
                  required
                  value={settings.shopName}
                  onChange={(event) =>
                    updateField("shopName", event.target.value)
                  }
                  placeholder="MR MOBILE WALA REPAIRS"
                  className="settings-input"
                />
              </FormField>

              <FormField label="Owner Name">
                <div className="relative min-w-0">
                  <UserRound className="settings-icon" size={17} />
                  <input
                    value={settings.ownerName}
                    onChange={(event) =>
                      updateField("ownerName", event.target.value)
                    }
                    placeholder="Enter owner name"
                    className="settings-input settings-input-icon"
                  />
                </div>
              </FormField>
            </div>
          </SettingsSection>

          {/* Contact */}
          <SettingsSection
            icon={<Phone size={20} />}
            title="Contact Information"
            description="Customer-facing contact details."
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="WhatsApp / Phone Number">
                <div className="relative min-w-0">
                  <Phone className="settings-icon" size={17} />
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+91 98765 43210"
                    className="settings-input settings-input-icon"
                  />
                </div>
              </FormField>

              <FormField label="Email Address">
                <div className="relative min-w-0">
                  <Mail className="settings-icon" size={17} />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="shop@example.com"
                    className="settings-input settings-input-icon"
                  />
                </div>
              </FormField>

              <div className="min-w-0 md:col-span-2">
                <FormField label="Shop Address">
                  <div className="relative min-w-0">
                    <MapPin className="settings-icon settings-icon-top" size={17} />
                    <textarea
                      rows={3}
                      value={settings.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      placeholder="Enter complete shop address"
                      className="settings-input settings-input-icon resize-y"
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </SettingsSection>

          {/* Payment */}
          <SettingsSection
            icon={<CreditCard size={20} />}
            title="Payment Settings"
            description="Configure the UPI ID shown in payment instructions."
          >
            <FormField label="UPI ID">
              <div className="relative min-w-0">
                <CreditCard className="settings-icon" size={17} />
                <input
                  value={settings.upiId}
                  onChange={(event) =>
                    updateField("upiId", event.target.value)
                  }
                  placeholder="yourname@upi"
                  className="settings-input settings-input-icon"
                />
              </div>
              <p className="break-words text-xs leading-5 text-slate-400">
                Example: mobilenumber@upi. Payment verification abhi manual rahegi.
              </p>
            </FormField>
          </SettingsSection>

          {/* Reviews */}
          <SettingsSection
            icon={<Star size={20} />}
            title="Google Review"
            description="Your Google review link for customer follow-up messages."
          >
            <FormField label="Google Review URL">
              <div className="relative min-w-0">
                <Star className="settings-icon" size={17} />
                <input
                  type="url"
                  value={settings.googleReviewLink}
                  onChange={(event) =>
                    updateField("googleReviewLink", event.target.value)
                  }
                  placeholder="https://g.page/r/your-review-link"
                  className="settings-input settings-input-icon"
                />
              </div>
            </FormField>
          </SettingsSection>

          {/* Warranty */}
          <SettingsSection
            icon={<ShieldCheck size={20} />}
            title="Warranty Preferences"
            description="Default warranty duration for paid repair jobs."
          >
            <div className="w-full min-w-0 md:max-w-sm">
              <FormField label="Warranty Duration (Days)">
                <input
                  type="number"
                  min="7"
                  max="7"
                  step="1"
                  value={7}
                  readOnly
                  className="settings-input"
                />
              </FormField>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Every paid repair includes a fixed 7-day warranty.
              </p>
            </div>
          </SettingsSection>

          {/* Invoice */}
          <SettingsSection
            icon={<FileText size={20} />}
            title="Invoice Preferences"
            description="Message printed at the bottom of your repair invoice."
          >
            <FormField label="Invoice Footer / Terms">
              <textarea
                rows={3}
                value={settings.invoiceFooter}
                onChange={(event) =>
                  updateField("invoiceFooter", event.target.value)
                }
                placeholder="Thank you for choosing MR MOBILE WALA REPAIRS."
                className="settings-input resize-y"
              />
            </FormField>
          </SettingsSection>

          {/* Actions */}
          <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <button
              type="button"
              onClick={() => void handleReset()}
              disabled={saving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:w-auto"
            >
              <RotateCcw size={17} />
              Reset Settings
            </button>

            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={() => void loadSettings()}
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={17} />
                Reload
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .settings-input {
          display: block;
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          padding: 11px 12px;
          color: #0f172a;
          font-size: 14px;
          line-height: 1.5;
          outline: none;
          transition: border-color 150ms, background 150ms, box-shadow 150ms;
        }

        .settings-input:focus {
          border-color: #60a5fa;
          background: #fff;
          box-shadow: 0 0 0 3px rgb(59 130 246 / 12%);
        }

        .settings-input-icon {
          padding-left: 40px;
        }

        .settings-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .settings-icon-top {
          top: 12px;
          transform: none;
        }
      `}</style>
    </main>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-w-0 items-start gap-3 border-b border-slate-100 p-3 sm:p-5">
        <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="break-words font-bold text-slate-900">{title}</h2>
          <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <div className="min-w-0 p-3 sm:p-5">{children}</div>
    </section>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block w-full min-w-0 space-y-2">
      <span className="block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
