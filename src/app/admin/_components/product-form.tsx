'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import type { Shoe } from '@/lib/types';
import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  brand: z.string().min(2, 'Brand is required.'),
  type: z.enum(['Sneakers', 'Shoes']),
  category: z.string().min(2, 'Category is required.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be positive.')
  ),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  sizes: z.array(z.number()).min(1, 'At least one size is required.'),
  gender: z.enum(['Men', 'Women', 'Unisex']),
  isOnSale: z.boolean().default(false),
  // Images are handled separately for simplicity
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  shoe?: Shoe | null;
  onFormSubmit: (saved: boolean) => void;
}

export function ProductForm({ shoe, onFormSubmit }: ProductFormProps) {
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Convert sizes array from numbers to objects for useFieldArray
  const defaultValues: ProductFormValues = {
    id: shoe?.id,
    name: shoe?.name ?? '',
    brand: shoe?.brand ?? '',
    type: shoe?.type ?? 'Sneakers',
    category: shoe?.category ?? '',
    price: shoe?.price ?? 0,
    description: shoe?.description ?? '',
    sizes: shoe?.sizes ?? [],
    gender: shoe?.gender ?? 'Unisex',
    isOnSale: shoe?.isOnSale ?? false,
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes"
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const images = shoe?.images ?? [{
        id: 'placeholder-new',
        url: `https://picsum.photos/seed/${data.name.replace(/\s+/g, '-')}/600/400`,
        alt: `A photo of ${data.name}`,
        hint: 'shoe photo'
    }];


    const shoeData: Omit<Shoe, 'id' | 'reviews'> = {
        name: data.name,
        brand: data.brand,
        type: data.type,
        category: data.category,
        style: data.category, // simplified mapping
        price: data.price,
        description: data.description,
        images,
        sizes: data.sizes,
        gender: data.gender,
        isOnSale: data.isOnSale
    };

    if (shoe) {
        // Update existing document
        const docRef = doc(firestore, 'shoes', shoe.id);
        setDocumentNonBlocking(docRef, shoeData, { merge: true });
    } else {
        // Create new document
        const collectionRef = collection(firestore, 'shoes');
        addDocumentNonBlocking(collectionRef, shoeData);
    }
    
    // Optimistically close the form
    onFormSubmit(true);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic Runner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Nova" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a product type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Sneakers">Sneakers</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Running, Formal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (KSH)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Unisex">Unisex</SelectItem>
                            <SelectItem value="Men">Men</SelectItem>
                            <SelectItem value="Women">Women</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the shoe"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <FormLabel>Sizes (US Men's)</FormLabel>
            <div className="mt-2 flex flex-wrap gap-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                         <FormField
                            control={form.control}
                            name={`sizes.${index}`}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    className="w-20"
                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                />
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append(0)} // Append a default value
            >
                Add Size
            </Button>
            <FormMessage>{form.formState.errors.sizes?.message}</FormMessage>
        </div>
        
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onFormSubmit(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {shoe ? 'Save Changes' : 'Create Product'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
