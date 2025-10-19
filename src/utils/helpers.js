/**
 * Security and sanitization utilities
 */

/**
 * Check if we're running in a browser environment
 * @returns {boolean} True if in browser
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Check if a URL is safe (not javascript: or data:)
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is safe
 */
export const isSafeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const normalizedUrl = url.trim().toLowerCase();
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  
  return !dangerousProtocols.some((protocol) => normalizedUrl.startsWith(protocol));
};

/**
 * Safely parse JSON with fallback
 * @template T
 * @param {string} json - JSON string to parse
 * @param {T} fallback - Fallback value if parsing fails
 * @returns {T} Parsed value or fallback
 */
export const safeJsonParse = (json, fallback = null) => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

/**
 * Rate limit function calls
 * @param {Function} func - Function to rate limit
 * @param {number} limit - Maximum calls per period
 * @param {number} period - Period in milliseconds
 * @returns {Function} Rate limited function
 */
export const rateLimit = (func, limit, period) => {
  const calls = [];
  
  return function rateLimited(...args) {
    const now = Date.now();
    const cutoff = now - period;
    
    // Remove old calls
    while (calls.length > 0 && calls[0] < cutoff) {
      calls.shift();
    }
    
    // Check if we're over the limit
    if (calls.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    calls.push(now);
    return func.apply(this, args);
  };
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function debounced(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, wait) => {
  let waiting = false;
  
  return function throttled(...args) {
    if (waiting) return;
    
    waiting = true;
    func.apply(this, args);
    setTimeout(() => {
      waiting = false;
    }, wait);
  };
};

/**
 * Check if an object has all required properties
 * @param {Object} obj - Object to check
 * @param {string[]} requiredProps - Required property names
 * @returns {boolean} True if all properties exist
 */
export const hasRequiredProps = (obj, requiredProps) => {
  if (!obj || typeof obj !== 'object') return false;
  return requiredProps.every((prop) => Object.prototype.hasOwnProperty.call(obj, prop));
};

/**
 * Deep clone an object (JSON-safe only)
 * @template T
 * @param {T} obj - Object to clone
 * @returns {T} Cloned object
 */
export const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

/**
 * Check if code is running in production
 * @returns {boolean} True if in production
 */
export const isProduction = () => import.meta.env.PROD;

/**
 * Check if code is running in development
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => import.meta.env.DEV;
