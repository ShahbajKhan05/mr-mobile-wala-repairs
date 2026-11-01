
export type PhotoKey = "front" | "back" | "left" | "right";

export type JobPhoto = {
  key: PhotoKey;
  name: string;
  type: string;
  blob: Blob;
};

export type RepairJob = {
  id: string;
  customerName: string;
  phone: string;
  brand: string;
  model: string;
  problem: string;
  estimate: number;
  photos: JobPhoto[];
  status: "Received" | "Part Ordered" | "Repairing" | "Ready";
  paymentStatus: "Pending" | "Paid";
  approvalStatus: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  paidAt?: string;
};

const DB_NAME = "mr-mobile-wala";
const DB_VERSION = 1;
const STORE_NAME = "jobs";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(
        new Error("Your browser does not support local database storage.")
      );
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

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ?? new Error("Unable to open job database.")
      );
    };

    request.onblocked = () => {
      reject(
        new Error("Database update is blocked by another open tab.")
      );
    };
  });
}

// Save a new job or update an existing job
export async function saveJob(job: RepairJob): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.put(job);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };

    transaction.onerror = () => {
      database.close();
      reject(
        transaction.error ?? new Error("Unable to save job.")
      );
    };

    transaction.onabort = () => {
      database.close();
      reject(
        transaction.error ?? new Error("Job saving was cancelled.")
      );
    };
  });
}

// Get all repair jobs
export async function getJobs(): Promise<RepairJob[]> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      const jobs = request.result as RepairJob[];

      resolve(
        jobs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    };

    request.onerror = () => {
      reject(
        request.error ?? new Error("Unable to load jobs.")
      );
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onabort = () => {
      database.close();
      reject(
        transaction.error ?? new Error("Unable to read jobs.")
      );
    };
  });
}

// Get one repair job by ID
export async function getJobById(
  id: string
): Promise<RepairJob | undefined> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(id);

    request.onsuccess = () => {
      resolve(request.result as RepairJob | undefined);
    };

    request.onerror = () => {
      reject(
        request.error ?? new Error("Unable to find job.")
      );
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onabort = () => {
      database.close();
      reject(
        transaction.error ?? new Error("Unable to read job.")
      );
    };
  });
}

// Update existing repair job
export async function updateJob(
  updatedJob: RepairJob
): Promise<void> {
  await saveJob(updatedJob);
}

// Update payment status and actual payment date
export async function updatePaymentStatus(
  id: string,
  paymentStatus: RepairJob["paymentStatus"]
): Promise<void> {
  const job = await getJobById(id);

  if (!job) {
    throw new Error("Repair job not found.");
  }

  const updatedJob: RepairJob = {
    ...job,
    paymentStatus,
    paidAt:
      paymentStatus === "Paid"
        ? job.paymentStatus === "Paid" && job.paidAt
          ? job.paidAt
          : new Date().toISOString()
        : undefined,
  };

  await saveJob(updatedJob);
}
