import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import supabase from '../../utils/supabase';

const ModalShell = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 px-4 pb-6 sm:items-center sm:p-6">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
          aria-label="Close registration"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const SoloRegistrationView = ({
  event,
  onRegister,
  registering,
  statusMessage,
  statusError,
  registrationClosed,
  hasParticipated,
}) => {
  const deadline = event.details?.registrationDeadline ?? null;
  const disableRegister = registrationClosed || hasParticipated || registering;
  const helperText = registrationClosed
    ? 'Registration deadline has passed.'
    : hasParticipated
    ? 'You have already registered for this competition.'
    : '';

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-800">Register for {event.name}</h2>
      <p className="mt-2 text-sm text-gray-600">
        This competition is designed for individual participation. Confirm below to save your spot.
      </p>
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <p>
          <strong>Event date:</strong>{' '}
          {formatDate(event.date, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="mt-1">
          <strong>Registration closes:</strong>{' '}
          {deadline ? formatDate(deadline) : 'See schedule'}
        </p>
      </div>
      <button
        type="button"
        onClick={onRegister}
        disabled={disableRegister}
        className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {registrationClosed ? 'Registration closed' : registering ? 'Registering...' : 'Confirm registration'}
      </button>
      {helperText && (
        <p className="mt-3 text-xs text-center text-gray-500">{helperText}</p>
      )}
      {statusMessage && (
        <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{statusMessage}</p>
      )}
      {statusError && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{statusError}</p>
      )}
    </div>
  );
};

const TeamCreateForm = ({ defaults, onCreate, creating, disabled = false }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    openToJoin: true,
    maxSize: defaults?.maxSize ?? '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError('Team name is required.');
      return;
    }
    const minSize = defaults?.minSize ?? 1;
    let maxSizeValue = form.maxSize === '' ? null : Number(form.maxSize);
    if (form.maxSize !== '' && Number.isNaN(maxSizeValue)) {
      setError('Enter a valid number for team size.');
      return;
    }
    if (maxSizeValue !== null && maxSizeValue < minSize) {
      setError(`Team size cannot be smaller than ${minSize}.`);
      return;
    }
    setError('');
    await onCreate({
      name: trimmedName,
      description: form.description.trim(),
      minSize,
      maxSize: maxSizeValue,
      openToJoin: form.openToJoin,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="team-name">
          Team name
        </label>
        <input
          id="team-name"
          type="text"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Campus Ninjas"
          disabled={creating || disabled}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="team-desc">
          Team description <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <textarea
          id="team-desc"
          rows={3}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          placeholder="Share your idea, tech stack, or the kind of teammates you are looking for."
          disabled={creating || disabled}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="team-size">
            Team size limit
          </label>
          <input
            id="team-size"
            type="number"
            min={defaults?.minSize ?? 1}
            value={form.maxSize ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, maxSize: event.target.value }))}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder={defaults?.maxSize ?? 'e.g. 4'}
            disabled={creating || disabled}
          />
          <p className="mt-1 text-xs text-gray-500">
            {`Minimum ${defaults?.minSize ?? 1} members required${
              form.maxSize
                ? `, but you can allow up to ${form.maxSize} teammates.`
                : '. Leave blank for no maximum.'
            }`}
          </p>
        </div>
        <div className="flex items-end">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.openToJoin}
              onChange={(event) => setForm((prev) => ({ ...prev, openToJoin: event.target.checked }))}
              className="mr-2"
              disabled={creating || disabled}
            />
            Allow other students to request to join
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={creating || disabled}
        className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creating ? 'Creating team...' : disabled ? 'Registration closed' : 'Create team'}
      </button>
    </form>
  );
};

const TeamMembersList = ({
  team,
  currentUserId,
  onAccept,
  onDecline,
  onLeave,
  onCancelRequest,
  onViewProfile,
  actionsDisabled = false,
  getMemberName,
}) => {
  const members = useMemo(() => team.members ?? [], [team]);
  const accepted = useMemo(
    () => members.filter((member) => member.status === 'accepted'),
    [members],
  );
  const pending = useMemo(
    () => members.filter((member) => member.status === 'pending'),
    [members],
  );
  const currentMembership = members.find((member) => member.user_id === currentUserId) ?? null;
  const isCaptain = currentMembership?.role === 'captain' || team.created_by === currentUserId;
  const teamLocked = team.status === 'locked';

  const renderMemberName = (member) => {
    if (member.user_id === currentUserId) {
      return 'You';
    }
    return getMemberName?.(member) ?? member.profiles?.full_name ?? 'Team member';
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Team members</h3>
        <ul className="mt-2 space-y-2">
          {accepted.length ? (
            accepted.map((member) => (
              <li key={member.user_id} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-800">{renderMemberName(member)}</span>
                    {member.role === 'captain' && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Captain
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {member.user_id !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => onViewProfile?.(member.user_id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View profile
                      </button>
                    )}
                    {member.user_id === currentUserId && !teamLocked && !actionsDisabled && (
                      <button
                        type="button"
                        onClick={() => onLeave?.(team.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Leave team
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500">
              No members yet.
            </li>
          )}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Join requests</h3>
        <ul className="mt-2 space-y-2">
          {pending.length ? (
            pending.map((member) => {
              const isSelf = member.user_id === currentUserId;
              return (
                <li key={member.user_id} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{renderMemberName(member)}</span>
                      <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">Pending</span>
                      {member.request_note && (
                        <p className="mt-1 text-xs text-gray-500 whitespace-pre-line">
                          Note: {member.request_note}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => onViewProfile?.(member.user_id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          View profile
                        </button>
                      )}
                      {isSelf ? (
                        <button
                          type="button"
                          onClick={() => (!actionsDisabled ? onCancelRequest?.(team.id) : null)}
                          disabled={actionsDisabled}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel request
                        </button>
                      ) : isCaptain ? (
                        <>
                          <button
                            type="button"
                            onClick={() => (!actionsDisabled ? onAccept?.(team.id, member.user_id) : null)}
                            disabled={actionsDisabled}
                            className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => (!actionsDisabled ? onDecline?.(team.id, member.user_id) : null)}
                            disabled={actionsDisabled}
                            className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Waiting for captain</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500">
              No pending requests.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const OpenTeamsList = ({ teams, onJoin, joiningTeamId, joinNotes, onNoteChange, actionsDisabled = false, getMemberName }) => (
  <div className="space-y-3">
    {teams.length === 0 && (
      <div className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
        No public teams yet. Create one or check back soon.
      </div>
    )}
    {teams.map((team) => {
      const members = team.members ?? [];
      const accepted = members.filter((member) => member.status === 'accepted').length;
      const pending = members.filter((member) => member.status === 'pending').length;
      const activeCount = accepted + pending;
      const isFull = Boolean(team.max_size && activeCount >= team.max_size);
      const accepting = team.open_to_join && !isFull && team.status !== 'locked';
      const noteValue = joinNotes[team.id] ?? '';
      const captain = members.find((member) => member.role === 'captain');
      const captainName = captain ? getMemberName?.(captain) ?? 'Team captain' : 'Team captain';
      return (
        <div key={team.id} className="rounded-xl border border-gray-200 p-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-gray-800">{captainName}</h4>
              <p className="mt-1 text-xs text-gray-500">
                {team.description || 'Looking for collaborators.'}
              </p>
              <p className="mt-1 text-xs text-gray-400">Team code: {team.name}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>
                Accepted: {accepted}
                {team.max_size ? `/${team.max_size}` : ''}
              </p>
              {pending > 0 && <p>Pending: {pending}</p>}
            </div>
          </div>
          <label className="mt-3 block text-xs font-medium text-gray-600" htmlFor={`join-note-${team.id}`}>
            Add a note for the captain <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id={`join-note-${team.id}`}
            rows={2}
            value={noteValue}
            onChange={(event) => onNoteChange(team.id, event.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-xs focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Mention your skills, availability, or why you want to join."
            disabled={!accepting || joiningTeamId === team.id || actionsDisabled}
          />
          <button
            type="button"
            onClick={() => onJoin(team.id)}
            disabled={!accepting || joiningTeamId === team.id || actionsDisabled}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {joiningTeamId === team.id
              ? 'Sending request...'
              : accepting
              ? 'Request to join'
              : isFull
              ? 'Team is full'
              : 'Not accepting requests'}
          </button>
        </div>
      );
    })}
  </div>
);

const TeamRegistrationView = ({
  userId,
  teamConfig,
  manager,
  registrationClosed = false,
  hasParticipated = false,
  onRegistrationComplete,
}) => {
  const [activeTab, setActiveTab] = useState('my-team');
  const [creating, setCreating] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState(null);
  const [joinNotes, setJoinNotes] = useState({});
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [profilePreview, setProfilePreview] = useState({ open: false, loading: false, error: '', data: null, userId: null });
  const [memberNames, setMemberNames] = useState({});
  const loadedProfilesRef = useRef(new Set());

  const { refresh, mutating, myTeam: managedTeam, membership, openTeams } = manager;
  const myTeam = managedTeam ?? null;
  const membershipStatus = membership?.status ?? null;
  const membershipRole = membership?.role ?? null;
  const youCreatedTeam = myTeam?.created_by === userId;

  const teamMembers = useMemo(() => myTeam?.members ?? [], [myTeam]);
  const acceptedMembers = useMemo(
    () => teamMembers.filter((member) => member.status === 'accepted'),
    [teamMembers],
  );
  const pendingMembers = useMemo(
    () => teamMembers.filter((member) => member.status === 'pending'),
    [teamMembers],
  );

  const teamMin = myTeam?.min_size ?? teamConfig?.minSize ?? 1;
  const teamMax = myTeam?.max_size ?? teamConfig?.maxSize ?? null;
  const acceptedCount = acceptedMembers.length;
  const pendingCount = pendingMembers.length;
  const teamLocked = myTeam?.status === 'locked';
  const isCaptain = membershipRole === 'captain' || youCreatedTeam;

  const joinableTeams = useMemo(
    () =>
      (openTeams ?? [])
        .filter((team) =>
          !(team.members ?? []).some((member) =>
            member.user_id === userId && ['accepted', 'pending'].includes(member.status),
          ),
        )
        .filter((team) => {
          const members = team.members ?? [];
          const accepted = members.filter((member) => member.status === 'accepted').length;
          const pending = members.filter((member) => member.status === 'pending').length;
          if (!team.max_size) return true;
          return accepted + pending < team.max_size;
        }),
    [openTeams, userId],
  );

  const disableActions = registrationClosed;

  const getMemberName = useCallback(
    (member) => {
      if (!member) return 'Team member';
      if (member.profiles?.full_name) return member.profiles.full_name;
      const cached = memberNames?.[member.user_id];
      if (cached) return cached;
      if (member.role === 'captain') return 'Team captain';
      return 'Team member';
    },
    [memberNames],
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const ids = new Set();
    (myTeam?.members ?? []).forEach((member) => ids.add(member.user_id));
    (openTeams ?? []).forEach((team) => (team.members ?? []).forEach((member) => ids.add(member.user_id)));
    if (membership?.team?.members) {
      (membership.team.members ?? []).forEach((member) => ids.add(member.user_id));
    }
    const missing = Array.from(ids).filter((id) => id && !loadedProfilesRef.current.has(id));
    if (missing.length === 0) {
      return;
    }

    let cancelled = false;
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', missing);
      if (error) {
        console.error('fetchProfiles error', error);
        return;
      }
      if (cancelled || !data) {
        return;
      }
      setMemberNames((prev) => {
        const next = { ...prev };
        data.forEach((profile) => {
          if (profile?.id) {
            loadedProfilesRef.current.add(profile.id);
            next[profile.id] = profile.full_name ?? '';
          }
        });
        return next;
      });
    };

    fetchProfiles();

    return () => {
      cancelled = true;
    };
  }, [myTeam, openTeams, membership]);

  const resetFeedback = () => {
    setActionMessage('');
    setActionError('');
  };

  const handleViewProfile = async (memberId) => {
    if (!memberId) return;
    setProfilePreview({ open: true, loading: true, error: '', data: null, userId: memberId });
    if (!supabase) {
      setProfilePreview({
        open: true,
        loading: false,
        error: 'Profile details are unavailable in demo mode.',
        data: null,
        userId: memberId,
      });
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select(
        'full_name, department, graduation_year, interests, bio, college_unique_id, college_email, phone',
      )
      .eq('id', memberId)
      .maybeSingle();
    if (error) {
      setProfilePreview({
        open: true,
        loading: false,
        error: error.message ?? 'Unable to load profile right now.',
        data: null,
        userId: memberId,
      });
      return;
    }
    setProfilePreview({ open: true, loading: false, error: '', data, userId: memberId });
  };

  const closeProfilePreview = () => {
    setProfilePreview({ open: false, loading: false, error: '', data: null, userId: null });
  };

  useEffect(() => {
    if (activeTab === 'discover') {
      refresh();
    }
  }, [activeTab, refresh]);

  const handleCreate = async (values) => {
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    setCreating(true);
    resetFeedback();
    const { error } = await manager.createTeam(values);
    if (error) {
      setActionError(error.message ?? 'Unable to create team right now.');
    } else {
      setActiveTab('my-team');
      setActionMessage('Team created! Invite friends or share the details.');
    }
    setCreating(false);
  };

  const handleJoin = async (teamId) => {
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    setJoiningTeamId(teamId);
    resetFeedback();
    const note = (joinNotes[teamId] ?? '').trim();
    const { error } = await manager.joinTeam({ teamId, note });
    if (error) {
      setActionError(error.message ?? 'Could not send join request.');
    } else {
      setActionMessage('Join request sent. Team captain will respond soon.');
      setJoinNotes((prev) => ({ ...prev, [teamId]: '' }));
    }
    setJoiningTeamId(null);
  };

  const handleJoinNoteChange = (teamId, value) => {
    setJoinNotes((prev) => ({ ...prev, [teamId]: value }));
  };

  const handleAccept = async (teamId, memberId) => {
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    resetFeedback();
    const { error } = await manager.updateMember({ teamId, memberId, status: 'accepted' });
    if (error) {
      setActionError(error.message ?? 'Unable to accept member.');
    }
  };

  const handleDecline = async (teamId, memberId) => {
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    resetFeedback();
    const { error } = await manager.updateMember({ teamId, memberId, status: 'declined' });
    if (error) {
      setActionError(error.message ?? 'Unable to decline request.');
    }
  };

  const handleLeave = async (teamId) => {
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    resetFeedback();
    const { error } = await manager.leaveTeam(teamId);
    if (error) {
      setActionError(error.message ?? 'Unable to leave team.');
    } else {
      setActionMessage('You left the team. Feel free to join or create another.');
    }
  };

  const handleCancelJoin = async (teamId) => {
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    resetFeedback();
    const { error } = await manager.cancelJoinRequest(teamId);
    if (error) {
      setActionError(error.message ?? 'Unable to cancel your request.');
    } else {
      setActionMessage('Your join request has been withdrawn.');
    }
  };

  const handleToggleAvailability = async () => {
    if (!myTeam) return;
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    resetFeedback();
    const nextOpenState = !myTeam.open_to_join;
    const { error } = await manager.updateTeamSettings({
      teamId: myTeam.id,
      patch: { open_to_join: nextOpenState },
    });
    if (error) {
      setActionError(error.message ?? 'Unable to update team availability.');
    } else {
      setActionMessage(
        nextOpenState ? 'Your team is now open to new join requests.' : 'Your team is now closed to new requests.',
      );
    }
  };

  const handleFinalize = async () => {
    if (!myTeam) return;
    if (disableActions) {
      setActionError('Registration deadline has passed. No further changes are allowed.');
      return;
    }
    resetFeedback();
    if (acceptedCount < teamMin) {
      setActionError(`You need at least ${teamMin} accepted members before finalising.`);
      return;
    }
    if (teamMax && acceptedCount > teamMax) {
      setActionError(`Reduce your team to ${teamMax} accepted members before finalising.`);
      return;
    }
    const { error } = await manager.finalizeTeam(myTeam.id);
    if (error) {
      setActionError(error.message ?? 'Unable to finalise team.');
    } else {
      setActionMessage('Team locked and registration completed. All members are registered!');
      onRegistrationComplete?.();
    }
  };

  const handleRefreshTeams = async () => {
    resetFeedback();
    await refresh();
    setActionMessage('Team list refreshed.');
  };

  if (manager.loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6 sm:p-8">
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          Loading teams...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            {teamConfig?.description || 'Coordinate with teammates or discover open squads who need collaborators.'}
          </p>
        </div>
        {activeTab === 'discover' && (
          <button
            type="button"
            onClick={handleRefreshTeams}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-green-400 hover:text-green-700"
          >
            Refresh list
          </button>
        )}
      </div>
      <div className="mt-6 flex gap-3 border-b border-gray-200 text-sm font-medium">
        <button
          type="button"
          className={`border-b-2 px-3 py-2 transition ${
            activeTab === 'my-team'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('my-team');
            resetFeedback();
          }}
        >
          My team
        </button>
        <button
          type="button"
          className={`border-b-2 px-3 py-2 transition ${
            activeTab === 'discover'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('discover');
            resetFeedback();
          }}
        >
          Find a team
        </button>
      </div>
      <div className="mt-6 space-y-6">
        {actionMessage && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {actionMessage}
          </div>
        )}
        {actionError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {actionError}
          </div>
        )}
        {registrationClosed && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Registration deadline has passed. You can view your team information, but further updates are disabled.
          </div>
        )}
        {hasParticipated && !registrationClosed && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
            You’re already registered for this competition. Manage your team details below if needed.
          </div>
        )}
        {profilePreview.open && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-blue-900">
                  {profilePreview.data?.full_name ?? 'Profile preview'}
                </h3>
                {profilePreview.loading ? (
                  <p>Loading profile...</p>
                ) : profilePreview.error ? (
                  <p className="text-red-600">{profilePreview.error}</p>
                ) : (
                  <div className="space-y-1 text-blue-900/90">
                    {profilePreview.data?.department && (
                      <p>
                        <strong>Department:</strong> {profilePreview.data.department}
                      </p>
                    )}
                    {profilePreview.data?.graduation_year && (
                      <p>
                        <strong>Graduation year:</strong> {profilePreview.data.graduation_year}
                      </p>
                    )}
                    {profilePreview.data?.college_unique_id && (
                      <p>
                        <strong>College ID:</strong> {profilePreview.data.college_unique_id}
                      </p>
                    )}
                    {profilePreview.data?.college_email && (
                      <p>
                        <strong>College email:</strong> {profilePreview.data.college_email}
                      </p>
                    )}
                    {profilePreview.data?.phone && (
                      <p>
                        <strong>Phone:</strong> {profilePreview.data.phone}
                      </p>
                    )}
                    {profilePreview.data?.interests && (
                      <p>
                        <strong>Interests:</strong> {profilePreview.data.interests}
                      </p>
                    )}
                    {profilePreview.data?.bio && (
                      <p>
                        <strong>Bio:</strong> {profilePreview.data.bio}
                      </p>
                    )}
                    {!profilePreview.data && !profilePreview.loading && !profilePreview.error && (
                      <p>Profile details not shared yet.</p>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={closeProfilePreview}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow hover:bg-blue-100"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {activeTab === 'my-team' ? (
          myTeam ? (
            <div className="space-y-6">
              {youCreatedTeam && (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  You created this team.
                </div>
              )}
              {membershipStatus === 'pending' && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Your join request for this team is awaiting the captain's approval.
                </div>
              )}
              <div className="rounded-xl border border-gray-200 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{myTeam.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{myTeam.description || 'No description added yet.'}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>
                        Accepted: {acceptedCount}
                        {teamMax ? `/${teamMax}` : ''}
                      </span>
                      {pendingCount > 0 && <span>Pending: {pendingCount}</span>}
                      {teamMin > 1 && <span>Minimum required: {teamMin}</span>}
                      <span
                        className={`font-semibold ${
                          teamLocked ? 'text-green-600' : myTeam.open_to_join ? 'text-green-600' : 'text-amber-600'
                        }`}
                      >
                        {teamLocked ? 'Team locked' : myTeam.open_to_join ? 'Accepting requests' : 'Closed to new requests'}
                      </span>
                    </div>
                  </div>
                  {isCaptain && !teamLocked && (
                    <button
                      type="button"
                      onClick={handleToggleAvailability}
                      disabled={mutating || disableActions}
                      className="self-start rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {mutating
                        ? 'Updating...'
                        : myTeam.open_to_join
                        ? 'Close to new requests'
                        : 'Open to new requests'}
                    </button>
                  )}
                </div>
                <div className="mt-5">
                  <TeamMembersList
                    team={myTeam}
                    currentUserId={userId}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onLeave={handleLeave}
                    onCancelRequest={handleCancelJoin}
                    onViewProfile={handleViewProfile}
                    actionsDisabled={disableActions || mutating || teamLocked}
                    getMemberName={getMemberName}
                  />
                </div>
              </div>
              {isCaptain && !teamLocked && (
                <button
                  type="button"
                  onClick={handleFinalize}
                  disabled={mutating || acceptedCount < teamMin || disableActions}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {mutating ? 'Finalising...' : 'Finalise team and register'}
                </button>
              )}
              {teamLocked && (
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  Team registered! See "My Registered Events" for confirmation.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">Create a team</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set up your squad, invite friends, or publish it so other campus hackers can request to join.
                </p>
                <div className="mt-4">
                  <TeamCreateForm
                    defaults={teamConfig}
                    onCreate={handleCreate}
                    creating={creating || mutating}
                    disabled={registrationClosed}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Need teammates?</h3>
                <p className="text-sm text-gray-500">
                  Switch to the "Find a team" tab to browse open squads and send a personalised request.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  disabled={registrationClosed}
                  className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Browse teams
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">Public teams</h3>
              <p className="mt-1 text-sm text-gray-500">
                These squads are recruiting. Include a short note so captains know how you can contribute.
              </p>
              <div className="mt-4">
                <OpenTeamsList
                  teams={joinableTeams}
                  onJoin={handleJoin}
                  joiningTeamId={joiningTeamId}
                  joinNotes={joinNotes}
                  onNoteChange={handleJoinNoteChange}
                  actionsDisabled={registrationClosed}
                  getMemberName={getMemberName}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventRegistrationDrawer = ({
  open,
  onClose,
  event,
  isTeamEvent,
  teamConfig,
  soloAction,
  teamManager,
  userId,
  registrationClosed = false,
  hasParticipated = false,
  onRegistrationComplete,
}) => {
  return (
    <ModalShell isOpen={open} onClose={onClose}>
      {isTeamEvent ? (
        <TeamRegistrationView
          userId={userId}
          teamConfig={teamConfig}
          manager={teamManager}
          registrationClosed={registrationClosed}
          hasParticipated={hasParticipated}
          onRegistrationComplete={onRegistrationComplete}
        />
      ) : (
        <SoloRegistrationView
          event={event}
          onRegister={soloAction.onRegister}
          registering={soloAction.submitting}
          statusMessage={soloAction.message}
          statusError={soloAction.error}
          registrationClosed={registrationClosed}
          hasParticipated={hasParticipated}
        />
      )}
    </ModalShell>
  );
};

export default EventRegistrationDrawer;
