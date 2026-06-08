-- ===========================================================================
-- Fragrance of Arabia — database schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- ===========================================================================

-- ----- PRODUCTS ------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  type         text not null default 'Perfume',
  audience     text not null default 'Unisex',
  price        numeric not null default 0,
  size         text,
  description  text default '',
  notes        jsonb,            -- perfume: {top, middle, end}; others: a string
  image        text default '',  -- public URL from the product-images bucket
  top_seller   boolean not null default false,
  out_of_stock boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone (including logged-out visitors) can read the catalogue.
drop policy if exists "products read" on public.products;
create policy "products read"
  on public.products for select
  using (true);

-- Only signed-in admins can add / change / remove products.
drop policy if exists "products write" on public.products;
create policy "products write"
  on public.products for all
  to authenticated
  using (true) with check (true);

-- ----- SETTINGS (single row, id = 1) ---------------------------------------
create table if not exists public.settings (
  id        int primary key default 1,
  whatsapp  text default '',
  email     text default '',
  tagline   text default '',
  locations jsonb default '[]'::jsonb,
  constraint settings_singleton check (id = 1)
);

alter table public.settings enable row level security;

drop policy if exists "settings read" on public.settings;
create policy "settings read"
  on public.settings for select
  using (true);

drop policy if exists "settings write" on public.settings;
create policy "settings write"
  on public.settings for all
  to authenticated
  using (true) with check (true);

-- Seed the settings row so the upsert always has something to update.
insert into public.settings (id, whatsapp, email, tagline, locations)
values (
  1,
  '12025550123',
  'hello@fragranceofarabia.com',
  'Pure oil-based perfumes imported from Dubai & the UAE — long-lasting, alcohol-free, and made to last.',
  '[
    {"id":"loc-pg","name":"Mall at Prince George''s","address":"3500 East-West Hwy, Hyattsville, MD-20782"},
    {"id":"loc-am","name":"Arundel Mills","address":"7000 Arundel Mills Cir, Hanover, MD-21076"},
    {"id":"loc-pm","name":"Pentagon Mall","address":"1100 S Hayes St, Arlington, VA-22202"}
  ]'::jsonb
)
on conflict (id) do nothing;

-- ----- REALTIME ------------------------------------------------------------
-- Lets the storefront update live when the admin changes something.
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.settings;

-- ----- STORAGE (product images) --------------------------------------------
-- Create the public bucket for photos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public can view images; only signed-in admins can upload / change them.
drop policy if exists "product images read" on storage.objects;
create policy "product images read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product images write" on storage.objects;
create policy "product images write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
