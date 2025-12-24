
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrowsingHistory } from '@/hooks/use-browsing-history-hook';
import type { Shoe } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { History } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { getPlaceholderImage } from '@/lib/placeholder-images';

function RecentlyViewedItem({ shoeId }: { shoeId: string }) {
  const firestore = useFirestore();
  const noImagePlaceholder = getPlaceholderImage('placeholder-no-image');

  const shoeRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'shoes', shoeId);
  }, [firestore, shoeId]);

  const { data: shoe, isLoading } = useDoc<Shoe>(shoeRef);

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (!shoe) {
    return null;
  }
  
  const imageUrl = (shoe.images && shoe.images[0]?.url) || noImagePlaceholder?.imageUrl || '';
  const imageAlt = (shoe.images && shoe.images[0]?.alt) || shoe.name;

  return (
    <Link href={`/product/${shoe.id}`} className="flex items-center gap-3 group">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="56px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight group-hover:text-primary group-hover:underline">{shoe.name}</p>
        <p className="text-sm text-muted-foreground">KSH {shoe.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default function RecentlyViewed() {
  const { history } = useBrowsingHistory();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || history.length === 0) {
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
        {history.map(shoeId => (
          <RecentlyViewedItem key={shoeId} shoeId={shoeId} />
        ))}
      </CardContent>
    </Card>
  );
}
