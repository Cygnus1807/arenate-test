import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  cancelJoinRequest,
  createTeam,
  fetchOpenTeams,
  fetchTeamsForEvent,
  getUserTeamForEvent,
  joinTeam,
  leaveTeam,
  lockTeamAndRegister,
  updateTeamMemberStatus,
  updateTeamSettings,
} from '../services/teamRepository';

const normalize = (collection) => collection ?? [];

export const useTeamManager = ({ eventId, userId, isTeamEvent }) => {
  const [teams, setTeams] = useState([]);
  const [openTeams, setOpenTeams] = useState([]);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mutating, setMutating] = useState(false);

  const refresh = useCallback(async () => {
    if (!eventId || !isTeamEvent) {
      setTeams([]);
      setOpenTeams([]);
      setMembership(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const [teamsResult, openResult, membershipResult] = await Promise.all([
      fetchTeamsForEvent({ eventId }),
      fetchOpenTeams({ eventId }),
      getUserTeamForEvent({ eventId, userId }),
    ]);
    if (teamsResult.error || openResult.error || membershipResult.error) {
      setError(teamsResult.error || openResult.error || membershipResult.error);
    }
    setTeams(normalize(teamsResult.data));
    setOpenTeams(normalize(openResult.data));
    setMembership(membershipResult.data ?? null);
    setLoading(false);
  }, [eventId, userId, isTeamEvent]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const myTeam = useMemo(() => membership?.team ?? null, [membership]);

  const runMutation = useCallback(async (mutation) => {
    setMutating(true);
    const result = await mutation();
    await refresh();
    setMutating(false);
    return result;
  }, [refresh]);

  const handleCreateTeam = useCallback(
    (values) =>
      runMutation(() =>
        createTeam({
          eventId,
          userId,
          name: values.name,
          description: values.description,
          minSize: values.minSize,
          maxSize: values.maxSize,
          openToJoin: values.openToJoin,
        }),
      ),
    [eventId, userId, runMutation],
  );

  const handleJoinTeam = useCallback(
    ({ teamId, note }) =>
      runMutation(() =>
        joinTeam({
          teamId,
          userId,
          note,
        }),
      ),
    [runMutation, userId],
  );

  const handleLeaveTeam = useCallback(
    (teamId) =>
      runMutation(() =>
        leaveTeam({
          teamId,
          userId,
        }),
      ),
    [runMutation, userId],
  );

  const handleUpdateMember = useCallback(
    ({ teamId, memberId, status }) =>
      runMutation(() =>
        updateTeamMemberStatus({
          teamId,
          userId: memberId,
          status,
        }),
      ),
    [runMutation],
  );

  const handleFinalize = useCallback(
    (teamId) =>
      runMutation(() =>
        lockTeamAndRegister({
          teamId,
          eventId,
        }),
      ),
    [runMutation, eventId],
  );

  const handleCancelJoin = useCallback(
    (teamId) =>
      runMutation(() =>
        cancelJoinRequest({
          teamId,
          userId,
        }),
      ),
    [runMutation, userId],
  );

  const handleUpdateTeamSettings = useCallback(
    ({ teamId, patch }) =>
      runMutation(() =>
        updateTeamSettings({
          teamId,
          patch,
        }),
      ),
    [runMutation],
  );

  return {
    teams,
    openTeams,
    membership,
    myTeam,
    loading,
    error,
    mutating,
    createTeam: handleCreateTeam,
    joinTeam: handleJoinTeam,
    leaveTeam: handleLeaveTeam,
    updateMember: handleUpdateMember,
    finalizeTeam: handleFinalize,
    cancelJoinRequest: handleCancelJoin,
    updateTeamSettings: handleUpdateTeamSettings,
    refresh,
  };
};
