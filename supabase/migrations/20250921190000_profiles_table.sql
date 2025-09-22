create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  department text,
  graduation_year integer,
  phone text,
  interests text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users upsert own profile" on public.profiles;
create policy "Users upsert own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);