'use client';

import { useEffect } from 'react';
import { useBrowsingHistory } from '@/hooks/use-browsing-history-hook';

export function BrowsingHistoryTracker({ shoeId }: { shoeId: string }) {
  const { addShoeToHistory } = useBrowsingHistory();

  useEffect(() => {
    addShoeToHistory(shoeId);
  }, [shoeId, addShoeToHistory]);

  return null;
}
