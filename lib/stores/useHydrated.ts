import { useEffect, useState } from 'react';

/**
 * Returns `true` only after the component has mounted on the client. Use it to
 * gate rendering of values that come from persisted Zustand stores so the
 * server-rendered markup matches the first client render (avoids hydration
 * mismatches).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
