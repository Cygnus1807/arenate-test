import { useMemo, useState } from 'react';
import EventCarousel from './EventCarousel';
import EventFilters from './EventFilters';
import EventGrid from './EventGrid';
import AnnouncementsPanel from './AnnouncementsPanel';
import MyEventsPanel from './MyEventsPanel';
import DashboardHeader from './DashboardHeader';

const DashboardPage = ({
  events,
  announcements,
  myEvents,
  categories,
  onViewEvent,
  loading,
  error,
  usingMockData,
  onRefresh,
  userEmail,
  onSignOut,
  onOpenProfile,
  profileIncomplete = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [participationFilter, setParticipationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredEvents = useMemo(() => events.slice(0, 3), [events]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveFilter('All');
    setParticipationFilter('All');
    setStatusFilter('All');
    setTypeFilter('All');
  };

  const participatedIds = useMemo(() => {
    const ids = new Set();
    (myEvents ?? []).forEach((item) => {
      if (item?.id != null) {
        ids.add(String(item.id));
      }
    });
    return ids;
  }, [myEvents]);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const eventIdKey = event?.id != null ? String(event.id) : undefined;
        const matchesCategory = activeFilter === 'All' || event.category === activeFilter;
        const matchesSearch =
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
        const isParticipating = eventIdKey ? participatedIds.has(eventIdKey) : false;
        const matchesParticipation =
          participationFilter === 'All' ||
          (participationFilter === 'Participated' && isParticipating) ||
          (participationFilter === 'Not Participated' && !isParticipating);
        const registrationDeadline = event.details?.registrationDeadline ?? null;
        const eventDate = event.date ?? null;
        const now = Date.now();
        const deadlineTime = registrationDeadline ? new Date(registrationDeadline).getTime() : null;
        const eventTime = eventDate ? new Date(eventDate).getTime() : null;
        const isClosed = deadlineTime != null ? deadlineTime < now : eventTime != null ? eventTime < now : false;
        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Active' && !isClosed) ||
          (statusFilter === 'Closed' && isClosed);
        const eventType = (event.type ?? event.details?.type ?? 'Event').toString().toLowerCase();
        const matchesType =
          typeFilter === 'All' ||
          (typeFilter === 'Event' && eventType === 'event') ||
          (typeFilter === 'Competition' && eventType === 'competition');
        return matchesCategory && matchesSearch && matchesParticipation && matchesStatus && matchesType;
      }),
    [events, activeFilter, searchTerm, participationFilter, statusFilter, typeFilter, participatedIds],
  );

  const defaultFiltersActive =
    searchTerm.trim() === '' &&
    activeFilter === 'All' &&
    participationFilter === 'All' &&
    statusFilter === 'All' &&
    typeFilter === 'All';

  const handleViewMyEvent = (eventId) => {
    if (!eventId) return;
    const match = events.find((event) => String(event.id) === String(eventId));
    if (match) {
      onViewEvent?.(match);
    }
  };

  const nextSlide = () => {
    if (featuredEvents.length === 0) return;
    setCurrentSlide((prev) => (prev === featuredEvents.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (featuredEvents.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? featuredEvents.length - 1 : prev - 1));
  };

  const showEmptyState = !loading && filteredEvents.length === 0;

  return (
    <>
      <DashboardHeader userEmail={userEmail} onSignOut={onSignOut} onOpenProfile={onOpenProfile} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="space-y-4">
          {profileIncomplete && !loading && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span className="font-medium">
                Complete your profile to let clubs reach you with relevant competitions.
              </span>
              <button
                type="button"
                onClick={onOpenProfile}
                className="self-start rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 md:self-auto"
              >
                Go to My Profile
              </button>
            </div>
          )}
          {loading && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Syncing with Supabase...
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {`Something went wrong while loading data${usingMockData ? ' - showing fallback data instead.' : '.'}`}
              {onRefresh && (
                <button onClick={onRefresh} className="ml-2 font-semibold underline">
                  Retry
                </button>
              )}
            </div>
          )}
          {!loading && usingMockData && !error && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Supabase credentials are missing or unreachable. Displaying local sample data.
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <EventCarousel events={featuredEvents} currentSlide={currentSlide} onNext={nextSlide} onPrev={prevSlide} />
            <EventFilters
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              categories={categories}
              activeCategory={activeFilter}
              onCategoryChange={setActiveFilter}
              participationFilter={participationFilter}
              onParticipationFilterChange={setParticipationFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              onResetFilters={handleResetFilters}
              filtersPristine={defaultFiltersActive}
            />
            {showEmptyState ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                No events match your filters just yet.
              </div>
            ) : (
              <EventGrid events={filteredEvents} onView={onViewEvent} participatedIds={participatedIds} />
            )}
          </div>
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <AnnouncementsPanel announcements={announcements} />
            <MyEventsPanel events={myEvents} onViewEvent={handleViewMyEvent} />
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
