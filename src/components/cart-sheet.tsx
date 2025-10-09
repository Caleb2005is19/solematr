'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CartItem from './cart-item';
import { ShoppingBag } from 'lucide-react';

export default function CartSheet() {
  const { items, totalPrice, totalItems } = useCart();

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
      </SheetHeader>
      <Separator />
      {items.length > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 p-6">
              {items.map((item) => (
                <CartItem key={`${item.shoeId}-${item.size}`} item={item} />
              ))}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="p-6">
            <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Subtotal</span>
                    <span>KSH {totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Shipping and taxes will be calculated at checkout.</p>
                <SheetClose asChild>
                    <Button asChild size="lg" className="w-full">
                        <Link href="/checkout">Continue to Checkout</Link>
                    </Button>
                </SheetClose>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <SheetClose asChild>
            <Button asChild variant="link" className="text-primary">
                <Link href="/">Start shopping</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </SheetContent>
  );
}
