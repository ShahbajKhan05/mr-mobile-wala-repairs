export const WARRANTY_DAYS = 7;

export type WarrantyDetails = {
  startDate: string | null;
  endDate: string | null;
};

export function parseWarrantyTimestamp(value?: string | null): Date | null {
  if (!value || typeof value !== "string") return null;

  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp;
}

export function getWarrantyDetails(
  paymentStatus: string,
  paidAt?: string | null,
): WarrantyDetails {
  if (paymentStatus !== "Paid") {
    return { startDate: null, endDate: null };
  }

  const start = parseWarrantyTimestamp(paidAt);
  if (!start) return { startDate: null, endDate: null };

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + WARRANTY_DAYS);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function formatWarrantyDate(value?: string | null): string {
  if (!value) return "Date unavailable";

  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function isWarrantyActive(
  endDate?: string | null,
  now = new Date(),
): boolean {
  if (!endDate) return false;
  const end = new Date(`${endDate.slice(0, 10)}T23:59:59.999Z`);
  if (Number.isNaN(end.getTime())) return false;
  return now.getTime() <= end.getTime();
}

export function getRemainingWarrantyDays(
  endDate?: string | null,
  now = new Date(),
): number {
  if (!endDate) return 0;
  if (!isWarrantyActive(endDate, now)) return 0;

  const end = new Date(`${endDate.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(end.getTime())) return 0;

  const todayUtc = new Date(`${now.toISOString().slice(0, 10)}T00:00:00.000Z`);
  const diffDays = Math.round(
    (end.getTime() - todayUtc.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return 1;
  return Math.min(WARRANTY_DAYS, diffDays);
}
