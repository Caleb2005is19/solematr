'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { SheetClose } from './ui/sheet';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.shoeId, item.size, newQuantity);
  };
  
  return (
    <div className="flex items-start gap-4">
      <SheetClose asChild>
        <Link href={`/product/${item.shoeId}`} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            sizes="96px"
            className="object-cover"
            />
        </Link>
      </SheetClose>
      <div className="flex-1">
        <SheetClose asChild>
            <Link href={`/product/${item.shoeId}`} className="hover:underline">
                <h3 className="font-semibold">{item.name}</h3>
            </Link>
        </SheetClose>
        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
        <p className="text-sm font-medium">KSH {item.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)}>
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                className="h-8 w-14 text-center"
                min="1"
            />
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
            </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeItem(item.shoeId, item.size)}>
        <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  );
}
