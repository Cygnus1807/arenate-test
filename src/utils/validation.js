/**
 * Validation utilities for form inputs and data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return true; // Optional field
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone.trim()) && phone.trim().length >= 10;
};

/**
 * Validate graduation year
 * @param {string|number} year - Year to validate
 * @returns {boolean} True if year is valid
 */
export const isValidGraduationYear = (year) => {
  if (!year) return false;
  const numYear = Number(year);
  if (Number.isNaN(numYear)) return false;
  const currentYear = new Date().getFullYear();
  return numYear >= currentYear && numYear <= currentYear + 10;
};

/**
 * Validate team name
 * @param {string} name - Team name to validate
 * @returns {{valid: boolean, error: string}} Validation result
 */
export const validateTeamName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Team name is required.' };
  }
  
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Team name is required.' };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Team name must be at least 3 characters.' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Team name must be less than 50 characters.' };
  }
  
  return { valid: true, error: '' };
};

/**
 * Validate team size
 * @param {number} size - Size to validate
 * @param {number} minSize - Minimum allowed size
 * @param {number} maxSize - Maximum allowed size
 * @returns {{valid: boolean, error: string}} Validation result
 */
export const validateTeamSize = (size, minSize, maxSize) => {
  if (size === null || size === undefined || size === '') {
    return { valid: true, error: '' }; // Optional
  }
  
  const numSize = Number(size);
  if (Number.isNaN(numSize)) {
    return { valid: false, error: 'Enter a valid number for team size.' };
  }
  
  if (minSize && numSize < minSize) {
    return { valid: false, error: `Team size cannot be smaller than ${minSize}.` };
  }
  
  if (maxSize && numSize > maxSize) {
    return { valid: false, error: `Team size cannot be larger than ${maxSize}.` };
  }
  
  return { valid: true, error: '' };
};

/**
 * Validate profile completeness
 * @param {Object} profile - Profile object to validate
 * @returns {boolean} True if profile is complete
 */
export const isProfileComplete = (profile) => {
  if (!profile) return false;
  return Boolean(
    profile.fullName &&
    profile.department &&
    profile.graduationYear &&
    profile.collegeId
  );
};

/**
 * Sanitize text input (remove dangerous characters)
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

/**
 * Validate required fields in an object
 * @param {Object} data - Data object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{valid: boolean, missing: string[]}} Validation result
 */
export const validateRequiredFields = (data, requiredFields) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, missing: requiredFields };
  }
  
  const missing = requiredFields.filter((field) => {
    const value = data[field];
    return !value || (typeof value === 'string' && value.trim().length === 0);
  });
  
  return {
    valid: missing.length === 0,
    missing,
  };
};
