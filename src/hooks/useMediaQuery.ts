import { useState, useEffect, useCallback } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  const handleChange = useCallback(() => {
    const getMatches = (): boolean => {
      if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
      }
      return false;
    };
    setMatches(getMatches());
  }, [query]);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query, handleChange]);

  return matches;
}
