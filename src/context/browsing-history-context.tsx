'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

const MAX_HISTORY_LENGTH = 5;
const STORAGE_KEY = 'solemate_kenya_browsing_history';

type BrowsingHistoryContextType = {
  history: string[];
  addShoeToHistory: (shoeId: string) => void;
};

export const BrowsingHistoryContext = createContext<BrowsingHistoryContextType | undefined>(undefined);

export const BrowsingHistoryProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <BrowsingHistoryContext.Provider value={{ history, addShoeToHistory }}>
      {children}
    </BrowsingHistoryContext.Provider>
  );
};
