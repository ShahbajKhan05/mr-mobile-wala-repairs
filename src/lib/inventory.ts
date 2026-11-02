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

async function readResponse<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Inventory request failed.");
  }
  return result as T;
}

export async function getInventoryParts(): Promise<InventoryPart[]> {
  const result = await readResponse<InventoryResponse>(
    await fetch("/api/admin/inventory", { cache: "no-store" })
  );
  return (result.parts ?? []).sort((a, b) => a.name.localeCompare(b.name));
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
