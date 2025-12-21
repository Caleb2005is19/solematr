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
import { CreditCard, Lock, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { initiateStkPush } from '@/lib/mpesa';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  address: z.string().min(5, 'Please enter a valid address.'),
  city: z.string().min(2, 'Please enter a valid city.'),
  postalCode: z.string().min(4, 'Please enter a valid postal code.'),
  country: z.string().min(2, 'Please enter a valid country.'),
  paymentMethod: z.enum(['card', 'mpesa'], { required_error: 'Please select a payment method.' }),
  mpesaPhone: z.string().optional(),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'card') {
        return !!data.cardName && data.cardName.length >= 2 &&
               !!data.cardNumber && /^\d{16}$/.test(data.cardNumber) &&
               !!data.expiryDate && /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate) &&
               !!data.cvc && /^\d{3,4}$/.test(data.cvc);
    }
    return true;
}, {
    message: "Please fill all credit card details correctly.",
    path: ['cardName'], // you can pick any of the card fields
}).refine(data => {
    if (data.paymentMethod === 'mpesa') {
        return !!data.mpesaPhone && /^254\d{9}$/.test(data.mpesaPhone);
    }
    return true;
}, {
    message: "M-Pesa number must be in the format 254xxxxxxxxx.",
    path: ['mpesaPhone'],
});

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? '', 
      name: user?.displayName ?? '', 
      address: '', 
      city: 'Nairobi', 
      postalCode: '00100', 
      country: 'Kenya',
      paymentMethod: 'card', mpesaPhone: '',
      cardName: '', cardNumber: '', expiryDate: '', cvc: '',
    },
  });
  
  useEffect(() => {
    if (user) {
        form.reset({
            ...form.getValues(),
            email: user.email ?? '',
            name: user.displayName ?? '',
        });
    }
  }, [user, form]);

  const paymentMethod = form.watch('paymentMethod');

  useEffect(() => {
    if (!isProcessing && items.length === 0) {
      router.replace('/');
    }
  }, [items, router, isProcessing]);


  if (items.length === 0 && !isProcessing) {
    return null;
  }

  const createOrderInFirestore = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be signed in to place an order.",
        });
        return;
    }

    try {
        const orderData = {
            userId: user.uid,
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
            paymentMethod: values.paymentMethod,
            status: 'unfulfilled',
            createdAt: serverTimestamp(),
        };
        
        // Save the order to the user-specific subcollection
        const ordersCollectionRef = collection(firestore, 'users', user.uid, 'orders');
        const docRef = await addDoc(ordersCollectionRef, orderData);
        console.log("Order created with ID: ", docRef.id);
        
        toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase. A confirmation has been sent to your email.",
        });
        clearCart();
        router.push('/');

    } catch (error) {
        console.error("Error creating order:", error);
        toast({
            variant: "destructive",
            title: "Order Failed",
            description: "Could not save your order. Please try again.",
        });
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);

    if (values.paymentMethod === 'mpesa') {
        toast({
            title: "Processing M-Pesa Payment",
            description: `Sending STK push to ${values.mpesaPhone}. Please check your phone to complete the transaction.`,
        });
        try {
            await initiateStkPush(values.mpesaPhone!, totalPrice);
            await createOrderInFirestore(values);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "M-Pesa Payment Failed",
                description: (error as Error).message || "Could not process the M-Pesa payment. Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    } else { // Credit Card Payment
        console.log("Processing credit card payment", values);
        await createOrderInFirestore(values);
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
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                 <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                disabled={isProcessing}
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="card" />
                                    </FormControl>
                                    <FormLabel className="font-normal flex items-center gap-2">
                                        <CreditCard className="h-5 w-5"/> Credit/Debit Card
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="mpesa" />
                                    </FormControl>
                                    <FormLabel className="font-normal flex items-center gap-2">
                                        <Image src="/mpesa-logo.svg" alt="M-Pesa Logo" width={60} height={20} />
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </CardContent>
            </Card>

            <div className={cn(paymentMethod === 'card' ? 'block' : 'hidden')}>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/> Card Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <FormField control={form.control} name="cardName" render={({ field }) => (
                            <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input placeholder="John M. Doe" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                            <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" autoComplete="cc-number" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" autoComplete="cc-exp" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="cvc" render={({ field }) => (
                                <FormItem><FormLabel>CVC / CVV</FormLabel><FormControl><Input placeholder="123" autoComplete="cc-csc" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className={cn(paymentMethod === 'mpesa' ? 'block' : 'hidden')}>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5"/> M-Pesa Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="mpesaPhone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>M-Pesa Phone Number</FormLabel>
                                <FormControl><Input placeholder="254712345678" {...field} disabled={isProcessing} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </div>
            
            <Button type="submit" size="lg" className="w-full text-lg" disabled={isProcessing || !user}>
                <Lock className="mr-2 h-5 w-5" />
                {isProcessing ? 'Processing...' : `Pay securely - KSH ${totalPrice.toFixed(2)}`}
            </Button>
            {!user && <p className="text-sm text-center text-destructive">Please sign in to place an order.</p>}
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
                        <span>Calculated at next step</span>
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
