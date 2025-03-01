import { useEffect, useState } from 'react';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');

    const listener = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return colorScheme;
}
