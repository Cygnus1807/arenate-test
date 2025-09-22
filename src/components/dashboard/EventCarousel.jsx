const EventCarousel = ({ events, currentSlide, onPrev, onNext }) => (
  <div className="relative w-full h-56 sm:h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
    {events.map((event, index) => (
      <div
        key={event.id}
        className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img src={event.details?.largeImg || event.img} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 text-white">
          <h2 className="text-2xl sm:text-4xl font-bold">{event.name}</h2>
          <p className="text-lg sm:text-xl">{event.organizer}</p>
        </div>
      </div>
    ))}
    <button
      aria-label="Previous slide"
      onClick={onPrev}
      className="hidden group-hover:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    <button
      aria-label="Next slide"
      onClick={onNext}
      className="hidden group-hover:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
);

export default EventCarousel;
