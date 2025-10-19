import { memo } from 'react';
import { formatDate } from '../../utils/formatDate';

const categoryBadgeClass = (category) => {
  switch (category) {
    case 'Tech':
      return 'bg-blue-500';
    case 'Cultural':
      return 'bg-purple-500';
    case 'Sports':
      return 'bg-red-500';
    case 'Business':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-500';
  }
};

const typeBadgeClass = (type) => {
  const normalized = type?.toLowerCase?.() ?? '';
  if (normalized === 'competition') return 'bg-orange-100 text-orange-700';
  return 'bg-slate-100 text-slate-700';
};

const EventCard = memo(({ event, onView, isParticipating }) => {
  const registrationDeadline = event.details?.registrationDeadline ?? null;
  const deadlineText = registrationDeadline ? formatDate(registrationDeadline) : 'See details';
  const typeLabel = (event.type ?? event.details?.type ?? 'Event').toString();
  const now = Date.now();
  const deadlineTime = registrationDeadline ? new Date(registrationDeadline).getTime() : null;
  const eventTime = event.date ? new Date(event.date).getTime() : null;
  const isClosed = deadlineTime != null ? deadlineTime < now : eventTime != null ? eventTime < now : false;
  const statusLabel = isClosed ? 'Registration closed' : 'Open for registration';
  const statusClass = isClosed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  const hasDeadline = Boolean(registrationDeadline);
  const statusDescription = isClosed
    ? hasDeadline
      ? `Closed on ${deadlineText}`
      : 'Registration closed'
    : hasDeadline
    ? `Register before ${deadlineText}`
    : 'Registration window coming soon';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onView(event)}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          onView(event);
        }
      }}
      className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      <div className="relative">
        <img src={event.img} alt={event.name} className="h-40 w-full object-cover" />
        <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${categoryBadgeClass(event.category)}`}>
          {event.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClass}`}>{statusLabel}</span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${typeBadgeClass(typeLabel)}`}>
            {typeLabel}
          </span>
          {isParticipating && (
            <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-700">
              Registered
            </span>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
          <p className="text-sm text-gray-500">{event.organizer}</p>
        </div>
        <div className="mt-auto space-y-1 text-sm">
          <p className="text-xs text-gray-600">{statusDescription}</p>
          <p className="font-medium text-gray-800">{formatDate(event.date)}</p>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';

const EventGrid = ({ events, onView, participatedIds }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {events.map((event) => (
      <EventCard
        key={event.id}
        event={event}
        onView={onView}
        isParticipating={participatedIds?.has?.(event?.id != null ? String(event.id) : '') ?? false}
      />
    ))}
  </div>
);

export default EventGrid;
