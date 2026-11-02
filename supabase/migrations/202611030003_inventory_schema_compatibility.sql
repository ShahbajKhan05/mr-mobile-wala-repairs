-- Compatibility for the inventory API on both fresh and older databases.
-- The API keeps part_name populated for databases created with the legacy schema,
-- while the full inventory model remains stored in the JSONB data column.
alter table public.inventory_parts
  add column if not exists part_name text;
