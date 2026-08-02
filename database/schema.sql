-- PantryPulse Supabase SQL Schema
-- Run this script in the Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type public.pantry_status as enum ('available', 'consumed', 'wasted', 'donated', 'expired');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.notification_type as enum ('urgent', 'warning', 'info', 'success');
exception
  when duplicate_object then null;
end $$;

-- User Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  household_size integer not null default 1 check (household_size between 1 and 30),
  currency text not null default 'USD' check (char_length(currency) between 3 and 5),
  country text not null default 'US' check (char_length(country) between 2 and 56),
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pantry Items Table
create table if not exists public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null check (char_length(product_name) between 2 and 80),
  category text not null check (char_length(category) between 2 and 60),
  quantity numeric(12,2) not null check (quantity > 0 and quantity <= 10000),
  unit text not null check (char_length(unit) between 1 and 30),
  price numeric(12,2) not null default 0 check (price >= 0),
  purchase_date date not null,
  expiry_date date not null check (expiry_date >= purchase_date),
  storage_location text not null check (storage_location in ('Pantry','Refrigerator','Freezer','Kitchen counter','Other')),
  opened boolean not null default false,
  notes text check (notes is null or char_length(notes) <= 500),
  status public.pantry_status not null default 'available',
  status_date date,
  waste_reason text check (waste_reason is null or char_length(waste_reason) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Inventory Events Log Table
create table if not exists public.inventory_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid references public.pantry_items(id) on delete set null,
  event_type text not null check (char_length(event_type) between 2 and 50),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Shopping List Table
create table if not exists public.shopping_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null check (char_length(product_name) between 2 and 80),
  quantity numeric(12,2) not null check (quantity > 0 and quantity <= 10000),
  unit text not null check (char_length(unit) between 1 and 30),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- App Notifications Table
create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid references public.pantry_items(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 100),
  message text not null check (char_length(message) between 2 and 400),
  type public.notification_type not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes for Speed & Clean Queries
create index if not exists pantry_items_user_expiry_idx on public.pantry_items(user_id, expiry_date) where status = 'available';
create index if not exists pantry_items_user_status_idx on public.pantry_items(user_id, status);
create index if not exists inventory_events_user_created_idx on public.inventory_events(user_id, created_at desc);
create index if not exists shopping_list_user_created_idx on public.shopping_list(user_id, created_at desc);
create index if not exists app_notifications_user_read_idx on public.app_notifications(user_id, is_read, created_at desc);

-- Automatic Updated-At Trigger Function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists pantry_items_set_updated_at on public.pantry_items;
create trigger pantry_items_set_updated_at before update on public.pantry_items for each row execute function public.set_updated_at();

-- New User Registration Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, household_size, currency, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    greatest(1, least(30, coalesce((new.raw_user_meta_data ->> 'household_size')::integer, 1))),
    coalesce(new.raw_user_meta_data ->> 'currency', 'USD'),
    coalesce(new.raw_user_meta_data ->> 'country', 'US')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    household_size = excluded.household_size,
    currency = excluded.currency,
    country = excluded.country;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.pantry_items enable row level security;
alter table public.inventory_events enable row level security;
alter table public.shopping_list enable row level security;
alter table public.app_notifications enable row level security;

-- Profiles Policies
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Pantry Items Policies
drop policy if exists "Users read own pantry" on public.pantry_items;
create policy "Users read own pantry" on public.pantry_items for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own pantry" on public.pantry_items;
create policy "Users insert own pantry" on public.pantry_items for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own pantry" on public.pantry_items;
create policy "Users update own pantry" on public.pantry_items for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own pantry" on public.pantry_items;
create policy "Users delete own pantry" on public.pantry_items for delete to authenticated using ((select auth.uid()) = user_id);

-- Inventory Events Policies
drop policy if exists "Users read own events" on public.inventory_events;
create policy "Users read own events" on public.inventory_events for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own events" on public.inventory_events;
create policy "Users insert own events" on public.inventory_events for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own events" on public.inventory_events;
create policy "Users delete own events" on public.inventory_events for delete to authenticated using ((select auth.uid()) = user_id);

-- Shopping List Policies
drop policy if exists "Users read own shopping list" on public.shopping_list;
create policy "Users read own shopping list" on public.shopping_list for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own shopping list" on public.shopping_list;
create policy "Users insert own shopping list" on public.shopping_list for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own shopping list" on public.shopping_list;
create policy "Users update own shopping list" on public.shopping_list for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own shopping list" on public.shopping_list;
create policy "Users delete own shopping list" on public.shopping_list for delete to authenticated using ((select auth.uid()) = user_id);

-- App Notifications Policies
drop policy if exists "Users read own notifications" on public.app_notifications;
create policy "Users read own notifications" on public.app_notifications for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own notifications" on public.app_notifications;
create policy "Users insert own notifications" on public.app_notifications for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own notifications" on public.app_notifications;
create policy "Users update own notifications" on public.app_notifications for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own notifications" on public.app_notifications;
create policy "Users delete own notifications" on public.app_notifications for delete to authenticated using ((select auth.uid()) = user_id);

-- Security Privileges
revoke all on public.profiles, public.pantry_items, public.inventory_events, public.shopping_list, public.app_notifications from anon;
grant select, insert, update, delete on public.profiles, public.pantry_items, public.inventory_events, public.shopping_list, public.app_notifications to authenticated;
