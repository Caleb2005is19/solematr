import Image from 'next/image';
import { getShoeBySlug, getShoes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/star-rating';
import ShoeActions from './_components/shoe-actions';
import { BrowsingHistoryTracker } from './_components/browsing-history-tracker';
import type { Metadata, ResolvingMetadata } from 'next';
import Breadcrumbs from '@/components/breadcrumbs';
import ShoeCard from '@/components/shoe-card';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const shoe = await getShoeBySlug(slug);

  if (!shoe) {
    return {
      title: 'Product Not Found',
    }
  }
 
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: `${shoe.name} by ${shoe.brand}`,
    description: shoe.description.substring(0, 160), // Keep it concise for meta descriptions
    openGraph: {
      images: [shoe.images[0].url, ...previousImages],
    },
  }
}

export async function generateStaticParams() {
  const shoes = await getShoes();
 
  return shoes.map((shoe) => ({
    slug: shoe.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const shoe = await getShoeBySlug(slug);

  if (!shoe) {
    notFound();
  }

  const allShoes = await getShoes();
  const relatedProducts = allShoes.filter(p => p.category === shoe.category && p.id !== shoe.id).slice(0, 4);

  return (
    <>
      <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: shoe.type, href: `/${shoe.type.toLowerCase()}` },
            { label: shoe.category, href: `/${shoe.type.toLowerCase()}/${shoe.category.toLowerCase()}` },
            { label: shoe.name, href: `/product/${shoe.id}`, isActive: true },
          ]}
        />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mt-6">
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {shoe.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden rounded-xl border-none">
                    <CardContent className="flex aspect-square md:aspect-video items-center justify-center p-0">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        data-ai-hint={image.hint}
                        width={1200}
                        height={800}
                        className="object-cover w-full h-full"
                        priority={index === 0}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {shoe.images.length > 1 && (
              <>
                <CarouselPrevious className="ml-14" />
                <CarouselNext className="mr-14" />
              </>
            )}
          </Carousel>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">{shoe.brand}</p>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="secondary">{shoe.gender}</Badge>
                <Badge variant="outline">{shoe.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{shoe.name}</h1>
            <p className="mt-2 text-3xl font-bold">KSH {shoe.price.toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{shoe.description}</p>
          
          <ShoeActions shoe={shoe} />

          <Separator />

          <div>
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-6">
                  {shoe.reviews.length > 0 ? shoe.reviews.map(review => (
                      <div key={review.id} className="p-4 border rounded-lg bg-card">
                          <div className="flex items-center justify-between mb-2">
                             <p className="font-semibold">{review.author}</p>
                             <StarRating rating={review.rating} size={16} />
                          </div>
                          <p className="text-sm text-muted-foreground italic">"{review.text}"</p>
                      </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No reviews yet for this product.</p>
                  )}
              </div>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map(relatedShoe => (
              <ShoeCard key={relatedShoe.id} shoe={relatedShoe} />
            ))}
          </div>
        </div>
      )}

      <BrowsingHistoryTracker shoeId={shoe.id} />
    </>
  );
}
