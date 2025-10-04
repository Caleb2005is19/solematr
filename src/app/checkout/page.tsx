'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  address: z.string().min(5, 'Please enter a valid address.'),
  city: z.string().min(2, 'Please enter a valid city.'),
  postalCode: z.string().min(4, 'Please enter a valid postal code.'),
  country: z.string().min(2, 'Please enter a valid country.'),
  cardName: z.string().min(2, 'Name on card is required.'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits.'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format.'),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits.'),
});

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '', name: '', address: '', city: '', postalCode: '', country: 'Kenya',
      cardName: '', cardNumber: '', expiryDate: '', cvc: '',
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items, router]);


  if (items.length === 0) {
    return null; // Or a loading/redirecting state
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would process the payment here.
    toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. A confirmation has been sent to your email.",
    });
    clearCart();
    router.push('/');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="lg:col-span-1">
        <h1 className="text-3xl font-bold font-headline mb-6">Secure Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl><Input placeholder="123 Main St, Apartment 4B" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="postalCode" render={({ field }) => (
                        <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="00100" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/> Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <FormField control={form.control} name="cardName" render={({ field }) => (
                    <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input placeholder="John M. Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" autoComplete="cc-number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" autoComplete="cc-exp" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="cvc" render={({ field }) => (
                        <FormItem><FormLabel>CVC / CVV</FormLabel><FormControl><Input placeholder="123" autoComplete="cc-csc" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              </CardContent>
            </Card>
            
            <Button type="submit" size="lg" className="w-full text-lg">
                <Lock className="mr-2 h-5 w-5" />
                Pay securely - KES {totalPrice.toFixed(2)}
            </Button>
          </form>
        </Form>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map(item => (
                    <div key={`${item.shoeId}-${item.size}`} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                            <Image src={item.image.url} alt={item.image.alt} fill sizes="64px" className="object-cover" />
                            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{item.quantity}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <Separator />
                <div className="space-y-2 text-base">
                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Taxes</span>
                        <span>Calculated at next step</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-xl pt-2">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
