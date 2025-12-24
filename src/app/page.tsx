
import { getShoes } from '@/lib/data';
import ShoeCard from '@/components/shoe-card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default async function HomePage() {
  const allShoes = await getShoes();
  const newArrivals = allShoes.slice(0, 4); // Get first 4 as new arrivals
  
  const heroImage = getPlaceholderImage('hero-background');

  const popularCategories = [
    { name: 'Streetwear', imageId: 'category-streetwear', href: '/sneakers/streetwear' },
    { name: 'Running', imageId: 'category-running', href: '/sneakers/running' },
    { name: 'Formal', imageId: 'category-formal', href: '/shoes/formal' },
    { name: 'Boots', imageId: 'category-boots', href: '/shoes/boots' },
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center rounded-2xl overflow-hidden text-center text-white p-4">
        <div className="absolute inset-0 bg-black/50 z-10" />
        {heroImage && (
          <Image 
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
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
              {popularCategories.map(category => {
                  const categoryImage = getPlaceholderImage(category.imageId);
                  return (
                    <Link key={category.name} href={category.href}>
                        <Card className="overflow-hidden group relative">
                            <div className="aspect-w-3 aspect-h-4">
                                {categoryImage && (
                                  <Image 
                                      src={categoryImage.imageUrl}
                                      alt={categoryImage.description}
                                      data-ai-hint={categoryImage.imageHint}
                                      fill
                                      sizes="(max-width: 768px) 50vw, 25vw"
                                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                  />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute bottom-0 left-0 p-4">
                                <h3 className="text-white text-lg font-bold">{category.name}</h3>
                            </div>
                        </Card>
                    </Link>
                  )
              })}
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
    </div>
  );
}
