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

const EventCard = ({ event, onView }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onView(event)}
    onKeyDown={(evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        onView(event);
      }
    }}
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col group cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
  >
    <div className="relative">
      <img src={event.img} alt={event.name} className="h-40 w-full object-cover" />
      <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${categoryBadgeClass(event.category)}`}>
        {event.category}
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-bold">{event.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{event.organizer}</p>
      <p className="text-sm mt-auto">{formatDate(event.date)}</p>
    </div>
  </div>
);

const EventGrid = ({ events, onView }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {events.map((event) => (
      <EventCard key={event.id} event={event} onView={onView} />
    ))}
  </div>
);

export default EventGrid;
