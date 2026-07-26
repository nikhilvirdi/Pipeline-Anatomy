import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query. Used for the layout-direction breakpoint and
 * for coarse-pointer detection, so behaviour follows the actual device rather
 * than a user-agent guess.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = (event) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}

// Tailwind's `lg`. Phones and portrait tablets get the top-to-bottom layout;
// 1024 and up keeps the authored left-to-right one.
export const SMALL_SCREEN_QUERY = '(max-width: 1023px)';

// Hover is the thing touch devices lack, so query for that directly rather than
// inferring it from width — a narrow desktop window still has a mouse.
export const TOUCH_QUERY = '(hover: none), (pointer: coarse)';
