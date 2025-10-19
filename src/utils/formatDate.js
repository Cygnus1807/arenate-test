/**
 * Format a date string to a human-readable format
 * @param {string|Date} dateString - The date to format
 * @param {Intl.DateTimeFormatOptions} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (
  dateString,
  options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString(undefined, options);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} dateString - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (Math.abs(diffMinutes) < 1) {
      return 'Just now';
    } else if (Math.abs(diffMinutes) < 60) {
      return diffMinutes > 0 ? `in ${diffMinutes} minutes` : `${Math.abs(diffMinutes)} minutes ago`;
    } else if (Math.abs(diffHours) < 24) {
      return diffHours > 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`;
    } else if (Math.abs(diffDays) < 7) {
      return diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
    } else {
      return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  } catch {
    return 'Invalid date';
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
    return date.getTime() < Date.now();
  } catch {
    return false;
  }
};
