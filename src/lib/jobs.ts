export type PhotoKey = "front" | "back" | "left" | "right";

export type JobPhoto = {
  key: PhotoKey;
  name: string;
  type: string;
  blob: Blob;
  url?: string;
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
  createdAt: string;
  paidAt?: string;
  pickupStatus?: "Pending" | "Picked Up";
};

type ApiResponse<T> = { success: boolean; message?: string } & T;

async function readResponse<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "The request could not be completed.");
  }
  return result as T;
}

export async function saveJob(job: RepairJob): Promise<string> {
  const form = new FormData();
  form.set("jobNumber", job.id);
  form.set("customerName", job.customerName);
  form.set("phone", job.phone);
  form.set("brand", job.brand);
  form.set("model", job.model);
  form.set("problem", job.problem);
  form.set("estimate", String(job.estimate));

  for (const photo of job.photos) {
    if (!(photo.blob instanceof Blob) || photo.blob.size === 0) {
      throw new Error("A device photo is missing. Please upload all four photos again.");
    }
    const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const file = new File([photo.blob], photo.name || `${photo.key}.${extension}`, { type: photo.type });
    form.set(photo.key, file);
  }

  const result = await readResponse<ApiResponse<{ trackingUrl: string }>>(
    await fetch("/api/admin/jobs", { method: "POST", body: form })
  );
  return result.trackingUrl;
}

export async function getJobs(): Promise<RepairJob[]> {
  const result = await readResponse<ApiResponse<{ jobs: Array<Omit<RepairJob, "photos"> & { photos: Array<{key: PhotoKey;name:string;type:string;url:string}> }> }>>(
    await fetch("/api/admin/jobs", { cache: "no-store" })
  );
  return result.jobs.map((job) => ({
    ...job,
    photos: job.photos.map((photo) => ({ ...photo, blob: new Blob() })),
  }));
}

export async function getJobById(id: string): Promise<RepairJob | undefined> {
  const response = await fetch(`/api/admin/jobs/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (response.status === 404) return undefined;
  const result = await readResponse<ApiResponse<{ job: Omit<RepairJob, "photos"> & { photos: Array<{key: PhotoKey;name:string;type:string;url:string}> } }>>(response);
  return {
    ...result.job,
    approvalStatus: "Pending",
    photos: result.job.photos.map((photo) => ({ ...photo, blob: new Blob() })),
  };
}

export async function updateJob(updatedJob: RepairJob): Promise<void> {
  const response = await fetch(`/api/admin/jobs/${encodeURIComponent(updatedJob.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: updatedJob.status }),
  });
  await readResponse<ApiResponse<Record<string, never>>>(response);
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: RepairJob["paymentStatus"]
): Promise<void> {
  const response = await fetch(`/api/admin/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus }),
  });
  await readResponse<ApiResponse<Record<string, never>>>(response);
}
