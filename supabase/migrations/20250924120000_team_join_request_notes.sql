-- Remove legacy private team columns and enforce new join request metadata

-- Drop triggers and constraints associated with private team join codes
DROP TRIGGER IF EXISTS set_team_join_code ON public.teams;
DROP FUNCTION IF EXISTS public.set_team_join_code();

ALTER TABLE public.teams
  DROP CONSTRAINT IF EXISTS teams_visibility_check,
  DROP CONSTRAINT IF EXISTS teams_join_code_private_check,
  DROP COLUMN IF EXISTS visibility,
  DROP COLUMN IF EXISTS join_code;

-- Allow applicants to leave a note when requesting to join a team
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS request_note text;
