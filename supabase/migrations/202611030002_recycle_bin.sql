-- Soft-delete support for admin recycle bin.
-- Existing records remain untouched; only deleted_at/deleted_by are added.
alter table public.repair_jobs
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text;

alter table public.inventory_parts
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text;

create index if not exists repair_jobs_deleted_at_idx
  on public.repair_jobs (deleted_at)
  where deleted_at is not null;

create index if not exists inventory_parts_deleted_at_idx
  on public.inventory_parts (deleted_at)
  where deleted_at is not null;
