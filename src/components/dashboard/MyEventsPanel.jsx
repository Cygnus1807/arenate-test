import { formatDate } from '../../utils/formatDate';

const MyEventsPanel = ({ events }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    <h3 className="text-xl font-bold mb-4">My Registered Events</h3>
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-peach-50 border border-peach-200 p-3 rounded-lg flex items-center justify-between"
        >
          <div>
            <p className="font-semibold">{event.name}</p>
            <p className="text-xs text-red-600 font-medium">Deadline: {formatDate(event.deadline, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ))}
    </div>
  </div>
);

export default MyEventsPanel;
