/**
 * Application-wide constants
 */

// Route paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:eventId',
  PROFILE: '/profile',
  GETTING_STARTED: '/getting-started',
};

// Event categories
export const EVENT_CATEGORIES = {
  ALL: 'All',
  TECH: 'Tech',
  CULTURAL: 'Cultural',
  SPORTS: 'Sports',
  BUSINESS: 'Business',
  ENTREPRENEURSHIP: 'Entrepreneurship',
};

// Event types
export const EVENT_TYPES = {
  EVENT: 'Event',
  COMPETITION: 'Competition',
};

// Team statuses
export const TEAM_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  LOCKED: 'locked',
};

// Team member roles
export const TEAM_ROLES = {
  CAPTAIN: 'captain',
  MEMBER: 'member',
};

// Team member statuses
export const MEMBER_STATUS = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  DECLINED: 'declined',
};

// Filter options
export const PARTICIPATION_FILTERS = {
  ALL: 'All',
  PARTICIPATED: 'Participated',
  NOT_PARTICIPATED: 'Not Participated',
};

export const STATUS_FILTERS = {
  ALL: 'All',
  ACTIVE: 'Active',
  CLOSED: 'Closed',
};

export const TYPE_FILTERS = {
  ALL: 'All',
  EVENT: 'Event',
  COMPETITION: 'Competition',
};

// Database tables
export const DB_TABLES = {
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  REGISTRATIONS: 'registrations',
  PROFILES: 'profiles',
  TEAMS: 'teams',
  TEAM_MEMBERS: 'team_members',
};

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    MISSING_CREDENTIALS: 'Enter both email and password.',
    SIGN_IN_FAILED: 'Unable to sign in right now.',
    SIGN_UP_FAILED: 'Unable to create account right now.',
    SUPABASE_NOT_CONFIGURED: 'Supabase is not configured.',
  },
  PROFILE: {
    INCOMPLETE: 'Please complete your name, department, college ID, and graduation year.',
    SAVE_FAILED: 'Unable to save profile.',
  },
  REGISTRATION: {
    DEADLINE_PASSED: 'Registration deadline has passed.',
    ALREADY_REGISTERED: 'You are already registered for this competition.',
    FAILED: 'Unable to register at this time.',
  },
  TEAM: {
    NAME_REQUIRED: 'Team name is required.',
    INVALID_SIZE: 'Enter a valid number for team size.',
    SIZE_TOO_SMALL: (min) => `Team size cannot be smaller than ${min}.`,
    TEAM_LOCKED: 'Team has already been locked.',
    TEAM_NOT_ACCEPTING: 'Team is not accepting new members.',
    TEAM_FULL: 'Team already has the maximum number of members.',
    MIN_SIZE_NOT_MET: (min) => `You need at least ${min} accepted members before finalising.`,
    MAX_SIZE_EXCEEDED: (max) => `Reduce your team to ${max} accepted members before finalising.`,
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGN_UP: 'Account created! Check your inbox for a confirmation link, then sign in.',
  },
  PROFILE: {
    SAVED: 'Profile updated successfully.',
  },
  REGISTRATION: {
    SUCCESS: 'Registration saved. See the My Events list for updates.',
  },
  TEAM: {
    CREATED: 'Team created successfully.',
    JOINED: 'Join request sent. Team captain will respond soon.',
    LEFT: 'You left the team. Feel free to join or create another.',
    REQUEST_CANCELLED: 'Your join request has been withdrawn.',
    OPENED: 'Your team is now open to new join requests.',
    CLOSED: 'Your team is now closed to new requests.',
    FINALIZED: 'Team locked and registration completed. All members are registered!',
  },
};

// UI Configuration
export const UI_CONFIG = {
  CAROUSEL_AUTO_PLAY_INTERVAL: 5000,
  MAX_FEATURED_EVENTS: 3,
  TOAST_DURATION: 4000,
};
