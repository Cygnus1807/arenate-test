create extension if not exists pgcrypto;
create function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  description text,
  max_size integer,
  open_to_join boolean default true,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text default 'member',
  status text default 'accepted',
  joined_at timestamptz default now(),
  primary key (team_id, user_id)
);
create trigger set_timestamp_on_teams
before update on public.teams
for each row
execute function public.set_current_timestamp_updated_at();
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
drop policy if exists "Teams can be read by authenticated users" on public.teams;
create policy "Teams can be read by authenticated users"
  on public.teams
  for select
  using (auth.role() = 'authenticated');
drop policy if exists "Team owners manage their teams" on public.teams;
create policy "Team owners manage their teams"
  on public.teams
  for all
  using (coalesce(created_by, auth.uid()) = auth.uid())
  with check (coalesce(created_by, auth.uid()) = auth.uid());
drop policy if exists "Members can view team memberships" on public.team_members;
create policy "Members can view team memberships"
  on public.team_members
  for select
  using (auth.role() = 'authenticated');
drop policy if exists "Users manage their membership rows" on public.team_members;
create policy "Users manage their membership rows"
  on public.team_members
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists "Team owners manage member statuses" on public.team_members;
create policy "Team owners manage member statuses"
  on public.team_members
  for update
  using (auth.uid() = (select created_by from public.teams where id = team_members.team_id))
  with check (auth.uid() = (select created_by from public.teams where id = team_members.team_id));
