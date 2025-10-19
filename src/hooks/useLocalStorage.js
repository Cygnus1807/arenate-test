import { useEffect, useState } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @template T
 * @param {string} key - The localStorage key
 * @param {T} initialValue - The initial value if key doesn't exist
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} Tuple of [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      // Silent fail - localStorage may be full or disabled
    }
  };

  // Remove from localStorage
  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch {
      // Silent fail
    }
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Silent fail - invalid JSON
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    return undefined;
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
