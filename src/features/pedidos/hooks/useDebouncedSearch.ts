import { useEffect, useRef, useState } from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/lib/config';
import { useDebounce } from '@/lib/useDebounce';

export function useDebouncedSearch(committed: string, onCommit: (value: string) => void) {
  const [value, setValue] = useState(committed);
  const debounced = useDebounce(value, SEARCH_DEBOUNCE_MS);

  const latest = useRef({ committed, onCommit });
  useEffect(() => {
    latest.current = { committed, onCommit };
  });

  useEffect(() => {
    if (debounced.trim() !== latest.current.committed) latest.current.onCommit(debounced);
  }, [debounced]);

  return [value, setValue] as const;
}
