
-- Add visibility and join_code support to teams
alter table public.teams
  add column if not exists visibility text default 'public',
  add column if not exists join_code text unique;

alter table public.teams
  add constraint teams_visibility_check check (visibility in ('public','private'));

update public.teams
set visibility = case when open_to_join then 'public' else 'private' end
where visibility is null;

-- For public teams ensure join_code is cleared
update public.teams set join_code = null where visibility = 'public';

alter table public.teams
  add constraint teams_join_code_private_check
  check (
    (visibility = 'private' and join_code is not null)
    or (visibility = 'public' and join_code is null)
  );

create or replace function public.set_team_join_code()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.visibility = 'private' then
    if new.join_code is null or length(trim(new.join_code)) = 0 then
      new.join_code := encode(gen_random_bytes(5), 'hex');
    end if;
    new.open_to_join := false;
  else
    new.join_code := null;
  end if;
  return new;
end;
$$;

drop trigger if exists set_team_join_code on public.teams;
create trigger set_team_join_code
before insert or update on public.teams
for each row
execute function public.set_team_join_code();

-- Community posts table
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists community_posts_event_id_idx on public.community_posts(event_id);

alter table public.community_posts enable row level security;

create or replace function public.set_timestamp_on_community_posts()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_timestamp_on_community_posts on public.community_posts;
create trigger set_timestamp_on_community_posts
before update on public.community_posts
for each row
execute function public.set_timestamp_on_community_posts();

drop policy if exists "Community posts readable" on public.community_posts;
create policy "Community posts readable"
  on public.community_posts
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "Community posts insert own" on public.community_posts;
create policy "Community posts insert own"
  on public.community_posts
  for insert
  with check (auth.uid() = author_id);

drop policy if exists "Community posts update own" on public.community_posts;
create policy "Community posts update own"
  on public.community_posts
  for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Community posts delete own" on public.community_posts;
create policy "Community posts delete own"
  on public.community_posts
  for delete
  using (auth.uid() = author_id);
