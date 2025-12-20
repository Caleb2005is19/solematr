'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, doc, type DocumentReference } from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseDocOptions {
  // Options for fetching a single document
}

export const useDoc = <T>(path: string, options?: UseDocOptions) => {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const docRef = doc(firestore, path);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null); // Document doesn't exist
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching document ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]);

  return { data, loading, error };
};
