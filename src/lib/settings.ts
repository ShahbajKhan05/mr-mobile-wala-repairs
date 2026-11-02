
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

const DB_NAME = "mr-mobile-wala-settings";
const DB_VERSION = 1;
const STORE_NAME = "settings";
const SETTINGS_KEY = "shop-profile";

function openSettingsDatabase(): Promise<IDBDatabase> {
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

    request.onerror = () => {
      reject(request.error || new Error("Settings database open failed."));
    };
  });
}

export async function getShopSettings(): Promise<ShopSettings> {
  const database = await openSettingsDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(SETTINGS_KEY);

    request.onsuccess = () => {
      const saved = request.result?.data as ShopSettings | undefined;

      resolve({
        ...defaultShopSettings,
        ...(saved || {}),
      });
    };

    request.onerror = () => {
      reject(request.error || new Error("Could not load shop settings."));
    };

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
    transaction.onabort = () => database.close();
  });
}

export async function saveShopSettings(
  settings: ShopSettings
): Promise<void> {
  const database = await openSettingsDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put({
      id: SETTINGS_KEY,
      data: {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
    });

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not save settings."));
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Settings save aborted."));
    };
  });
}

export async function resetShopSettings(): Promise<void> {
  const database = await openSettingsDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).delete(SETTINGS_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not reset settings."));
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Settings reset aborted."));
    };
  });
}
