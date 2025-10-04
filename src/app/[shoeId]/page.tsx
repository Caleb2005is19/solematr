'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getShoeById } from '@/lib/data';
import type { Shoe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";
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
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useBrowsingHistory } from '@/hooks/use-browsing-history-hook';

export default function ShoeDetailPage({ params }: { params: { shoeId: string } }) {
  const { shoeId } = params;
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const { addItem } = useCart();
  const { toast } = useToast();
  const { addShoeToHistory } = useBrowsingHistory();

  useEffect(() => {
    const fetchShoe = async () => {
      const fetchedShoe = await getShoeById(shoeId);
      if (fetchedShoe) {
        setShoe(fetchedShoe);
        if (fetchedShoe.sizes.length > 0) {
          setSelectedSize(fetchedShoe.sizes[0]);
        }
        addShoeToHistory(shoeId);
      }
    };
    fetchShoe();
  }, [shoeId, addShoeToHistory]);

  const handleAddToCart = () => {
    if (!shoe) return;
    if (selectedSize === null) {
      setError('Please select a size.');
      return;
    }
    setError('');
    addItem({
      shoeId: shoe.id,
      name: shoe.name,
      price: shoe.price,
      size: selectedSize,
      image: { url: shoe.images[0].url, alt: shoe.images[0].alt },
    });
    toast({
        title: "Added to cart",
        description: `${shoe.name} (Size: ${selectedSize}) has been added to your cart.`,
    })
  };

  if (!shoe) {
    return <ShoeDetailSkeleton />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {shoe.images.map((image, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      data-ai-hint={image.hint}
                      width={1200}
                      height={800}
                      className="rounded-lg object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-primary">{shoe.brand}</p>
          <h1 className="text-4xl font-bold font-headline tracking-tight">{shoe.name}</h1>
          <p className="mt-2 text-3xl font-bold">${shoe.price.toFixed(2)}</p>
        </div>

        <p className="text-muted-foreground leading-relaxed">{shoe.description}</p>
        
        <div>
            <h3 className="text-lg font-semibold mb-4">Select Size</h3>
            <RadioGroup
                value={selectedSize?.toString()}
                onValueChange={(value) => setSelectedSize(Number(value))}
                className="flex flex-wrap gap-2"
            >
                {shoe.sizes.map((size) => (
                <div key={size}>
                    <RadioGroupItem value={size.toString()} id={`size-${size}`} className="sr-only" />
                    <Label
                    htmlFor={`size-${size}`}
                    className="flex h-10 w-14 cursor-pointer items-center justify-center rounded-md border text-sm transition-colors hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    >
                    {size}
                    </Label>
                </div>
                ))}
            </RadioGroup>
            {error && <p className="mt-2 text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
        </div>

        <Button size="lg" onClick={handleAddToCart}>Add to Cart</Button>

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
  );
}


function ShoeDetailSkeleton() {
    return (
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="w-full">
            <Skeleton className="aspect-video w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-3" />
            <Skeleton className="h-8 w-1/4" />
          </div>
  
          <Skeleton className="h-20 w-full" />
          
          <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-14" />
                  ))}
              </div>
          </div>
  
          <Skeleton className="h-12 w-full" />
  
          <Separator />
  
          <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
              </div>
          </div>
        </div>
      </div>
    );
  }
