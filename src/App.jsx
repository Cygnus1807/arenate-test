import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardPage from './components/dashboard/DashboardPage';
import EventDetailPage from './components/event/EventDetailPage';
import CommunityPostsSection from './components/event/CommunityPostsSection';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/profile/ProfilePage';
import ProfilePrompt from './components/profile/ProfilePrompt';
import EventRegistrationDrawer from './components/event/EventRegistrationDrawer';
import { useEventData } from './hooks/useEventData';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useTeamManager } from './hooks/useTeamManager';
import { useCommunityPosts } from './hooks/useCommunityPosts';

const isProfileComplete = (profile) => Boolean(profile && profile.fullName && profile.department && profile.graduationYear);
const deriveTeamConfig = (details = {}) => {
  const team = details.team ?? {};
  const rawMin = team.minSize ?? team.min_size ?? details.teamMinSize ?? details.team_min_size;
  const rawMax = team.maxSize ?? team.max_size ?? details.teamMaxSize ?? details.team_max_size ?? details.teamMaxParticipants;
  const minSize = rawMin ?? 1;
  const maxSize = rawMax ?? null;
  const declaredTeam = team.isTeamEvent ?? details.isTeamEvent ?? details.teamBased ?? false;
  const inferredTeam = (maxSize ?? 1) > 1 || (minSize ?? 1) > 1;
  const isTeamEvent = Boolean(declaredTeam) || inferredTeam;
  return {
    isTeamEvent,
    minSize,
    maxSize,
    description: team.description ?? details.teamDescription ?? '',
  };
};


const DashboardRoute = ({
  events,
  announcements,
  myEvents,
  categories,
  loading,
  error,
  usingMockData,
  refresh,
  userEmail,
  signOut,
  profileIncomplete,
}) => {
  const navigate = useNavigate();

  return (
    <DashboardPage
      events={events}
      announcements={announcements}
      myEvents={myEvents}
      categories={categories}
      onViewEvent={(event) => navigate(`/events/${event.id}`, { state: { event } })}
      loading={loading}
      error={error}
      usingMockData={usingMockData}
      onRefresh={refresh}
      userEmail={userEmail}
      onSignOut={signOut}
      onOpenProfile={() => navigate('/profile')}
      profileIncomplete={profileIncomplete}
    />
  );
};

const EventDetailRoute = ({ session, events, registerForEvent, refreshEvents }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = session?.user?.id ?? null;
  const [soloStatus, setSoloStatus] = useState({ message: '', error: '' });
  const [soloSubmitting, setSoloSubmitting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const event =
    events.find((item) => item.id === eventId) ||
    location.state?.event ||
    null;

  const teamConfig = deriveTeamConfig(event?.details ?? {});
  const teamManager = useTeamManager({
    eventId: event?.id ?? eventId,
    userId,
    isTeamEvent: teamConfig.isTeamEvent,
  });

  const {
    posts: communityPosts,
    loading: communityLoading,
    error: communityError,
    addPost: addCommunityPost,
    posting: postingCommunity,
    deleting: deletingCommunity,
    removePost: removeCommunityPost,
  } = useCommunityPosts({ eventId: event?.id ?? null, userId });

  useEffect(() => {
    setSoloStatus({ message: '', error: '' });
    setSoloSubmitting(false);
    setDrawerOpen(false);
  }, [eventId]);

  if (!event) {
    return <Navigate to='/dashboard' replace />;
  }

  const handleSoloRegister = async () => {
    setSoloSubmitting(true);
    setSoloStatus({ message: '', error: '' });
    const result = await registerForEvent({
      userId,
      eventId: event.id,
      deadline: event.details?.registrationDeadline ?? null,
    });
    if (result?.error) {
      setSoloStatus({ message: '', error: result.error.message ?? 'Unable to register at this time.' });
    } else {
      setSoloStatus({ message: 'Registration saved. See the My Events list for updates.', error: '' });
      refreshEvents();
    }
    setSoloSubmitting(false);
  };

  const soloAction = {
    onRegister: handleSoloRegister,
    submitting: soloSubmitting,
    message: soloStatus.message,
    error: soloStatus.error,
  };

  return (
    <>
      <EventDetailPage
        event={event}
        onBack={() => navigate(-1)}
        onOpenRegistration={() => setDrawerOpen(true)}
      />
      <CommunityPostsSection
        posts={communityPosts}
        loading={communityLoading}
        error={communityError}
        onCreate={addCommunityPost}
        posting={postingCommunity}
        canPost={Boolean(userId)}
        currentUserId={userId}
        onDelete={removeCommunityPost}
        deleting={deletingCommunity}
      />
      <EventRegistrationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        event={event}
        isTeamEvent={teamConfig.isTeamEvent}
        teamConfig={teamConfig}
        soloAction={soloAction}
        teamManager={teamManager}
        userId={userId}
        onRegistrationComplete={() => {
          refreshEvents();
          setDrawerOpen(false);
        }}
      />
    </>
  );
};

const ProfileRoute = ({ profile, saveProfile, saving, error, refreshProfile }) => {
  const navigate = useNavigate();

  const handleSave = async (values) => {
    const result = await saveProfile(values);
    if (!result?.error) {
      await refreshProfile();
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <ProfilePage
      initialProfile={profile}
      onSave={handleSave}
      saving={saving}
      error={error}
      onSkip={() => navigate('/dashboard')}
    />
  );
};

const ProfilePromptRoute = () => {
  const navigate = useNavigate();
  return <ProfilePrompt onOpenProfile={() => navigate('/profile')} />;
};

const AuthenticatedApp = ({
  session,
  events,
  announcements,
  myEvents,
  categories,
  eventsLoading,
  eventsError,
  usingMockData,
  refreshEvents,
  registerForEvent,
  signOut,
  profile,
  profileLoading,
  profileError,
  saveProfile,
  profileSaving,
  refreshProfile,
}) => {
  const profileComplete = isProfileComplete(profile);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={profileComplete ? '/dashboard' : '/getting-started'} replace />} />
      <Route
        path="/dashboard"
        element={
          profileComplete ? (
            <DashboardRoute
              events={events}
              announcements={announcements}
              myEvents={myEvents}
              categories={categories}
              loading={eventsLoading}
              error={eventsError}
              usingMockData={usingMockData}
              refresh={refreshEvents}
              userEmail={session.user?.email ?? ''}
              signOut={signOut}
              profileIncomplete={!profileComplete}
            />
          ) : (
            <Navigate to="/getting-started" replace />
          )
        }
      />
      <Route
        path="/events/:eventId"
        element={
          profileComplete ? (
            <EventDetailRoute
              session={session}
              events={events}
              registerForEvent={registerForEvent}
              refreshEvents={refreshEvents}
            />
          ) : (
            <Navigate to="/getting-started" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          <ProfileRoute
            profile={profile}
            saveProfile={saveProfile}
            saving={profileSaving || profileLoading}
            error={profileError}
            refreshProfile={refreshProfile}
          />
        }
      />
      <Route
        path="/getting-started"
        element={profileComplete ? <Navigate to="/dashboard" replace /> : <ProfilePromptRoute />}
      />
      <Route path="*" element={<Navigate to={profileComplete ? '/dashboard' : '/getting-started'} replace />} />
    </Routes>
  );
};

const App = () => {
  const {
    session,
    loading: authLoading,
    authError,
    usingMock: authUsingMock,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  } = useSupabaseAuth();

  const user = session?.user ?? null;
  const {
    events,
    announcements,
    myEvents,
    categories,
    loading,
    error,
    usingMockData,
    refresh,
    registerForEvent,
  } = useEventData({ userId: user?.id ?? null });

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    saveProfile,
    refresh: refreshProfile,
  } = useUserProfile(user);

  const [loginError, setLoginError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const eventsWithDefaults = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        details: event.details ?? {},
      })),
    [events],
  );

  const handleLogin = async (credentials) => {
    setLoginError('');
    setSignupSuccess('');
    const { error: signInError } = await signInWithEmail(credentials);
    if (signInError) {
      setLoginError(signInError.message ?? 'Unable to sign in right now.');
    }
  };

  const handleSignUp = async (credentials) => {
    setLoginError('');
    setSignupSuccess('');
    const { error: signUpError } = await signUpWithEmail(credentials);
    if (signUpError) {
      setLoginError(signUpError.message ?? 'Unable to create account right now.');
    } else {
      setSignupSuccess('Account created! Check your inbox for a confirmation link, then sign in.');
    }
  };

  const handleProfileSave = async (values) => {
    setIsSavingProfile(true);
    const result = await saveProfile(values);
    setIsSavingProfile(false);
    return result;
  };

  if (!session) {
    return (
      <LoginPage
        onSubmit={handleLogin}
        onSignUp={handleSignUp}
        loading={authLoading}
        error={loginError || authError}
        mockMode={authUsingMock}
        successMessage={signupSuccess}
      />
    );
  }

  return (
    <AuthenticatedApp
      session={session}
      events={eventsWithDefaults}
      announcements={announcements}
      myEvents={myEvents}
      categories={categories}
      eventsLoading={loading}
      eventsError={error}
      usingMockData={usingMockData}
      refreshEvents={refresh}
      registerForEvent={registerForEvent}
      signOut={signOut}
      profile={profile}
      profileLoading={profileLoading}
      profileError={profileError}
      saveProfile={handleProfileSave}
      profileSaving={isSavingProfile}
      refreshProfile={refreshProfile}
    />
  );
};

export default App;
