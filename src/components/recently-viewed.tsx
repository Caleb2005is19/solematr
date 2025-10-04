'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrowsingHistory } from '@/hooks/use-browsing-history-hook';
import { getShoeById } from '@/lib/data';
import type { Shoe } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { History } from 'lucide-react';

export default function RecentlyViewed() {
  const { history } = useBrowsingHistory();
  const [viewedShoes, setViewedShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (history.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const shoePromises = history.map(id => getShoeById(id));
      const results = await Promise.all(shoePromises);
      setViewedShoes(results.filter((shoe): shoe is Shoe => shoe !== undefined));
      setLoading(false);
    };

    fetchHistory();
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : (
          viewedShoes.map(shoe => (
            <Link key={shoe.id} href={`/${shoe.id}`} className="flex items-center gap-3 group">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={shoe.images[0].url}
                  alt={shoe.images[0].alt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight group-hover:text-primary group-hover:underline">{shoe.name}</p>
                <p className="text-sm text-muted-foreground">${shoe.price.toFixed(2)}</p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
