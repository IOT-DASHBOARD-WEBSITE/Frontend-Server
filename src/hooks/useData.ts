'use client';

import { useState, useEffect } from 'react';

interface UseDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseDataState<T> {
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const result = await fetchFn();
        if (isMounted) {
          setState({
            data: result,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Unknown error occurred',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}
