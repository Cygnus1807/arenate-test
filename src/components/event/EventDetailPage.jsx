import { useEffect, useState } from 'react';
import { BackIcon, UserCircleIcon } from '../shared/Icons';
import { formatDate } from '../../utils/formatDate';

const tabDefinitions = ['About', 'Rules', 'Timeline', 'Prizes', 'Contact'];

const prizeLabel = (key) => {
  switch (key) {
    case 'first':
      return '1st';
    case 'second':
      return '2nd';
    case 'third':
      return '3rd';
    default:
      return key;
  }
};

const capitalise = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return String(value);
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const EventDetailPage = ({
  event,
  onBack,
  onOpenRegistration,
  onOpenProfile,
  registrationClosed = false,
  hasParticipated = false,
}) => {
  const { name, organizer, category, type, date, details = {}, img } = event;
  const [activeTab, setActiveTab] = useState('About');
  const [shareStatus, setShareStatus] = useState('');

  const registrationDeadline = details.registrationDeadline ?? null;
  const eventType = capitalise(type ?? details.type ?? 'Event');

  const handleShare = async () => {
    if (typeof window === 'undefined') {
      setShareStatus('Sharing is only available in the browser.');
      return;
    }
    const shareUrl = window.location.href;
    const sharePayload = {
      title: name,
      text: `Check out the ${eventType.toLowerCase()} “${name}” on Arenate.`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        setShareStatus('Shared successfully.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('Link copied to clipboard.');
      } else {
        setShareStatus(`Share this link manually: ${shareUrl}`);
      }
    } catch (error) {
      console.error('share link error', error);
      setShareStatus('Unable to share right now. Try again later.');
    }
  };

  useEffect(() => {
    if (!shareStatus) return undefined;
    const timeout = setTimeout(() => setShareStatus(''), 4000);
    return () => clearTimeout(timeout);
  }, [shareStatus]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return <p className="text-gray-600 leading-relaxed">{details.description || 'No description available.'}</p>;
      case 'Rules':
        return (
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {(details.rules ?? []).length > 0 ? (
              details.rules.map((rule, index) => <li key={index}>{rule}</li>)
            ) : (
              <li>No rules specified.</li>
            )}
          </ul>
        );
      case 'Timeline':
        return (details.timeline ?? []).length > 0 ? (
          <div className="space-y-4">
            {details.timeline.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="bg-green-100 text-green-800 font-semibold rounded-md px-3 py-1 text-sm w-28 text-center">
                  {item.time}
                </span>
                <div className="border-l-2 border-green-200 ml-4 pl-4">
                  <p className="font-medium text-gray-700">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No timeline available.</p>
        );
      case 'Prizes':
        return Object.keys(details.prizes ?? {}).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(details.prizes).map(([key, value]) => (
              <div key={key} className="flex items-start">
                <span className="mr-3 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {prizeLabel(key)}
                </span>
                <div>
                  <p className="font-bold capitalize text-green-700">{key} Prize</p>
                  <p className="text-gray-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No prize information available.</p>
        );
      case 'Contact':
        return (details.organizers ?? []).length > 0 ? (
          <div className="space-y-3">
            {details.organizers.map((person, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-bold text-gray-800">{person.name}</p>
                <p className="text-sm text-gray-500">{person.role}</p>
                <a href={`tel:${person.phone}`} className="text-sm text-green-600 hover:underline">
                  {person.phone}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No contact information.</p>
        );
      default:
        return null;
    }
  };

  const categoryColor =
    category === 'Tech'
      ? 'bg-blue-500'
      : category === 'Cultural'
      ? 'bg-purple-500'
      : category === 'Sports'
      ? 'bg-red-500'
      : category === 'Business'
      ? 'bg-yellow-600'
      : 'bg-gray-500';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition"
            >
              <BackIcon />
              <span>Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full border border-transparent p-1 text-gray-600 transition hover:border-gray-200 hover:text-gray-800"
                aria-label="Share competition"
              >
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 8a3 3 0 10-2.83-4H12a3 3 0 100 6h.17M9 16l6-8m0 8a3 3 0 11-2.83 4H12a3 3 0 110-6h.17"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onOpenProfile?.()}
                className="rounded-full border border-transparent p-1 text-gray-600 transition hover:border-gray-200 hover:text-gray-800"
                aria-label="Open profile"
              >
                <UserCircleIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="relative h-48 md:h-64 lg:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img src={details.largeImg || img} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 sm:p-8 text-white">
            <span className={`text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block text-white ${categoryColor}`}>
              {category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold">{name}</h1>
            <h2 className="text-lg md:text-xl font-light">Organized by {organizer}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-white/20 px-3 py-1 font-semibold uppercase tracking-wide">
                {eventType}
              </span>
              {hasParticipated && (
                <span className="rounded-full bg-green-600/80 px-3 py-1 font-semibold text-white">
                  You’re participating
                </span>
              )}
              {registrationClosed && (
                <span className="rounded-full bg-red-600/80 px-3 py-1 font-semibold text-white">
                  Registration closed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {tabDefinitions.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition ${
                      activeTab === tab
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div>{renderTabContent()}</div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xl font-bold border-b pb-2">Event Details</h3>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <div>
                  <strong>Type:</strong> {eventType}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <strong>Date:</strong> {formatDate(date, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>Time:</strong> {formatDate(date, { hour: '2-digit', minute: '2-digit' })} onwards
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div>
                  <strong>Venue:</strong> {details.venue || 'TBD'}
                </div>
              </div>
              <div className="p-4 bg-peach-50 border border-peach-200 rounded-lg mt-4 text-center">
                <p className="font-bold text-gray-800">Registration Closes</p>
                <p className="text-red-600 font-semibold">
                  {registrationDeadline ? formatDate(registrationDeadline) : 'To be announced'}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 shadow hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  onClick={onOpenRegistration}
                  disabled={registrationClosed}
                >
                  {registrationClosed ? 'Registration closed' : 'Register / Manage team'}
                </button>
                {shareStatus && (
                  <p className="text-xs text-center text-gray-500">{shareStatus}</p>
                )}
              </div>
              {registrationClosed && (
                <p className="text-xs text-center text-gray-500">
                  Registration closed on {registrationDeadline ? formatDate(registrationDeadline) : 'the specified deadline'}.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default EventDetailPage;
