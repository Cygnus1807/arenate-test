alter table public.registrations
  add column if not exists team_id uuid references public.teams(id) on delete cascade;
create index if not exists registrations_team_id_idx
  on public.registrations(team_id);
