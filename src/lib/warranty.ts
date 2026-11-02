export const WARRANTY_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export type WarrantyDetails = {
  startDate: string | null;
  endDate: string | null;
  expiresAt: string | null;
};

export function parseWarrantyTimestamp(value?: string | null): Date | null {
  if (!value || typeof value !== "string") return null;
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp;
}

export function getWarrantyDetails(paymentStatus: string, paidAt?: string | null): WarrantyDetails {
  if (paymentStatus !== "Paid") return { startDate: null, endDate: null, expiresAt: null };
  const start = parseWarrantyTimestamp(paidAt);
  if (!start) return { startDate: null, endDate: null, expiresAt: null };

  // The warranty expires exactly 7 x 24 hours after the first recorded payment.
  const expiry = new Date(start.getTime() + WARRANTY_DAYS * DAY_MS);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: expiry.toISOString().slice(0, 10),
    expiresAt: expiry.toISOString(),
  };
}

export function formatWarrantyDate(value?: string | null): string {
  if (!value) return "Date unavailable";
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  }).format(date);
}

function getExpiry(endDate?: string | null, expiresAt?: string | null): Date | null {
  const exact = parseWarrantyTimestamp(expiresAt);
  if (exact) return exact;
  if (!endDate) return null;
  const legacy = new Date(`${endDate.slice(0, 10)}T23:59:59.999Z`);
  return Number.isNaN(legacy.getTime()) ? null : legacy;
}

export function isWarrantyActive(endDate?: string | null, now = new Date(), expiresAt?: string | null): boolean {
  const expiry = getExpiry(endDate, expiresAt);
  return Boolean(expiry && now.getTime() < expiry.getTime());
}

export function getRemainingWarrantyDays(endDate?: string | null, now = new Date(), expiresAt?: string | null): number {
  const expiry = getExpiry(endDate, expiresAt);
  if (!expiry || now.getTime() >= expiry.getTime()) return 0;
  return Math.min(WARRANTY_DAYS, Math.ceil((expiry.getTime() - now.getTime()) / DAY_MS));
}
