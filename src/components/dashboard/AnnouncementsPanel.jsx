const badgeStyles = {
  Update: 'bg-blue-50 border-blue-400',
  New: 'bg-green-50 border-green-400',
  Deadline: 'bg-red-50 border-red-400',
};

const badgeLabelStyles = {
  Update: 'bg-blue-100 text-blue-800',
  New: 'bg-green-100 text-green-800',
  Deadline: 'bg-red-100 text-red-800',
};

const AnnouncementsPanel = ({ announcements }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    <h3 className="text-xl font-bold mb-4">Announcements</h3>
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`p-4 rounded-lg border-l-4 ${badgeStyles[announcement.type] ?? 'bg-gray-50 border-gray-300'}`}
        >
          <div className="flex items-center">
            <span
              className={`text-xs font-bold uppercase mr-2 px-2 py-0.5 rounded-full ${
                badgeLabelStyles[announcement.type] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {announcement.type}
            </span>
            <h4 className="font-semibold text-sm flex-1">{announcement.title}</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AnnouncementsPanel;
