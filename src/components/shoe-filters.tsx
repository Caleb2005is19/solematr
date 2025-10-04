'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShoeFiltersProps {
  brands: string[];
  styles: string[];
  sizes: number[];
}

export default function ShoeFilters({ brands, styles, sizes }: ShoeFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (type: 'brand' | 'style' | 'size', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (!value) {
      current.delete(type);
    } else {
      current.set(type, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };
  
  const clearFilters = () => {
    router.push(pathname);
  };

  const hasFilters = searchParams.has('brand') || searchParams.has('style') || searchParams.has('size');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Select onValueChange={(value) => handleFilterChange('brand', value)} defaultValue={searchParams.get('brand') || ''}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Style</label>
          <Select onValueChange={(value) => handleFilterChange('style', value)} defaultValue={searchParams.get('style') || ''}>
            <SelectTrigger>
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Styles</SelectItem>
              {styles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Size</label>
          <Select onValueChange={(value) => handleFilterChange('size', value)} defaultValue={searchParams.get('size') || ''}>
            <SelectTrigger>
              <SelectValue placeholder="All Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sizes</SelectItem>
              {sizes.map((size) => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="w-full">
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
