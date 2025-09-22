alter table public.teams
  add column if not exists min_size integer default 1;

alter table public.teams
  alter column min_size set not null;

alter table public.teams
  add constraint teams_min_size_check check (min_size >= 1);

alter table public.teams
  add constraint teams_size_order check (max_size is null or max_size >= min_size);

alter table public.teams
  add constraint teams_status_check check (status in ('draft','pending','locked'));

alter table public.team_members
  add column if not exists invited_by uuid references auth.users (id) on delete set null;

alter table public.team_members
  add constraint team_members_status_check check (status in ('pending','invited','accepted','declined'));

alter table public.team_members
  add constraint team_members_role_check check (role in ('captain','member'));

create index if not exists team_members_team_status_idx on public.team_members (team_id, status);
