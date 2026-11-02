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
const LEGACY_DB = "mr-mobile-wala-settings";
const LEGACY_STORE = "settings";
const LEGACY_KEY = "shop-profile";

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

function openLegacyDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = window.indexedDB.open(LEGACY_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(LEGACY_STORE)) request.result.createObjectStore(LEGACY_STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });
}

async function readLegacySettings(): Promise<ShopSettings | null> {
  const database = await openLegacyDatabase();
  if (!database) return null;
  return new Promise((resolve) => {
    const request = database.transaction(LEGACY_STORE, "readonly").objectStore(LEGACY_STORE).get(LEGACY_KEY);
    request.onsuccess = () => {
      const saved = request.result?.data as Partial<ShopSettings> | undefined;
      resolve(saved ? { ...defaultShopSettings, ...saved } : null);
    };
    request.onerror = () => resolve(null);
    request.addEventListener("loadend", () => database.close(), { once: true });
  });
}

async function clearLegacySettings(): Promise<void> {
  const database = await openLegacyDatabase();
  if (!database) return;
  await new Promise<void>((resolve) => {
    const transaction = database.transaction(LEGACY_STORE, "readwrite");
    transaction.objectStore(LEGACY_STORE).delete(LEGACY_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
  database.close();
}

export async function getShopSettings(): Promise<ShopSettings> {
  const current = await requestSettings("GET");
  if (current.updatedAt) return current;

  // One-time migration of settings previously saved in this browser's IndexedDB.
  const legacy = await readLegacySettings();
  if (!legacy || !legacy.updatedAt) return current;
  const migrated = await requestSettings("PUT", legacy);
  await clearLegacySettings();
  return migrated;
}

export async function saveShopSettings(settings: ShopSettings): Promise<void> {
  await requestSettings("PUT", settings);
}

export async function resetShopSettings(): Promise<void> {
  await requestSettings("DELETE");
  await clearLegacySettings();
}
