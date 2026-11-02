-- Shared business data for MR MOBILE WALA REPAIRS.
-- These tables are accessed only by server routes using the Supabase service role.
create table if not exists public.shop_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_parts (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.shop_settings enable row level security;
alter table public.inventory_parts enable row level security;

-- No anon/authenticated policies are intentionally created.
-- Admin API routes verify the signed admin session and use the service-role client.
