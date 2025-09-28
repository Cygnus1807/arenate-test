-- Dashboard base schema
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organizer text not null,
  category text not null,
  date timestamptz not null,
  img text,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);
create table if not exists public.registrations (
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  deadline date,
  created_at timestamptz default now(),
  primary key (user_id, event_id)
);
-- Enable Row Level Security
alter table public.events enable row level security;
alter table public.announcements enable row level security;
alter table public.registrations enable row level security;
-- Policies for events & announcements (public read)
drop policy if exists "Public read access to events" on public.events;
create policy "Public read access to events"
  on public.events
  for select
  using (true);
drop policy if exists "Public read access to announcements" on public.announcements;
create policy "Public read access to announcements"
  on public.announcements
  for select
  using (true);
-- Policies for registrations (per-user access)
drop policy if exists "Users can view their registrations" on public.registrations;
create policy "Users can view their registrations"
  on public.registrations
  for select
  using (auth.uid() = user_id);
drop policy if exists "Users can insert their registrations" on public.registrations;
create policy "Users can insert their registrations"
  on public.registrations
  for insert
  with check (auth.uid() = user_id);
drop policy if exists "Users can update their registrations" on public.registrations;
create policy "Users can update their registrations"
  on public.registrations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists "Users can delete their registrations" on public.registrations;
create policy "Users can delete their registrations"
  on public.registrations
  for delete
  using (auth.uid() = user_id);
