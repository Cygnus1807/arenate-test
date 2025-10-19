-- Database Performance and Quality Improvements
-- Created: 2025-10-13
-- Description: Adds indexes, constraints, functions, and optimizations

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Events table indexes
create index if not exists idx_events_date on public.events(date desc);
create index if not exists idx_events_category on public.events(category);
create index if not exists idx_events_organizer on public.events(organizer);
create index if not exists idx_events_created_at on public.events(created_at desc);
create index if not exists idx_events_details_gin on public.events using gin(details);

-- Announcements indexes
create index if not exists idx_announcements_created_at on public.announcements(created_at desc);
create index if not exists idx_announcements_type on public.announcements(type);

-- Registrations indexes
create index if not exists idx_registrations_user_id on public.registrations(user_id);
create index if not exists idx_registrations_event_id on public.registrations(event_id);
create index if not exists idx_registrations_created_at on public.registrations(created_at desc);
create index if not exists idx_registrations_deadline on public.registrations(deadline) where deadline is not null;

-- Profiles indexes
create index if not exists idx_profiles_email on public.profiles(email) where email is not null;
create index if not exists idx_profiles_department on public.profiles(department) where department is not null;
create index if not exists idx_profiles_graduation_year on public.profiles(graduation_year) where graduation_year is not null;

-- Teams indexes
create index if not exists idx_teams_event_id on public.teams(event_id);
create index if not exists idx_teams_created_by on public.teams(created_by) where created_by is not null;
create index if not exists idx_teams_status on public.teams(status);
create index if not exists idx_teams_open_to_join on public.teams(open_to_join) where open_to_join = true;
create index if not exists idx_teams_created_at on public.teams(created_at desc);

-- Team members indexes
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_team_members_status on public.team_members(status);
create index if not exists idx_team_members_role on public.team_members(role);

-- Composite indexes for common queries
create index if not exists idx_teams_event_status on public.teams(event_id, status);
create index if not exists idx_team_members_team_status on public.team_members(team_id, status);

-- ============================================================================
-- DATA VALIDATION CONSTRAINTS
-- ============================================================================

-- Events constraints
do $$ 
begin
  if not exists (select 1 from pg_constraint where conname = 'chk_events_name_not_empty') then
    alter table public.events add constraint chk_events_name_not_empty check (trim(name) <> '');
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_events_organizer_not_empty') then
    alter table public.events add constraint chk_events_organizer_not_empty check (trim(organizer) <> '');
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_events_category_valid') then
    alter table public.events add constraint chk_events_category_valid 
      check (category in ('Tech', 'Cultural', 'Sports', 'Business', 'Entrepreneurship', 'Other'));
  end if;
end $$;

-- Profiles constraints
do $$ 
begin
  -- Clean up invalid phone numbers first
  update public.profiles 
  set phone = null 
  where phone is not null 
    and phone !~* '^\+?[0-9\s\-\(\)\.]+$'
    and trim(phone) <> '';
  
  if not exists (select 1 from pg_constraint where conname = 'chk_profiles_email_format') then
    alter table public.profiles add constraint chk_profiles_email_format 
      check (email is null or email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_profiles_graduation_year_range') then
    alter table public.profiles add constraint chk_profiles_graduation_year_range 
      check (graduation_year is null or (graduation_year >= 1900 and graduation_year <= 2100));
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_profiles_phone_format') then
    alter table public.profiles add constraint chk_profiles_phone_format 
      check (phone is null or trim(phone) = '' or phone ~* '^\+?[0-9\s\-\(\)\.]+$');
  end if;
end $$;

-- Teams constraints
do $$ 
begin
  if not exists (select 1 from pg_constraint where conname = 'chk_teams_name_not_empty') then
    alter table public.teams add constraint chk_teams_name_not_empty check (trim(name) <> '');
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_teams_max_size_positive') then
    alter table public.teams add constraint chk_teams_max_size_positive 
      check (max_size is null or max_size > 0);
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_teams_status_valid') then
    alter table public.teams add constraint chk_teams_status_valid 
      check (status in ('draft', 'pending', 'locked'));
  end if;
end $$;

-- Team members constraints
do $$ 
begin
  if not exists (select 1 from pg_constraint where conname = 'chk_team_members_role_valid') then
    alter table public.team_members add constraint chk_team_members_role_valid 
      check (role in ('captain', 'member'));
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'chk_team_members_status_valid') then
    alter table public.team_members add constraint chk_team_members_status_valid 
      check (status in ('accepted', 'pending', 'declined'));
  end if;
end $$;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get team member count
create or replace function public.get_team_member_count(team_uuid uuid, member_status text default null)
returns integer
language plpgsql
security definer
stable
as $$
declare
  member_count integer;
begin
  if member_status is null then
    select count(*) into member_count
    from public.team_members
    where team_id = team_uuid;
  else
    select count(*) into member_count
    from public.team_members
    where team_id = team_uuid
      and status = member_status;
  end if;
  
  return coalesce(member_count, 0);
end;
$$;

-- Function to check if user can register for event
create or replace function public.can_register_for_event(user_uuid uuid, event_uuid uuid)
returns boolean
language plpgsql
security definer
stable
as $$
declare
  already_registered boolean;
  event_deadline timestamptz;
begin
  -- Check if already registered
  select exists(
    select 1 from public.registrations
    where user_id = user_uuid and event_id = event_uuid
  ) into already_registered;
  
  if already_registered then
    return false;
  end if;
  
  -- Check registration deadline
  select (details->>'registrationDeadline')::timestamptz 
  into event_deadline
  from public.events
  where id = event_uuid;
  
  if event_deadline is not null and event_deadline < now() then
    return false;
  end if;
  
  return true;
end;
$$;

-- Function to get user's events
create or replace function public.get_user_events(user_uuid uuid)
returns table (
  event_id uuid,
  event_name text,
  event_date timestamptz,
  event_category text,
  registration_date timestamptz
)
language plpgsql
security definer
stable
as $$
begin
  return query
  select 
    e.id,
    e.name,
    e.date,
    e.category,
    r.created_at
  from public.registrations r
  join public.events e on e.id = r.event_id
  where r.user_id = user_uuid
  order by e.date desc;
end;
$$;

-- Function to get team details with member info
create or replace function public.get_team_with_members(team_uuid uuid)
returns jsonb
language plpgsql
security definer
stable
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'team', to_jsonb(t.*),
    'members', (
      select jsonb_agg(
        jsonb_build_object(
          'user_id', tm.user_id,
          'role', tm.role,
          'status', tm.status,
          'joined_at', tm.joined_at,
          'profile', to_jsonb(p.*)
        )
      )
      from public.team_members tm
      left join public.profiles p on p.id = tm.user_id
      where tm.team_id = t.id
    ),
    'member_count', public.get_team_member_count(t.id, 'accepted'),
    'pending_count', public.get_team_member_count(t.id, 'pending')
  )
  into result
  from public.teams t
  where t.id = team_uuid;
  
  return result;
end;
$$;

-- ============================================================================
-- TRIGGERS FOR DATA INTEGRITY
-- ============================================================================

-- Trigger to auto-update profiles updated_at
create or replace function public.update_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_profiles_updated_at on public.profiles;
create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_profiles_updated_at();

-- Trigger to validate team member limits
create or replace function public.validate_team_member_limit()
returns trigger
language plpgsql
as $$
declare
  team_max_size integer;
  current_count integer;
begin
  -- Get team's max size
  select max_size into team_max_size
  from public.teams
  where id = new.team_id;
  
  -- If no limit, allow
  if team_max_size is null then
    return new;
  end if;
  
  -- Count current accepted and pending members
  select count(*) into current_count
  from public.team_members
  where team_id = new.team_id
    and status in ('accepted', 'pending')
    and (tg_op = 'INSERT' or user_id <> new.user_id);
  
  -- Check if adding this member would exceed limit
  if new.status in ('accepted', 'pending') and current_count >= team_max_size then
    raise exception 'Team has reached maximum member limit of %', team_max_size;
  end if;
  
  return new;
end;
$$;

drop trigger if exists trigger_validate_team_member_limit on public.team_members;
create trigger trigger_validate_team_member_limit
  before insert or update on public.team_members
  for each row
  execute function public.validate_team_member_limit();

-- Trigger to prevent updates to locked teams
create or replace function public.prevent_locked_team_updates()
returns trigger
language plpgsql
as $$
declare
  team_status text;
begin
  select status into team_status
  from public.teams
  where id = new.team_id;
  
  if team_status = 'locked' then
    raise exception 'Cannot modify members of a locked team';
  end if;
  
  return new;
end;
$$;

drop trigger if exists trigger_prevent_locked_team_member_updates on public.team_members;
create trigger trigger_prevent_locked_team_member_updates
  before insert or update or delete on public.team_members
  for each row
  execute function public.prevent_locked_team_updates();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for upcoming events
create or replace view public.upcoming_events as
select 
  e.*,
  count(distinct r.user_id) as registration_count
from public.events e
left join public.registrations r on r.event_id = e.id
where e.date >= now()
group by e.id
order by e.date asc;

-- View for popular events (most registrations)
create or replace view public.popular_events as
select 
  e.*,
  count(distinct r.user_id) as registration_count
from public.events e
left join public.registrations r on r.event_id = e.id
group by e.id
order by registration_count desc, e.created_at desc;

-- View for team statistics
create or replace view public.team_statistics as
select 
  t.id as team_id,
  t.event_id,
  t.name as team_name,
  t.status,
  count(tm.user_id) filter (where tm.status = 'accepted') as accepted_members,
  count(tm.user_id) filter (where tm.status = 'pending') as pending_members,
  t.max_size,
  case 
    when t.max_size is null then false
    else count(tm.user_id) filter (where tm.status = 'accepted') >= t.max_size
  end as is_full
from public.teams t
left join public.team_members tm on tm.team_id = t.id
group by t.id;

-- ============================================================================
-- STATISTICS AND MONITORING
-- ============================================================================

-- Update table statistics
analyze public.events;
analyze public.announcements;
analyze public.registrations;
analyze public.profiles;
analyze public.teams;
analyze public.team_members;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

comment on table public.events is 'Stores campus events and competitions';
comment on table public.announcements is 'System-wide announcements displayed on dashboard';
comment on table public.registrations is 'User registrations for events';
comment on table public.profiles is 'Extended user profile information';
comment on table public.teams is 'Teams created for team-based events';
comment on table public.team_members is 'Members belonging to teams';

comment on column public.events.details is 'JSONB field containing event metadata like rules, prizes, timeline';
comment on column public.teams.status is 'Team status: draft (editable), pending (submitted), locked (finalized)';
comment on column public.team_members.role is 'Member role: captain (team leader), member (regular member)';
comment on column public.team_members.status is 'Membership status: accepted, pending (awaiting approval), declined';

comment on function public.get_team_member_count is 'Returns count of team members, optionally filtered by status';
comment on function public.can_register_for_event is 'Checks if a user can register for an event';
comment on function public.get_user_events is 'Returns all events a user is registered for';
comment on function public.get_team_with_members is 'Returns complete team information with member details as JSONB';
