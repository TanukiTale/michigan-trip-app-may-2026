import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    }

    try {
      const savedValue = window.localStorage.getItem(key);
      if (savedValue !== null) {
        return JSON.parse(savedValue) as T;
      }
    } catch {
      // Ignore bad local data and fall back to the initial value.
    }

    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write failures so the app remains usable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
