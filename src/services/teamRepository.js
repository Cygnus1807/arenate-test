import supabase from '../utils/supabase';

const TEAM_FIELDS =
  'id, event_id, created_by, name, description, min_size, max_size, open_to_join, status, visibility, join_code, created_at, updated_at';
const MEMBER_FIELDS = 'team_id, user_id, role, status, joined_at, profiles:profiles(full_name)';
const TEAM_WITH_MEMBERS_FIELDS = `${TEAM_FIELDS}, members:team_members(${MEMBER_FIELDS})`;

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }
};

export const fetchTeamsForEvent = async ({ eventId }) => {
  ensureSupabase();
  const { data, error } = await supabase
    .from('teams')
    .select(TEAM_WITH_MEMBERS_FIELDS)
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });
  return { data: data ?? [], error };
};

export const fetchOpenTeams = async ({ eventId }) => {
  ensureSupabase();
  const { data, error } = await supabase
    .from('teams')
    .select(TEAM_WITH_MEMBERS_FIELDS)
    .eq('event_id', eventId)
    .eq('open_to_join', true)
    .in('status', ['draft', 'pending'])
    .order('created_at', { ascending: true });
  return { data: data ?? [], error };
};

export const getUserTeamContext = async ({ eventId, userId }) => {
  ensureSupabase();
  if (!userId) {
    return { memberships: [] };
  }

  const { data, error } = await supabase
    .from('team_members')
    .select(`team_id, role, status, joined_at, team:teams(${TEAM_WITH_MEMBERS_FIELDS})`)
    .eq('user_id', userId)
    .eq('team.event_id', eventId);

  return { memberships: data ?? [], error };
};

export const createTeam = async ({
  eventId,
  userId,
  name,
  description,
  minSize,
  maxSize,
  openToJoin,
  visibility,
}) => {
  ensureSupabase();
  const payload = {
    event_id: eventId,
    created_by: userId,
    name,
    description,
    min_size: minSize ?? 1,
    max_size: maxSize ?? null,
    open_to_join: visibility === 'public' ? openToJoin : false,
    visibility: visibility ?? 'public',
    status: 'draft',
  };

  const { data, error } = await supabase.from('teams').insert(payload).select(TEAM_FIELDS).single();
  if (error) {
    return { error };
  }

  const { error: memberError } = await supabase
    .from('team_members')
    .insert({ team_id: data.id, user_id: userId, role: 'captain', status: 'accepted' });
  if (memberError) {
    return { error: memberError };
  }

  return { data, error: null };
};

export const joinTeam = async ({ teamId, userId }) => {
  ensureSupabase();
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id, max_size, min_size, open_to_join, status, visibility, members:team_members(status, user_id)')
    .eq('id', teamId)
    .single();
  if (teamError) {
    return { error: teamError };
  }
  if (team.status === 'locked') {
    return { error: new Error('Team has already been locked.') };
  }
  if (!team.open_to_join || team.visibility !== 'public') {
    return { error: new Error('Team is not accepting new members.') };
  }
  const members = team.members ?? [];
  const acceptedCount = members.filter((member) => member.status === 'accepted').length;
  const pendingCount = members.filter((member) => member.status === 'pending').length;
  if (team.max_size && acceptedCount + pendingCount >= team.max_size) {
    return { error: new Error('Team already has the maximum number of members.') };
  }
  const { error } = await supabase
    .from('team_members')
    .upsert({ team_id: teamId, user_id: userId, status: 'pending' }, { onConflict: 'team_id,user_id' });
  return { error };
};

export const joinTeamByCode = async ({ joinCode, userId }) => {
  ensureSupabase();
  const { data: team, error } = await supabase
    .from('teams')
    .select(`${TEAM_FIELDS}, members:team_members(status, user_id)`)
    .eq('join_code', joinCode)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (!team || team.visibility !== 'private') {
    return { error: new Error('No private team found for that code.') };
  }

  if (team.status === 'locked') {
    return { error: new Error('This team has already been locked.') };
  }

  const members = team.members ?? [];
  if (members.some((member) => member.user_id === userId)) {
    return { error: new Error('You are already part of this team.') };
  }

  const activeCount = members.filter((member) => ['pending', 'accepted', 'invited'].includes(member.status)).length;
  if (team.max_size && activeCount >= team.max_size) {
    return { error: new Error('Team already has the maximum number of members.') };
  }

  const { error: insertError } = await supabase
    .from('team_members')
    .upsert({ team_id: team.id, user_id: userId, status: 'accepted' }, { onConflict: 'team_id,user_id' });

  if (insertError) {
    return { error: insertError };
  }

  return { data: team, error: null };
};

export const cancelJoinRequest = async ({ teamId, userId }) => {
  ensureSupabase();
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .eq('status', 'pending');
  return { error };
};

export const updateTeamMemberStatus = async ({ teamId, userId, status }) => {
  ensureSupabase();
  const { error } = await supabase
    .from('team_members')
    .update({ status })
    .eq('team_id', teamId)
    .eq('user_id', userId);
  return { error };
};

export const removeTeamMember = async ({ teamId, userId }) => {
  ensureSupabase();
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);
  return { error };
};

export const leaveTeam = async ({ teamId, userId }) => removeTeamMember({ teamId, userId });

export const updateTeamSettings = async ({ teamId, patch }) => {
  ensureSupabase();
  const { data, error } = await supabase
    .from('teams')
    .update(patch)
    .eq('id', teamId)
    .select(TEAM_FIELDS)
    .single();
  return { data, error };
};

export const lockTeamAndRegister = async ({ teamId, eventId }) => {
  ensureSupabase();
  const { error: lockError } = await supabase
    .from('teams')
    .update({ status: 'locked', open_to_join: false })
    .eq('id', teamId);
  if (lockError) {
    return { error: lockError };
  }

  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .eq('status', 'accepted');
  if (membersError) {
    return { error: membersError };
  }

  if (!members?.length) {
    return { error: new Error('No accepted members found for this team.') };
  }

  const rows = members.map((member) => ({
    user_id: member.user_id,
    event_id: eventId,
    team_id: teamId,
  }));

  const { error: registrationError } = await supabase
    .from('registrations')
    .upsert(rows, { onConflict: 'user_id,event_id' });
  return { error: registrationError };
};

export const getUserTeamForEvent = async ({ eventId, userId }) => {
  const { memberships, error } = await getUserTeamContext({ eventId, userId });
  if (error) {
    return { data: null, error };
  }
  return { data: memberships?.[0] ?? null, error: null };
};
