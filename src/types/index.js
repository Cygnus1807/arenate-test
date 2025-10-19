/**
 * Type definitions for the application
 * These JSDoc comments provide type hints for better IDE support
 */

/**
 * @typedef {Object} Event
 * @property {string|number} id - Event unique identifier
 * @property {string} name - Event name
 * @property {string} organizer - Event organizer name
 * @property {string} category - Event category (Tech, Cultural, Sports, etc.)
 * @property {string} type - Event type (Event, Competition)
 * @property {string} date - ISO date string
 * @property {string} img - Image URL
 * @property {EventDetails} details - Additional event details
 */

/**
 * @typedef {Object} EventDetails
 * @property {string} [endDate] - ISO date string for event end
 * @property {string} [venue] - Event venue
 * @property {string} [registrationDeadline] - ISO date string for registration deadline
 * @property {string} [largeImg] - Large image URL
 * @property {string} [description] - Event description
 * @property {string[]} [rules] - Event rules
 * @property {Object} [prizes] - Prize details
 * @property {Array<{time: string, activity: string}>} [timeline] - Event timeline
 * @property {Array<{name: string, role: string, phone: string}>} [organizers] - Event organizers
 * @property {TeamConfig} [team] - Team configuration
 * @property {string} [type] - Event type override
 */

/**
 * @typedef {Object} TeamConfig
 * @property {boolean} [isTeamEvent] - Whether this is a team event
 * @property {number} [minSize] - Minimum team size
 * @property {number} [maxSize] - Maximum team size
 * @property {string} [description] - Team description
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} fullName - User full name
 * @property {string} department - User department
 * @property {string|number} graduationYear - Graduation year
 * @property {string} [phone] - Phone number
 * @property {string} [interests] - User interests
 * @property {string} [bio] - User bio
 * @property {string} [collegeId] - College unique ID
 * @property {string} [collegeEmail] - College email
 * @property {string} [updatedAt] - Last update timestamp
 * @property {string} [createdAt] - Creation timestamp
 */

/**
 * @typedef {Object} Team
 * @property {string} id - Team ID
 * @property {string} event_id - Event ID
 * @property {string} created_by - Creator user ID
 * @property {string} name - Team name
 * @property {string} [description] - Team description
 * @property {number} min_size - Minimum team size
 * @property {number} [max_size] - Maximum team size
 * @property {boolean} open_to_join - Whether team is accepting members
 * @property {string} status - Team status (draft, pending, locked)
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 * @property {TeamMember[]} [members] - Team members
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} team_id - Team ID
 * @property {string} user_id - User ID
 * @property {string} role - Member role (captain, member)
 * @property {string} status - Member status (accepted, pending, declined)
 * @property {string} [request_note] - Join request note
 * @property {string} joined_at - Join timestamp
 * @property {Object} [profiles] - Profile data
 * @property {string} [profiles.full_name] - Member full name
 */

/**
 * @typedef {Object} Announcement
 * @property {string|number} id - Announcement ID
 * @property {string} title - Announcement title
 * @property {string} content - Announcement content
 * @property {string} created_at - Creation timestamp
 */

export {};
