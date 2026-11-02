export type InventoryPart = {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
};

type InventoryResponse = { success: boolean; message?: string; parts?: InventoryPart[] };
const LEGACY_DB = "mr-mobile-wala-inventory";
const LEGACY_STORE = "parts";

async function readResponse<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) throw new Error(result?.message || "Inventory request failed.");
  return result as T;
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

async function readLegacyParts(): Promise<{ database: IDBDatabase; parts: InventoryPart[] } | null> {
  const database = await openLegacyDatabase();
  if (!database) return null;
  return new Promise((resolve) => {
    const request = database.transaction(LEGACY_STORE, "readonly").objectStore(LEGACY_STORE).getAll();
    request.onsuccess = () => resolve({ database, parts: (request.result as InventoryPart[]) ?? [] });
    request.onerror = () => { database.close(); resolve(null); };
  });
}

async function clearLegacyParts(database: IDBDatabase): Promise<void> {
  await new Promise<void>((resolve) => {
    const transaction = database.transaction(LEGACY_STORE, "readwrite");
    transaction.objectStore(LEGACY_STORE).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => resolve();
    transaction.onabort = () => resolve();
  });
  database.close();
}

export async function getInventoryParts(): Promise<InventoryPart[]> {
  const result = await readResponse<InventoryResponse>(await fetch("/api/admin/inventory", { cache: "no-store" }));
  let parts = result.parts ?? [];

  // One-time migration of parts previously stored only in this browser.
  const legacy = await readLegacyParts();
  if (legacy?.parts.length) {
    try {
      const existingIds = new Set(parts.map((part) => part.id));
      const missingParts = legacy.parts.filter((part) => !existingIds.has(part.id));
      for (const part of missingParts) {
        await saveInventoryPart(part);
      }
      parts = [...parts, ...missingParts];
      await clearLegacyParts(legacy.database);
    } catch (error) {
      legacy.database.close();
      throw error;
    }
  } else {
    legacy?.database.close();
  }

  return parts.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveInventoryPart(part: InventoryPart): Promise<void> {
  await readResponse<{ success: boolean }>(
    await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(part),
    })
  );
}

export async function deleteInventoryPart(id: string): Promise<void> {
  await readResponse<{ success: boolean }>(
    await fetch(`/api/admin/inventory/${encodeURIComponent(id)}`, { method: "DELETE" })
  );
}
