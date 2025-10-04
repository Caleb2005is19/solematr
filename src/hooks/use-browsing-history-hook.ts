'use client';

import { useContext } from 'react';
import { BrowsingHistoryContext } from '@/context/browsing-history-context';

export const useBrowsingHistory = () => {
  const context = useContext(BrowsingHistoryContext);
  if (context === undefined) {
    throw new Error('useBrowsingHistory must be used within a BrowsingHistoryProvider');
  }
  return context;
};
