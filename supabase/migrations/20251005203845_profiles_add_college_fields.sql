alter table public.profiles
  add column if not exists college_unique_id text,
  add column if not exists college_email text;

create index if not exists profiles_college_unique_id_idx
  on public.profiles (lower(coalesce(college_unique_id, '')))
  where college_unique_id is not null;
