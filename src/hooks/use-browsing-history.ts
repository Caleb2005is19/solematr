'use client';

import { useState, useEffect, useCallback } from 'react';

const MAX_HISTORY_LENGTH = 10;
const STORAGE_KEY = 'solemate_browsing_history';

export const useBrowsingHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load browsing history from localStorage:', error);
    }
  }, []);

  const addShoeToHistory = useCallback((shoeId: string) => {
    setHistory(prevHistory => {
      const newHistory = [shoeId, ...prevHistory.filter(id => id !== shoeId)];
      const truncatedHistory = newHistory.slice(0, MAX_HISTORY_LENGTH);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(truncatedHistory));
      } catch (error) {
        console.error('Failed to save browsing history to localStorage:', error);
      }
      return truncatedHistory;
    });
  }, []);

  return { history, addShoeToHistory };
};
