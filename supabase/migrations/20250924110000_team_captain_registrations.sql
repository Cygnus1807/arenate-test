-- Ensure every auth user participating in team flows has a profile row
insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
  and exists (
    select 1 from public.team_members tm where tm.user_id = u.id
  )
on conflict (id) do nothing;

-- Make team member rows depend on profiles so profile data can be joined reliably
alter table public.team_members
  drop constraint if exists team_members_user_id_fkey;

alter table public.team_members
  add constraint team_members_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

drop policy if exists "Users can view their registrations" on public.registrations;
drop policy if exists "Users can insert their registrations" on public.registrations;
drop policy if exists "Users can update their registrations" on public.registrations;
drop policy if exists "Users can delete their registrations" on public.registrations;

create policy "Individuals manage own registrations"
  on public.registrations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Captains manage team registrations"
  on public.registrations
  for all
  using (
    (
      registrations.team_id is not null
      and exists (
        select 1
        from public.team_members tm_captain
        where tm_captain.team_id = registrations.team_id
          and tm_captain.user_id = auth.uid()
          and tm_captain.role = 'captain'
          and tm_captain.status = 'accepted'
      )
    )
    or (
      registrations.team_id is null
      and exists (
        select 1
        from public.teams t
        join public.team_members tm_captain on tm_captain.team_id = t.id
        join public.team_members tm_member on tm_member.team_id = t.id
        where t.event_id = registrations.event_id
          and tm_captain.user_id = auth.uid()
          and tm_captain.role = 'captain'
          and tm_captain.status = 'accepted'
          and tm_member.user_id = registrations.user_id
          and tm_member.status = 'accepted'
      )
    )
  )
  with check (
    registrations.team_id is not null
    and exists (
      select 1
      from public.team_members tm_captain
      where tm_captain.team_id = registrations.team_id
        and tm_captain.user_id = auth.uid()
        and tm_captain.role = 'captain'
        and tm_captain.status = 'accepted'
    )
    and exists (
      select 1
      from public.team_members tm_member
      where tm_member.team_id = registrations.team_id
        and tm_member.user_id = registrations.user_id
        and tm_member.status = 'accepted'
    )
  );
