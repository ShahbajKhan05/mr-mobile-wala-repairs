import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

const BUCKET_NAME = "repair-photos";

export async function createRepairPhotoUrl(filePath: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 60 * 5);

  if (error) {
    throw new Error(`Unable to create photo URL: ${error.message}`);
  }

  return data.signedUrl;
}

export async function deleteRepairPhoto(filePath: string) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Unable to delete photo: ${error.message}`);
  }
}