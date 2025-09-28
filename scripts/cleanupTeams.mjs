import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const run = async () => {
  const { data: teamIds, error: teamsError } = await supabase
    .from('teams')
    .select('id');

  if (teamsError) {
    console.error('Failed to load teams:', teamsError.message);
    process.exit(1);
  }

  if (!teamIds?.length) {
    console.log('No teams to clean.');
    return;
  }

  const ids = teamIds.map((row) => row.id);

  const { error: memberError } = await supabase
    .from('team_members')
    .delete()
    .in('team_id', ids);

  if (memberError) {
    console.error('Failed to delete team members:', memberError.message);
    process.exit(1);
  }

  const { error: teamDeleteError } = await supabase
    .from('teams')
    .delete()
    .in('id', ids);

  if (teamDeleteError) {
    console.error('Failed to delete teams:', teamDeleteError.message);
    process.exit(1);
  }

  console.log(`Removed ${ids.length} teams and their memberships.`);
};

run();
