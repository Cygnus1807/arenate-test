import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const events = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: "Code Sprint '25",
    organizer: 'Tech Club',
    category: 'Tech',
    date: '2025-10-15T10:00:00+05:30',
    img: 'https://placehold.co/600x400/a7f3d0/166534?text=Code+Sprint',
    details: {
      largeImg: "https://placehold.co/1200x400/a7f3d0/166534?text=Code+Sprint+'25",
      venue: 'CS Department, Lab 301',
      registrationDeadline: '2025-10-12T23:59:00+05:30',
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
    },
  },
  {
    id: randomUUID(),
    name: 'Melody Fest',
    organizer: 'Music Society',
    category: 'Cultural',
    date: '2025-10-20T18:00:00+05:30',
    img: 'https://placehold.co/600x400/fed7aa/7c2d12?text=Melody+Fest',
    details: {
      largeImg: 'https://placehold.co/1200x400/fed7aa/7c2d12?text=Melody+Fest',
      venue: 'Auditorium Block A',
      registrationDeadline: '2025-10-18T23:59:00+05:30',
      description:
        'Join us for an enchanting evening featuring bands, soloists, and the college orchestra. Groove to genres ranging from classical fusion to indie pop.',
      rules: [
        'Registrations can be solo or group (max 5 members).',
        'Each act gets 6 minutes on stage, including setup.',
        'Backing tracks must be submitted 24 hours before the event.',
      ],
      prizes: {
        first: '₹8,000 + Trophy',
        second: '₹4,000 + Certificates',
        audienceChoice: 'Special Hamper',
      },
      timeline: [
        { time: '05:30 PM', activity: 'Sound Check & Setup' },
        { time: '06:00 PM', activity: 'Opening Performance' },
        { time: '07:30 PM', activity: 'Intermission' },
        { time: '08:00 PM', activity: 'Main Performances' },
        { time: '09:30 PM', activity: 'Awards & Closing Jam' },
      ],
      organizers: [
        { name: 'Aditi Menon', role: 'Event Lead', phone: '+91 91234 56780' },
        { name: 'Sahil Gupta', role: 'Backstage Manager', phone: '+91 99876 54321' },
      ],
    },
  },
  {
    id: randomUUID(),
    name: 'Startup Pitch Day',
    organizer: 'E-Cell',
    category: 'Business',
    date: '2025-10-22T14:00:00+05:30',
    img: 'https://placehold.co/600x400/bae6fd/0c4a6e?text=Pitch+Day',
    details: {
      largeImg: 'https://placehold.co/1200x400/bae6fd/0c4a6e?text=Pitch+Day',
      venue: 'Innovation Hub, Block C',
      registrationDeadline: '2025-10-18T23:59:00+05:30',
      description:
        'Pitch your startup idea to leading investors, incubators, and mentors. Receive actionable feedback and compete for incubation grants.',
      rules: [
        'Each team can have up to 4 members.',
        'Pitch duration is 7 minutes followed by 3 minutes Q&A.',
        'Slides must be submitted 12 hours before the event.',
        'Prototypes/demos are encouraged but not mandatory.',
      ],
      prizes: {
        first: '₹50,000 seed grant + Mentorship package',
        second: '₹25,000 seed grant',
        bestStudentFounder: 'Co-working passes for 3 months',
      },
      timeline: [
        { time: '01:30 PM', activity: 'Registration & Networking' },
        { time: '02:00 PM', activity: 'Welcome & Keynote' },
        { time: '02:30 PM', activity: 'Pitch Sessions Begin' },
        { time: '04:30 PM', activity: 'Investor connects' },
        { time: '05:15 PM', activity: 'Awards & Closing Notes' },
      ],
      organizers: [
        { name: 'Riya Kapoor', role: 'Event Director', phone: '+91 90000 12345' },
        { name: 'Harsh Patel', role: 'Mentor Coordinator', phone: '+91 95555 67890' },
      ],
    },
  },
  {
    id: randomUUID(),
    name: 'Campus Premier League',
    organizer: 'Sports Committee',
    category: 'Sports',
    date: '2025-10-25T09:00:00+05:30',
    img: 'https://placehold.co/600x400/d4d4d8/18181b?text=CPL+25',
    details: {
      largeImg: 'https://placehold.co/1200x400/d4d4d8/18181b?text=CPL+25',
      venue: 'Main Cricket Ground',
      registrationDeadline: '2025-10-20T23:59:00+05:30',
      description:
        'The annual cricket showdown is back! Compete with the best teams on campus for the prestigious CPL title.',
      rules: [
        'Each squad can register 15 players.',
        'Matches follow T20 rules.',
        'All players must carry college ID cards.',
        'Use of personal equipment is allowed but must comply with league standards.',
      ],
      prizes: {
        champions: '₹30,000 + Trophy',
        runnersUp: '₹15,000 + Medals',
        bestBatsman: 'Special Bat signed by Alumni',
        bestBowler: 'Professional Gear Kit',
      },
      timeline: [
        { time: '08:00 AM', activity: 'Team Check-in & Warm-ups' },
        { time: '09:00 AM', activity: 'Opening Ceremony & Toss' },
        { time: '09:30 AM', activity: 'League Matches Kick-off' },
        { time: '01:30 PM', activity: 'Lunch Break' },
        { time: '02:30 PM', activity: 'Semi Finals & Finals' },
        { time: '06:30 PM', activity: 'Award Ceremony & Team Photos' },
      ],
      organizers: [
        { name: 'Mehul D’Souza', role: 'Sports Captain', phone: '+91 93450 00011' },
        { name: 'Arun Iyer', role: 'Facilities Coordinator', phone: '+91 98760 12345' },
      ],
    },
  },
];

async function upsertEvents() {
  const { error } = await supabase.from('events').upsert(events, { onConflict: 'id' });
  if (error) {
    console.error('Failed to upsert events:', error);
    process.exit(1);
  }
  console.log(`Upserted ${events.length} events.`);
}

await upsertEvents();
