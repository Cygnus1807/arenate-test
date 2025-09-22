import { useCallback, useEffect, useRef, useState } from 'react';
import { eventCategories as fallbackCategories } from '../data/mockData';
import {
  fetchAnnouncements,
  fetchEvents,
  fetchMyEvents,
  getEventCategories,
  registerForEvent as repositoryRegister,
} from '../services/eventRepository';

const INITIAL_STATE = {
  events: [],
  announcements: [],
  myEvents: [],
  categories: fallbackCategories,
};

export const useEventData = ({ userId } = {}) => {
  const [events, setEvents] = useState(INITIAL_STATE.events);
  const [announcements, setAnnouncements] = useState(INITIAL_STATE.announcements);
  const [myEvents, setMyEvents] = useState(INITIAL_STATE.myEvents);
  const [categories, setCategories] = useState(INITIAL_STATE.categories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const cancelRef = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [eventsResult, announcementsResult, myEventsResult] = await Promise.all([
      fetchEvents(),
      fetchAnnouncements(),
      fetchMyEvents({ userId }),
    ]);

    if (cancelRef.current) {
      return;
    }

    setEvents(eventsResult.data);
    setAnnouncements(announcementsResult.data);
    setMyEvents(myEventsResult.data);

    const categoriesFromData = getEventCategories(eventsResult.data, eventsResult.fromMock);
    setCategories(categoriesFromData);

    const relevantErrors = [eventsResult, announcementsResult, myEventsResult]
      .filter((result) => result.error && !result.fromMock)
      .map((result) => result.error);
    setError(relevantErrors[0] ?? null);

    setUsingMockData(Boolean(eventsResult.fromMock || announcementsResult.fromMock || myEventsResult.fromMock));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    cancelRef.current = false;
    loadData();
    return () => {
      cancelRef.current = true;
    };
  }, [loadData]);

  const handleRegister = useCallback(
    async ({ eventId, deadline }) => {
      const result = await repositoryRegister({ userId, eventId, deadline });
      if (!result.error) {
        await loadData();
      }
      return result;
    },
    [loadData, userId],
  );

  return {
    events,
    announcements,
    myEvents,
    categories,
    loading,
    error,
    usingMockData,
    refresh: loadData,
    registerForEvent: handleRegister,
  };
};

