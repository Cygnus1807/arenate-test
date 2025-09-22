import { useState } from 'react';
import { BackIcon, BellIcon, UserCircleIcon } from '../shared/Icons';
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

const EventDetailPage = ({ event, onBack, onOpenRegistration }) => {
  const { name, organizer, category, date, details = {}, img } = event;
  const [activeTab, setActiveTab] = useState('About');

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
              <BellIcon />
              <UserCircleIcon />
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
                <p className="text-red-600 font-semibold">{formatDate(details.registrationDeadline)}</p>
              </div>
              <button
                className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow hover:shadow-lg"
                onClick={onOpenRegistration}
              >
                Register / Manage team
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default EventDetailPage;
