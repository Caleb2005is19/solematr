import Image from 'next/image';
import { getShoeById } from '@/lib/data';
import { notFound } from 'next/navigation';

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

export default async function ShoeDetailPage({ params }: { params: { shoeId: string } }) {
  const shoeId = params.shoeId;
  const shoe = await getShoeById(shoeId);

  if (!shoe) {
    notFound();
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {shoe.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden rounded-xl">
                    <CardContent className="flex aspect-video items-center justify-center p-0">
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
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider">{shoe.brand}</p>
            <h1 className="text-4xl lg:text-5xl font-bold font-headline tracking-tight">{shoe.name}</h1>
            <p className="mt-2 text-3xl font-bold">${shoe.price.toFixed(2)}</p>
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
      <BrowsingHistoryTracker shoeId={shoe.id} />
    </>
  );
}
