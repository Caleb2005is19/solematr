
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  type: 'signIn' | 'signUp';
  onSwitch: () => void;
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

// A combined schema that includes all possible fields for type inference.
const combinedSchema = signUpSchema.extend({
    displayName: z.string().optional(),
});


export default function AuthModal({ isOpen, onOpenChange, type, onSwitch }: AuthModalProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSchema = type === 'signIn' ? signInSchema : signUpSchema;

  const form = useForm<z.infer<typeof combinedSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    form.reset({
        displayName: '',
        email: '',
        password: '',
    });
  }, [type, form]);
  
  const onSubmit = async (values: z.infer<typeof currentSchema>) => {
    setIsSubmitting(true);
    try {
        if (type === 'signUp' && 'displayName' in values) {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            await updateProfile(userCredential.user, { displayName: values.displayName });
            toast({ title: 'Account created successfully!' });
        } else {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast({ title: 'Signed in successfully!' });
        }
        onOpenChange(false);
        form.reset();
    } catch (error: any) {
        let message = "An unexpected error occurred.";
        if (error.code) {
            switch(error.code) {
                case 'auth/email-already-in-use':
                    message = 'This email is already in use. Please sign in.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    message = 'Invalid email or password.';
                    break;
                case 'auth/weak-password':
                    message = 'Password is too weak. It must be at least 6 characters long.';
                    break;
                default:
                    message = 'Authentication failed. Please try again.';
                    break;
            }
        }
        toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isSignIn = type === 'signIn';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            form.reset();
        }
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignIn ? 'Sign In' : 'Create an Account'}</DialogTitle>
          <DialogDescription>
            {isSignIn ? 'Welcome back! Sign in to continue.' : 'Join us! Create an account to get started.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 {!isSignIn && (
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                               <Label htmlFor="displayName">Name</Label>
                                <FormControl>
                                    <Input id="displayName" placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="email">Email</Label>
                            <FormControl>
                                <Input id="email" type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="password">Password</Label>
                            <FormControl>
                                <Input id="password" type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSignIn ? 'Sign In' : 'Create Account'}
                    </Button>
                    <Button type="button" variant="link" size="sm" onClick={onSwitch}>
                        {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
