export const mockEvents = [
  {
    id: 1,
    name: "Code Sprint '25",
    organizer: 'Tech Club',
    category: 'Tech',
    type: 'Competition',
    date: '2025-10-15T10:00:00',
    img: 'https://placehold.co/600x400/a7f3d0/166534?text=Code+Sprint',
    details: {
      endDate: '2025-10-15T17:00:00',
      venue: 'CS Department, Lab 301',
      registrationDeadline: '2025-10-12T23:59:00',
      largeImg: "https://placehold.co/1200x400/a7f3d0/166534?text=Code+Sprint+'25",
      description:
        "Welcome to Code Sprint '25, the flagship competitive programming event of Hillside Engineering College! This is a team-based contest designed to challenge your problem-solving skills, algorithmic knowledge, and coding speed. Get ready for a day of intense coding, collaboration, and learning.",
      rules: [
        'Teams must consist of 2 members from the same college.',
        'The competition will be held on the HackerRank platform.',
        'There will be 6 problems to solve in a 5-hour window.',
        'Use of any programming language supported by the platform is allowed.',
        'Any form of plagiarism will result in immediate disqualification.',
      ],
      prizes: {
        first: '₹10,000 Cash + Certificates + Goodies',
        second: '₹5,000 Cash + Certificates',
        third: '₹2,500 Cash + Certificates',
      },
      timeline: [
        { time: '09:30 AM', activity: 'Reporting & Check-in' },
        { time: '10:00 AM', activity: 'Competition Starts' },
        { time: '01:00 PM', activity: 'Lunch Break (30 mins)' },
        { time: '03:30 PM', activity: 'Competition Ends' },
        { time: '04:00 PM', activity: 'Prize Distribution Ceremony' },
      ],
      organizers: [
        { name: 'Rahul Verma', role: 'Event Head', phone: '+91 98765 43210' },
        { name: 'Priya Sharma', role: 'Coordinator', phone: '+91 87654 32109' },
      ],
      team: {
        isTeamEvent: true,
        minSize: 2,
        maxSize: 2,
        description: 'Form a pair before registering.',
      },
    },
  },
  {
    id: 2,
    name: 'Melody Fest',
    organizer: 'Music Society',
    category: 'Cultural',
    type: 'Event',
    date: '2025-10-20T18:00:00',
    img: 'https://placehold.co/600x400/fed7aa/7c2d12?text=Melody+Fest',
    details: {
      registrationDeadline: '2025-10-18T23:59:00',
    },
  },
  {
    id: 3,
    name: 'Startup Pitch Day',
    organizer: 'E-Cell',
    category: 'Entrepreneurship',
    type: 'Competition',
    date: '2025-10-22T14:00:00',
    img: 'https://placehold.co/600x400/bae6fd/0c4a6e?text=Pitch+Day',
    details: {
      registrationDeadline: '2025-10-19T20:00:00',
    },
  },
  {
    id: 4,
    name: 'Campus Premier League',
    organizer: 'Sports Committee',
    category: 'Sports',
    type: 'Competition',
    date: '2025-10-25T09:00:00',
    img: 'https://placehold.co/600x400/d4d4d8/18181b?text=CPL+25',
    details: {
      registrationDeadline: '2025-10-20T23:59:00',
      team: {
        isTeamEvent: true,
        minSize: 11,
        maxSize: 15,
        description: 'Register your squad. Minimum 11 players required.',
      },
    },
  },
  {
    id: 5,
    name: 'Robo Wars',
    organizer: 'Robotics Club',
    category: 'Tech',
    type: 'Competition',
    date: '2025-11-01T11:00:00',
    img: 'https://placehold.co/600x400/fecaca/7f1d1d?text=Robo+Wars',
    details: {
      registrationDeadline: '2025-10-28T23:59:00',
    },
  },
  {
    id: 6,
    name: 'Designing Your Career Journey',
    organizer: 'Student Success Office',
    category: 'Experience',
    type: 'Event',
    date: '2025-11-10T16:00:00',
    img: 'https://placehold.co/600x400/c7d2fe/1e1b4b?text=Career+Journey',
    details: {
      registrationDeadline: '2025-11-08T18:00:00',
    },
  },
];

export const mockAnnouncements = [
  {
    id: 1,
    type: 'Update',
    title: 'Rule Change in Code Sprint',
    content: 'The time limit for the final round has been extended by 30 minutes.',
  },
  {
    id: 2,
    type: 'New',
    title: "New Event Added: 'Designathon'",
    content: 'A new UI/UX design competition is now open for registration!',
  },
  {
    id: 3,
    type: 'Deadline',
    title: 'Melody Fest Registration Closes Soon',
    content: "Last day to register is Oct 18. Don't miss out!",
  },
];

export const mockMyEvents = [
  { id: 1, name: "Code Sprint '25", deadline: '2025-10-12' },
  { id: 4, name: 'Campus Premier League', deadline: '2025-10-20' },
];

export const eventCategories = ['All', 'Business', 'Entrepreneurship', 'Tech', 'Sports', 'Cultural', 'Experience'];
