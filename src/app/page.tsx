import { getShoes } from '@/lib/data';
import ShoeCard from '@/components/shoe-card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RecentlyViewed from '@/components/recently-viewed';
import { Card } from '@/components/ui/card';

export default async function HomePage() {
  const allShoes = await getShoes();
  const newArrivals = allShoes.slice(0, 4); // Get first 4 as new arrivals
  
  const popularCategories = [
    { name: 'Streetwear', image: 'https://images.unsplash.com/photo-1645846123684-f6f33a2eb3ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxoaWdodG9wJTIwc25lYWtlcnxlbnwwfHx8fDE3NTk1NjM2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080', href: '/sneakers/streetwear' },
    { name: 'Running', image: 'https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXxlbnwwfHx8fDE3NTk1NjM2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080', href: '/sneakers/running' },
    { name: 'Formal', image: 'https://images.unsplash.com/photo-1611937674427-01cd37d36732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxkcmVzcyUyMHNob2V8ZW58MHx8fHwxNzU5NTA4MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080', href: '/shoes/formal' },
    { name: 'Boots', image: 'https://images.unsplash.com/photo-1638158980051-f7e67291efed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsZWF0aGVyJTIwYm9vdHxlbnwwfHx8fDE3NTk1NDE0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080', href: '/shoes/boots' },
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center rounded-2xl overflow-hidden text-center text-white p-4">
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
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-shadow-lg">Step into Greatness</h1>
          <p className="text-lg md:text-xl max-w-2xl text-shadow">The Sole of Kenya. Unbeatable style, unmatched performance.</p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/sneakers">
              Explore Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Shop by Style */}
      <section>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-2">Find Your Vibe</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">Whatever your style, we've got the shoes to match. Explore our curated collections to find the perfect pair that speaks to you.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {popularCategories.map(category => (
                  <Link key={category.name} href={category.href}>
                      <Card className="overflow-hidden group relative">
                          <div className="aspect-w-3 aspect-h-4">
                              <Image 
                                  src={category.image}
                                  alt={`A shoe representing the ${category.name} style`}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 25vw"
                                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                              />
                          </div>
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute bottom-0 left-0 p-4">
                              <h3 className="text-white text-lg font-bold">{category.name}</h3>
                          </div>
                      </Card>
                  </Link>
              ))}
          </div>
      </section>
      
      {/* New Arrivals Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} />
          ))}
        </div>
        <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
                <Link href="/sneakers">View All Products</Link>
            </Button>
        </div>
      </section>

      <div className="lg:hidden">
        <RecentlyViewed />
      </div>
    </div>
  );
}
