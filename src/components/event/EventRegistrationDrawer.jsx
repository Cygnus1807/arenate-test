import { useEffect, useMemo, useState } from 'react';
import { formatDate } from '../../utils/formatDate';

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

const SoloRegistrationView = ({ event, onRegister, registering, statusMessage, statusError }) => (
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
        {event.details?.registrationDeadline ? formatDate(event.details.registrationDeadline) : 'See schedule'}
      </p>
    </div>
    <button
      type="button"
      onClick={onRegister}
      disabled={registering}
      className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {registering ? 'Registering...' : 'Confirm registration'}
    </button>
    {statusMessage && (
      <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{statusMessage}</p>
    )}
    {statusError && (
      <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{statusError}</p>
    )}
  </div>
);

const TeamCreateForm = ({ defaults, onCreate, creating }) => {
  const fixedSize = Boolean(defaults?.minSize && defaults?.maxSize && defaults.minSize === defaults.maxSize);
  const [form, setForm] = useState({
    name: '',
    description: '',
    openToJoin: true,
    maxSize: fixedSize ? defaults?.maxSize : defaults?.maxSize ?? '',
    visibility: 'public',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (form.visibility === 'private' && form.openToJoin) {
      setForm((prev) => ({ ...prev, openToJoin: false }));
    }
  }, [form.visibility, form.openToJoin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    if (fixedSize) {
      maxSizeValue = defaults?.maxSize;
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
      visibility: form.visibility,
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
          disabled={creating}
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
          disabled={creating}
        />
      </div>
      <div>
        <span className="text-sm font-medium text-gray-700">Team visibility</span>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              form.visibility === 'public'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-600 hover:border-green-400'
            }`}
            onClick={() => setForm((prev) => ({ ...prev, visibility: 'public', openToJoin: true }))}
            disabled={creating}
          >
            Public
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              form.visibility === 'private'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-600 hover:border-green-400'
            }`}
            onClick={() => setForm((prev) => ({ ...prev, visibility: 'private', openToJoin: false }))}
            disabled={creating}
          >
            Private (code required)
          </button>
        </div>
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
            max={defaults?.maxSize ?? undefined}
            value={form.maxSize ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, maxSize: event.target.value }))}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder={defaults?.maxSize ?? 'e.g. 4'}
            disabled={creating || fixedSize}
          />
          <p className="mt-1 text-xs text-gray-500">
            {fixedSize
              ? `Teams must have exactly ${defaults?.minSize ?? 1} members.`
              : `Aim for between ${defaults?.minSize ?? 1}${
                  defaults?.maxSize ? ` and ${defaults.maxSize} members` : ' members or more'
                }.`}
          </p>
        </div>
        <div className="flex items-end">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.openToJoin}
              onChange={(event) => setForm((prev) => ({ ...prev, openToJoin: event.target.checked }))}
              className="mr-2"
              disabled={creating || form.visibility === 'private'}
            />
            Open for other students to request to join
          </label>
        </div>
      </div>
      {form.visibility === 'private' ? (
        <p className="text-xs text-gray-500">
          Private teams stay hidden. Share the join code with teammates so they can join instantly.
        </p>
      ) : (
        <p className="text-xs text-gray-500">Public teams appear in the discovery list for this event.</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={creating}
        className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creating ? 'Creating team...' : 'Create team'}
      </button>
    </form>
  );
};

const TeamMembersList = ({ team, currentUserId, onAccept, onDecline, onLeave, onCancelRequest }) => {
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
    return member.profiles?.full_name || member.user_id;
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Team members</h3>
        <ul className="mt-2 space-y-2">
          {accepted.length ? (
            accepted.map((member) => (
              <li
                key={member.user_id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium text-gray-800">{renderMemberName(member)}</span>
                  {member.role === 'captain' && (
                    <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Captain
                    </span>
                  )}
                </div>
                {member.user_id === currentUserId && !teamLocked && (
                  <button
                    type="button"
                    onClick={() => onLeave?.(team.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Leave team
                  </button>
                )}
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
                <li
                  key={member.user_id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-800">{renderMemberName(member)}</span>
                    <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelf ? (
                      <button
                        type="button"
                        onClick={() => onCancelRequest?.(team.id)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                      >
                        Cancel request
                      </button>
                    ) : isCaptain ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onAccept?.(team.id, member.user_id)}
                          className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => onDecline?.(team.id, member.user_id)}
                          className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">Waiting for captain</span>
                    )}
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

const OpenTeamsList = ({ teams, onJoin, joiningTeamId }) => (
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
      const isFull = Boolean(team.max_size && accepted >= team.max_size);
      const accepting = team.open_to_join && !isFull && team.status !== 'locked';
      return (
        <div key={team.id} className="rounded-xl border border-gray-200 p-4 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-gray-800">{team.name}</h4>
              <p className="mt-1 text-xs text-gray-500">{team.description || 'Looking for collaborators.'}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>
                Accepted: {accepted}
                {team.max_size ? `/${team.max_size}` : ''}
              </p>
              {pending > 0 && <p>Pending: {pending}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onJoin(team.id)}
            disabled={!accepting || joiningTeamId === team.id}
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

const TeamRegistrationView = ({ userId, teamConfig, manager, onRegistrationComplete }) => {
  const [activeTab, setActiveTab] = useState('my-team');
  const [creating, setCreating] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState(null);
  const [joiningByCode, setJoiningByCode] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

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
        .filter((team) => team.visibility === 'public')
        .filter((team) =>
          !(team.members ?? []).some((member) =>
            member.user_id === userId && ['accepted', 'pending'].includes(member.status),
          ),
        )
        .filter((team) => {
          const accepted = (team.members ?? []).filter((member) => member.status === 'accepted').length;
          if (!team.max_size) return true;
          return accepted < team.max_size;
        }),
    [openTeams, userId],
  );

  const resetFeedback = () => {
    setActionMessage('');
    setActionError('');
  };

  useEffect(() => {
    if (activeTab === 'discover') {
      refresh();
    }
  }, [activeTab, refresh]);

  const handleCreate = async (values) => {
    setCreating(true);
    resetFeedback();
    const { error } = await manager.createTeam(values);
    if (error) {
      setActionError(error.message ?? 'Unable to create team right now.');
    } else {
      setActiveTab('my-team');
      setActionMessage('Team created! Invite friends or share the code.');
    }
    setCreating(false);
  };

  const handleJoin = async (teamId) => {
    setJoiningTeamId(teamId);
    resetFeedback();
    const { error } = await manager.joinTeam(teamId);
    if (error) {
      setActionError(error.message ?? 'Could not send join request.');
    } else {
      setActionMessage('Join request sent. Team captain will respond soon.');
    }
    setJoiningTeamId(null);
  };

  const handleJoinByCode = async (event) => {
    event.preventDefault();
    const code = joinCodeInput.trim().toUpperCase();
    if (!code) {
      setActionError('Enter a join code.');
      return;
    }
    setJoiningByCode(true);
    resetFeedback();
    const { error } = await manager.joinTeamByCode(code);
    if (error) {
      setActionError(error.message ?? 'Unable to join with that code.');
    } else {
      setJoinCodeInput('');
      setActiveTab('my-team');
      setActionMessage('You joined the team successfully.');
    }
    setJoiningByCode(false);
  };

  const handleAccept = async (teamId, memberId) => {
    resetFeedback();
    const { error } = await manager.updateMember({ teamId, memberId, status: 'accepted' });
    if (error) {
      setActionError(error.message ?? 'Unable to accept member.');
    }
  };

  const handleDecline = async (teamId, memberId) => {
    resetFeedback();
    const { error } = await manager.updateMember({ teamId, memberId, status: 'declined' });
    if (error) {
      setActionError(error.message ?? 'Unable to decline request.');
    }
  };

  const handleLeave = async (teamId) => {
    resetFeedback();
    const { error } = await manager.leaveTeam(teamId);
    if (error) {
      setActionError(error.message ?? 'Unable to leave team.');
    } else {
      setActionMessage('You left the team. Feel free to join or create another.');
    }
  };

  const handleCancelJoin = async (teamId) => {
    resetFeedback();
    const { error } = await manager.cancelJoinRequest(teamId);
    if (error) {
      setActionError(error.message ?? 'Unable to cancel your request.');
    } else {
      setActionMessage('Your join request has been withdrawn.');
    }
  };

  const handleToggleAvailability = async () => {
    if (!myTeam || myTeam.visibility !== 'public') return;
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

  const handleCopyJoinCode = async () => {
    if (!myTeam?.join_code) {
      return;
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(myTeam.join_code);
        setActionMessage('Join code copied to clipboard.');
      } else {
        setActionError('Copy is not supported in this browser.');
      }
    } catch (copyError) {
      setActionError(copyError.message ?? 'Unable to copy join code.');
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
                    {myTeam.visibility === 'private' && myTeam.join_code && (
                      <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                        <p className="font-semibold text-gray-700">Private team join code</p>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <code className="rounded bg-white px-2 py-1 font-mono text-gray-800">
                            {myTeam.join_code}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyJoinCode}
                            className="rounded border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 transition hover:border-green-400 hover:text-green-700"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-500">
                          Share this code with teammates so they can join instantly.
                        </p>
                      </div>
                    )}
                  </div>
                  {isCaptain && !teamLocked && myTeam.visibility === 'public' && (
                    <button
                      type="button"
                      onClick={handleToggleAvailability}
                      disabled={mutating}
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
                  />
                </div>
              </div>
              {isCaptain && !teamLocked && (
                <button
                  type="button"
                  onClick={handleFinalize}
                  disabled={mutating || acceptedCount < teamMin}
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
                  />
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">Already have a code?</h3>
                <p className="mt-1 text-sm text-gray-500">Enter the private team code shared by a captain.</p>
                <form className="mt-4 space-y-3" onSubmit={handleJoinByCode}>
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(event) => setJoinCodeInput(event.target.value)}
                    placeholder="e.g. A1B2C3"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    disabled={joiningByCode}
                  />
                  <button
                    type="submit"
                    disabled={joiningByCode}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {joiningByCode ? 'Joining...' : 'Join with code'}
                  </button>
                </form>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">Join with a private code</h3>
              <p className="mt-1 text-sm text-gray-500">Know a captain? Enter the code they shared to join instantly.</p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleJoinByCode}>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(event) => setJoinCodeInput(event.target.value)}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  disabled={joiningByCode}
                />
                <button
                  type="submit"
                  disabled={joiningByCode}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joiningByCode ? 'Joining...' : 'Join team'}
                </button>
              </form>
            </div>
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">Public teams</h3>
              <p className="mt-1 text-sm text-gray-500">
                These squads are recruiting. Introduce yourself when you send a request!
              </p>
              <div className="mt-4">
                <OpenTeamsList teams={joinableTeams} onJoin={handleJoin} joiningTeamId={joiningTeamId} />
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
  onRegistrationComplete,
}) => {
  return (
    <ModalShell isOpen={open} onClose={onClose}>
      {isTeamEvent ? (
        <TeamRegistrationView
          userId={userId}
          teamConfig={teamConfig}
          manager={teamManager}
          onRegistrationComplete={onRegistrationComplete}
        />
      ) : (
        <SoloRegistrationView
          event={event}
          onRegister={soloAction.onRegister}
          registering={soloAction.submitting}
          statusMessage={soloAction.message}
          statusError={soloAction.error}
        />
      )}
    </ModalShell>
  );
};

export default EventRegistrationDrawer;
