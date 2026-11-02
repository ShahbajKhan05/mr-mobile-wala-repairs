export type ShopSettings = {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  upiId: string;
  googleReviewLink: string;
  warrantyDays: number;
  invoiceFooter: string;
  updatedAt: string;
};

export const defaultShopSettings: ShopSettings = {
  shopName: "MR MOBILE WALA REPAIRS",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  upiId: "",
  googleReviewLink: "",
  warrantyDays: 7,
  invoiceFooter: "Thank you for choosing MR MOBILE WALA REPAIRS.",
  updatedAt: "",
};

type SettingsResponse = { success: boolean; message?: string; settings?: ShopSettings };

async function requestSettings(method: "GET" | "PUT" | "DELETE", settings?: ShopSettings): Promise<ShopSettings> {
  const response = await fetch("/api/admin/settings", {
    method,
    cache: "no-store",
    ...(settings ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) } : {}),
  });
  const result = await response.json().catch(() => null) as SettingsResponse | null;
  if (!response.ok || !result?.success || !result.settings) {
    throw new Error(result?.message || "Shop settings request failed.");
  }
  return { ...defaultShopSettings, ...result.settings };
}

export function getShopSettings(): Promise<ShopSettings> {
  return requestSettings("GET");
}

export async function saveShopSettings(settings: ShopSettings): Promise<void> {
  await requestSettings("PUT", settings);
}

export async function resetShopSettings(): Promise<void> {
  await requestSettings("DELETE");
}
