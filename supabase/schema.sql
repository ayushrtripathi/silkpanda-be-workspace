-- SilkPanda Phase 1 schema
-- Run in Supabase SQL Editor after creating your project.
-- See decisions/ADR-0003-supabase-backend.md

-- Shops
create table shops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  whatsapp_number text not null,
  location text,
  description text,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  title text not null,
  price numeric,
  fabric text,
  occasion_tag text,
  stock_status text default 'in_stock' check (stock_status in ('in_stock', 'out_of_stock')),
  image_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events (product views and inquiries)
create table events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('view', 'inquiry')),
  product_id uuid references products(id) on delete cascade not null,
  shop_id uuid references shops(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Auto-update products.updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- Row Level Security
alter table shops enable row level security;
alter table products enable row level security;
alter table events enable row level security;

-- Public storefront reads
create policy "Public read shops"
  on shops for select using (true);

create policy "Public read products"
  on products for select using (true);

create policy "Public insert events"
  on events for insert with check (true);

-- Shop owners manage their own shop
create policy "Owners read own shop"
  on shops for select using (auth.uid() = owner_id);

create policy "Owners update own shop"
  on shops for update using (auth.uid() = owner_id);

-- Shop owners manage their products
create policy "Owners insert own products"
  on products for insert
  with check (
    shop_id in (select id from shops where owner_id = auth.uid())
  );

create policy "Owners update own products"
  on products for update
  using (
    shop_id in (select id from shops where owner_id = auth.uid())
  );

create policy "Owners delete own products"
  on products for delete
  using (
    shop_id in (select id from shops where owner_id = auth.uid())
  );

-- Shop owners read their analytics events
create policy "Owners read own events"
  on events for select
  using (
    shop_id in (select id from shops where owner_id = auth.uid())
  );

-- Storage bucket (also create via Dashboard: Storage > New bucket > product-images, public)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Owners upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

create policy "Owners update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

create policy "Owners delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
