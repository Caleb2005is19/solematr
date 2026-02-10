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
import { Lock, Smartphone, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { initiateInstasendPayment } from '@/lib/instasend';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  address: z.string().min(5, 'Please enter a valid address.'),
  city: z.string().min(2, 'Please enter a valid city.'),
  postalCode: z.string().min(4, 'Please enter a valid postal code.'),
  country: z.string().min(2, 'Please enter a valid country.'),
  instasendPhone: z.string().regex(/^254\d{9}$/, 'Phone number must be in the format 254xxxxxxxxx.'),
});

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '', // Initialize as empty, will be set by useEffect
      name: '', // Initialize as empty, will be set by useEffect
      address: '', 
      city: 'Nairobi', 
      postalCode: '00100', 
      country: 'Kenya',
      instasendPhone: '',
    },
  });
  
  // This effect now correctly pre-fills the form once the user object is available.
  useEffect(() => {
    if (user) {
        form.reset({
            ...form.getValues(), // Keep other fields the user might have started filling
            email: user.email ?? '',
            name: user.displayName ?? '',
        });
    }
  }, [user, form]);

  // This effect redirects to home if the cart is empty.
  useEffect(() => {
    if (!isProcessing && items.length === 0) {
      router.replace('/');
    }
  }, [items, router, isProcessing]);


  if (items.length === 0 && !isProcessing) {
    return null;
  }

  const createOrderInFirestore = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Database connection not available.",
        });
        return false;
    }

    try {
        const orderData = {
            // userId will be null for guests
            userId: user?.uid || null,
            customerInfo: {
                name: values.name,
                email: values.email,
                address: values.address,
                city: values.city,
                postalCode: values.postalCode,
                country: values.country,
            },
            items: items.map(item => ({
                shoeId: item.shoeId,
                name: item.name,
                price: item.price,
                size: item.size,
                quantity: item.quantity,
                imageUrl: item.image.url,
            })),
            totalPrice,
            paymentMethod: 'instasend',
            status: 'unfulfilled',
            createdAt: serverTimestamp(),
        };
        
        // If user is logged in, store order under their user document.
        // If not, store it in the top-level 'orders' collection.
        const ordersCollectionRef = user
            ? collection(firestore, 'users', user.uid, 'orders')
            : collection(firestore, 'orders');

        await addDoc(ordersCollectionRef, orderData);
        
        toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase. Your order has been recorded.",
        });
        clearCart();
        // Redirect to account page if logged in, otherwise home page.
        router.push(user ? '/account/orders' : '/');
        return true;

    } catch (error) {
        console.error("Error creating order:", error);
        toast({
            variant: "destructive",
            title: "Order Failed",
            description: "Could not save your order. Please try again.",
        });
        return false;
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);

    toast({
        title: "Processing Payment (Simulation)...",
        description: `Simulating a payment prompt to ${values.instasendPhone}. Please wait.`,
    });

    try {
        // Step 1: Initiate payment with Instasend
        await initiateInstasendPayment(values.instasendPhone, totalPrice);
        toast({
            title: "Payment Successful! (Simulation)",
            description: "Your simulated payment has been received.",
        });

        // Step 2: Create the order in Firestore
        await createOrderInFirestore(values);
        
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Payment Failed (Simulation)",
            description: (error as Error).message || "The simulated payment failed. Please try again.",
        });
    } finally {
        setIsProcessing(false);
    }
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
                      <FormControl><Input placeholder="you@example.com" {...field} disabled={isProcessing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} disabled={isProcessing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl><Input placeholder="123 Main St, Apartment 4B" {...field} disabled={isProcessing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Nairobi" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="postalCode" render={({ field }) => (
                        <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="00100" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5"/> Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-md border bg-secondary/50">
                        <Image src="/instasend-logo.svg" alt="Instasend Logo" width={100} height={40} />
                        <p className="text-sm text-muted-foreground">You will receive a payment prompt on your phone to complete the transaction.</p>
                    </div>
                    <FormField control={form.control} name="instasendPhone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Safaricom Phone Number</FormLabel>
                            <FormControl><Input placeholder="254712345678" {...field} disabled={isProcessing} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>
            
            <Button type="submit" size="lg" className="w-full text-lg" disabled={isProcessing || isUserLoading}>
                {isUserLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" />}
                {isUserLoading ? 'Loading...' : isProcessing ? 'Processing...' : `Pay securely - KSH ${totalPrice.toFixed(2)}`}
            </Button>
          </form>
        </Form>
      </div>
      <div className="lg:col-span-1 lg:order-first">
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
                        <p className="font-medium">KSH {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <Separator />
                <div className="space-y-2 text-base">
                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>KSH {totalPrice.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                     <div className="flex justify-between text-muted-foreground">
                        <span>Taxes</span>
                        <span>Included in Price</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-xl pt-2">
                        <span>Total</span>
                        <span>KSH {totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
