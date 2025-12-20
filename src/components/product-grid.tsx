import type { Shoe } from "@/lib/types";
import ShoeCard from "@/components/shoe-card";
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
    shoes: Shoe[];
}

export default function ProductGrid({ shoes }: ProductGridProps) {
  if (shoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card text-center p-4">
        <XCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-semibold">No Products Found</h2>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your filters or checking back later.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/sneakers">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
      {shoes.map((shoe) => (
        <ShoeCard key={shoe.id} shoe={shoe} />
      ))}
    </div>
  );
}
