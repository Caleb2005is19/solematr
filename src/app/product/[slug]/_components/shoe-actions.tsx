'use client';

import { useState } from 'react';
import type { Shoe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShoeActionsProps {
    shoe: Shoe;
}

export default function ShoeActions({ shoe }: ShoeActionsProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(shoe.sizes.length > 0 ? shoe.sizes[0] : null);
  const [error, setError] = useState<string>('');
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
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

  return (
    <>
        <div>
            <h3 className="text-lg font-semibold mb-4">Select Size (US Men's)</h3>
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
                        className={cn(
                            "flex h-10 w-14 cursor-pointer items-center justify-center rounded-md border text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            selectedSize === size
                                ? "border-primary bg-primary text-primary-foreground"
                                : "bg-background"
                        )}
                    >
                    {size}
                    </Label>
                </div>
                ))}
            </RadioGroup>
            {error && <p className="mt-2 text-sm text-destructive flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}
        </div>

        <Button size="lg" onClick={handleAddToCart} disabled={shoe.sizes.length === 0}>
            {shoe.sizes.length === 0 ? 'Out of Stock' : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </>
            )}
        </Button>
    </>
  );
}
