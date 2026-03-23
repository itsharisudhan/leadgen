create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists public.saved_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  name text not null,
  address text not null,
  phone text,
  website text,
  rating numeric,
  has_online_presence boolean not null default false,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  location text not null,
  result_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid references public.saved_leads(id) on delete set null,
  template text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.saved_leads enable row level security;
alter table public.searches enable row level security;
alter table public.proposals enable row level security;

create policy if not exists "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy if not exists "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy if not exists "saved_leads_own_all" on public.saved_leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "searches_own_all" on public.searches
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "proposals_own_all" on public.proposals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
