import { eventCategories, mockAnnouncements, mockEvents, mockMyEvents } from '../data/mockData';
import supabase from '../utils/supabase';

const EVENTS_TABLE = 'events';
const ANNOUNCEMENTS_TABLE = 'announcements';
const REGISTRATIONS_TABLE = 'registrations';

const mapEventRecord = (record) => ({
  ...record,
  details: record?.details ?? {},
});

const mapAnnouncementRecord = (record) => ({
  ...record,
});

const mapRegistrationRecord = (record) => {
  const event = record.event ?? record;
  return {
    id: event.id,
    name: event.name,
    deadline: record.deadline ?? event.deadline ?? null,
  };
};

export const fetchEvents = async () => {
  if (!supabase) {
    return { data: mockEvents.map(mapEventRecord), error: null, fromMock: true };
  }

  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchEvents error', error);
    return { data: mockEvents.map(mapEventRecord), error, fromMock: true };
  }

  return { data: (data ?? []).map(mapEventRecord), error: null, fromMock: false };
};

export const fetchAnnouncements = async () => {
  if (!supabase) {
    return { data: mockAnnouncements.map(mapAnnouncementRecord), error: null, fromMock: true };
  }

  const { data, error } = await supabase
    .from(ANNOUNCEMENTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchAnnouncements error', error);
    return { data: mockAnnouncements.map(mapAnnouncementRecord), error, fromMock: true };
  }

  return { data: (data ?? []).map(mapAnnouncementRecord), error: null, fromMock: false };
};

export const fetchMyEvents = async ({ userId }) => {
  if (!supabase || !userId) {
    return { data: mockMyEvents.map(mapRegistrationRecord), error: null, fromMock: true };
  }

  const { data, error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .select('event:events(*), deadline')
    .eq('user_id', userId);

  if (error) {
    console.error('fetchMyEvents error', error);
    return { data: mockMyEvents.map(mapRegistrationRecord), error, fromMock: true };
  }

  return {
    data: (data ?? []).map(mapRegistrationRecord),
    error: null,
    fromMock: false,
  };
};

export const getEventCategories = (events, fromMock = false) => {
  if (fromMock) {
    return eventCategories;
  }

  const uniqueCategories = Array.from(new Set((events ?? []).map((event) => event.category).filter(Boolean)));
  if (uniqueCategories.length === 0) {
    return eventCategories;
  }

  return ['All', ...uniqueCategories];
};

export const registerForEvent = async ({ userId, eventId, deadline }) => {
  if (!supabase) {
    console.info('registerForEvent fallback for event id:', eventId);
    return { error: null, fromMock: true };
  }

  if (!userId) {
    return { error: new Error('User must be authenticated to register.'), fromMock: false };
  }

  const { error } = await supabase
    .from(REGISTRATIONS_TABLE)
    .upsert({ user_id: userId, event_id: eventId, deadline }, { onConflict: 'user_id,event_id' });

  if (error) {
    console.error('registerForEvent error', error);
    return { error, fromMock: false };
  }

  return { error: null, fromMock: false };
};


