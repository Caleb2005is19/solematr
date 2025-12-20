import { getShoes } from '@/lib/data';
import ShoeCard from '@/components/shoe-card';
import ShoeFilters from '@/components/shoe-filters';
import { XCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RecentlyViewed from '@/components/recently-viewed';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { brand?: string; style?: string; size?: string; gender?: string; category?: string; };
}) {
  const allShoes = await getShoes();

  const brands = [...new Set(allShoes.map((shoe) => shoe.brand))];
  const styles = [...new Set(allShoes.map((shoe) => shoe.style))];
  const sizes = [...new Set(allShoes.flatMap(shoe => shoe.sizes))].sort((a,b) => a - b);
  const genders = [...new Set(allShoes.map((shoe) => shoe.gender))];
  const categories = [...new Set(allShoes.map((shoe) => shoe.category))];

  const filteredShoes = allShoes.filter((shoe) => {
    return (
      (!searchParams.brand || shoe.brand === searchParams.brand) &&
      (!searchParams.style || shoe.style === searchParams.style) &&
      (!searchParams.size || shoe.sizes.includes(Number(searchParams.size))) &&
      (!searchParams.gender || shoe.gender === searchParams.gender) &&
      (!searchParams.category || shoe.category === searchParams.category)
    );
  });

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center rounded-2xl overflow-hidden text-center text-white p-4">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxuaWtlJTIwc2hvZXN8ZW58MHx8fHwxNzU5NTQwODU0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vibrant sneakers on display"
          data-ai-hint="Nairobi fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tight text-shadow-lg">Step into Greatness</h1>
          <p className="text-lg md:text-2xl max-w-2xl text-shadow">The Sole of Kenya. Unbeatable style, unmatched performance.</p>
          <Button asChild size="lg" className="mt-4">
            <Link href="#products">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div id="products" className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <ShoeFilters brands={brands} styles={styles} sizes={sizes} genders={genders} categories={categories} />
            <RecentlyViewed />
          </div>
        </aside>
        <section className="lg:col-span-3">
          {filteredShoes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredShoes.map((shoe) => (
                <ShoeCard key={shoe.id} shoe={shoe} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50">
              <XCircle className="w-16 h-16 text-muted-foreground" />
              <h2 className="mt-6 text-2xl font-semibold">No Shoes Found</h2>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or checking back later.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
