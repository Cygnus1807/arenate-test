
-- Enforce roster limits when members join or change status
create or replace function public.enforce_team_member_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  team_max integer;
  active_count integer;
begin
  if TG_OP = 'DELETE' then
    return old;
  end if;

  select max_size into team_max
  from public.teams
  where id = coalesce(new.team_id, old.team_id)
  for update;

  if team_max is null then
    return new;
  end if;

  if new.status not in ('pending', 'accepted', 'invited') then
    return new;
  end if;

  select count(*) into active_count
  from public.team_members
  where team_id = new.team_id
    and status in ('pending', 'accepted', 'invited')
    and (TG_OP = 'INSERT' or user_id <> new.user_id);

  if active_count + 1 > team_max then
    raise exception 'Team % already has the maximum number of members (%).', new.team_id, team_max;
  end if;

  return new;
end;
$$;

drop trigger if exists team_members_enforce_limits on public.team_members;
create trigger team_members_enforce_limits
before insert or update on public.team_members
for each row
execute function public.enforce_team_member_limits();

-- Ensure teams meet size requirements before locking
create or replace function public.ensure_team_lock_requirements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  accepted_count integer;
begin
  if new.status <> 'locked' or coalesce(old.status, '') = 'locked' then
    return new;
  end if;

  select count(*) into accepted_count
  from public.team_members
  where team_id = new.id
    and status = 'accepted';

  if accepted_count < new.min_size then
    raise exception 'Team % must have at least % accepted members before locking.', new.id, new.min_size;
  end if;

  if new.max_size is not null and accepted_count > new.max_size then
    raise exception 'Team % exceeds the maximum size of % members.', new.id, new.max_size;
  end if;

  new.open_to_join := false;
  return new;
end;
$$;

drop trigger if exists teams_enforce_lock_requirements on public.teams;
create trigger teams_enforce_lock_requirements
before update on public.teams
for each row
execute function public.ensure_team_lock_requirements();
