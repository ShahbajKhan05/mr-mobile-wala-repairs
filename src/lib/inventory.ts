
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

const DB_NAME = "mr-mobile-wala-inventory";
const DB_VERSION = 1;
const STORE_NAME = "parts";

function openInventoryDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error("Database open failed."));
  });
}

export async function getInventoryParts(): Promise<InventoryPart[]> {
  const database = await openInventoryDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      const parts = request.result as InventoryPart[];

      resolve(
        parts.sort((a, b) => a.name.localeCompare(b.name))
      );
    };

    request.onerror = () => {
      reject(request.error || new Error("Could not load inventory."));
    };

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
    transaction.onabort = () => database.close();
  });
}

export async function saveInventoryPart(
  part: InventoryPart
): Promise<void> {
  const database = await openInventoryDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(part);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not save part."));
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Save operation aborted."));
    };
  });
}

export async function deleteInventoryPart(id: string): Promise<void> {
  const database = await openInventoryDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).delete(id);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not delete part."));
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Delete operation aborted."));
    };
  });
}
