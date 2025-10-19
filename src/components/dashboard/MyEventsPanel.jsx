import { formatDate } from '../../utils/formatDate';

const MyEventsPanel = ({ events = [], onViewEvent }) => {
  const hasEvents = (events ?? []).length > 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-4">My Registered Events</h3>
      {hasEvents ? (
        <div className="space-y-3">
          {events.map((event) => {
            const deadlineTime = event.deadline ? new Date(event.deadline).getTime() : null;
            const isDeadlinePast = deadlineTime != null ? deadlineTime < Date.now() : false;
            const statusText = isDeadlinePast ? 'Registration closed' : 'Upcoming deadline';
            const statusClass = isDeadlinePast ? 'text-red-600' : 'text-green-600';

            return (
              <div
                key={event.id}
                className="bg-peach-50 border border-peach-200 p-3 rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <p className={`text-xs font-medium ${statusClass}`}>
                    {statusText}: {formatDate(event.deadline, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="hidden sm:block w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => onViewEvent?.(event.id)}
                    className="rounded-lg border border-green-200 px-3 py-1 text-xs font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
                  >
                    View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          You haven’t registered for any competitions yet. Discover active challenges and secure your spot!
        </div>
      )}
    </div>
  );
};

export default MyEventsPanel;
