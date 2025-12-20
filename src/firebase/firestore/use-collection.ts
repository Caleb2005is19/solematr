'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, type Query, type CollectionReference, getDocs } from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  // Add any options here, like query constraints
}

export const useCollection = <T>(path: string, options?: UseCollectionOptions) => {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collectionRef = collection(firestore, path);
    // You could expand this to use options to build a more complex query
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]); // Re-run effect if firestore instance or path changes

  return { data, loading, error };
};

// A version for getting a collection once, not in real-time
export const getCollection = async <T>(firestore: any, path: string): Promise<T[]> => {
    const snapshot = await getDocs(collection(firestore, path));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}
