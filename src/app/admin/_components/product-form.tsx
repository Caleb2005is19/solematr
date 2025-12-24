'use client';

import { useForm } from 'react-hook-form';
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
import type { Shoe } from '@/lib/types';
import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImage } from '@/lib/placeholder-images';

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

const COMMON_SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

export function ProductForm({ shoe, onFormSubmit }: ProductFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');
  
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
  
  const currentSizes = form.watch('sizes');

  const handleCustomSizeAdd = () => {
    const size = parseFloat(customSizeInput);
    if (!isNaN(size) && size > 0 && !currentSizes.includes(size)) {
        const newSizes = [...currentSizes, size].sort((a,b) => a-b);
        form.setValue('sizes', newSizes, { shouldValidate: true });
        setCustomSizeInput('');
    }
  };

  const handleCustomSizeRemove = (size: number) => {
    const newSizes = currentSizes.filter(s => s !== size);
    form.setValue('sizes', newSizes, { shouldValidate: true });
  }

  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const newProductPlaceholder = getPlaceholderImage('placeholder-new-product');
    const imageUrl = newProductPlaceholder
      ? newProductPlaceholder.imageUrl.replace('{{SEED}}', data.name.replace(/\s+/g, '-'))
      : '';
    
    const imageHint = newProductPlaceholder ? newProductPlaceholder.imageHint : 'shoe photo';

    const images = (shoe?.images && shoe.images.length > 0) ? shoe.images : [{
        id: 'placeholder-new',
        url: imageUrl,
        alt: `A photo of ${data.name}`,
        hint: imageHint,
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
        sizes: data.sizes.sort((a,b) => a-b),
        gender: data.gender,
        isOnSale: data.isOnSale
    };

    try {
      if (shoe?.id) {
          // Update existing document
          const docRef = doc(firestore, 'shoes', shoe.id);
          await setDoc(docRef, shoeData, { merge: true });
          toast({
              title: "Product Updated",
              description: `${shoeData.name} has been successfully updated.`,
          });
      } else {
          // Create new document
          await addDoc(collection(firestore, 'shoes'), shoeData);
          toast({
              title: "Product Created",
              description: `${shoeData.name} has been added to the store.`,
          });
      }
      onFormSubmit(true);
    } catch (error: any) {
        console.error("Error saving product:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: error.message || "An unknown error occurred.",
        });
        onFormSubmit(false);
    } finally {
        setIsSubmitting(false);
    }
  };

  const customSizes = currentSizes.filter(s => !COMMON_SIZES.includes(s));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
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
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Tell us a little bit about the shoe"
                        className="resize-none h-32"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="isOnSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-auto">
                      <div className="space-y-0.5">
                        <FormLabel>Put on Sale</FormLabel>
                        <FormDescription>
                          Display this product in the sale section.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
            {/* Right Column */}
            <div className="space-y-6">
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
                                <Input type="number" placeholder="120.00" {...field} value={field.value ?? ""} />
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
                    name="sizes"
                    render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Sizes (US Men's)</FormLabel>
                            <FormDescription>
                                Select from common sizes or add a custom one.
                            </FormDescription>
                        </div>
                        <div className="grid grid-cols-4 gap-2 rounded-md border p-4">
                            {COMMON_SIZES.map((size) => (
                                <FormField
                                key={size}
                                control={form.control}
                                name="sizes"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={size}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(size)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, size].sort((a,b) => a-b))
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value) => value !== size
                                                    )
                                                )
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                        {size}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                        </div>

                         <div className="mt-4">
                            <FormLabel>Custom Sizes</FormLabel>
                            <div className="flex items-center gap-2 mt-2">
                                <Input 
                                    type="number" 
                                    step="0.5" 
                                    placeholder="e.g., 12.5" 
                                    value={customSizeInput}
                                    onChange={(e) => setCustomSizeInput(e.target.value)}
                                    className="w-40"
                                />
                                <Button type="button" variant="outline" size="sm" onClick={handleCustomSizeAdd}>
                                    <Plus className="h-4 w-4 mr-1"/> Add
                                </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {customSizes.map(size => (
                                    <div key={size} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                                        {size}
                                        <Button type="button" variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={() => handleCustomSizeRemove(size)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
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
