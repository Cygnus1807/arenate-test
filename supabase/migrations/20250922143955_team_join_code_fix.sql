create or replace function public.set_team_join_code()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  generated_code text;
begin
  if new.visibility = 'private' then
    if new.join_code is null or length(btrim(new.join_code)) = 0 then
      generated_code := upper(substr(md5(random()::text || clock_timestamp()::text || coalesce(new.name, '')), 1, 8));
      new.join_code := generated_code;
    else
      new.join_code := upper(btrim(new.join_code));
    end if;
    new.open_to_join := false;
  else
    new.join_code := null;
  end if;
  return new;
end;
$$;
