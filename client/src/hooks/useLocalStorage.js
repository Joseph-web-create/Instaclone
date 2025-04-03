import { useState, useEffect, useMemo } from "react";

export default function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    const persistance = localStorage.getItem(key);
    return persistance ? JSON.parse(persistance) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const memoizedState = useMemo(() => state, [state]);
  return [memoizedState, setState];
}
