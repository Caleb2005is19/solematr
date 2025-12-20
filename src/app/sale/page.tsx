import { getShoes, getAllBrands, getAllSizes, getAllStyles, getAllGenders } from '@/lib/data';
import ShoeFilters from '@/components/shoe-filters';
import ProductGrid from '@/components/product-grid';
import Breadcrumbs from '@/components/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sale',
  description: 'Grab a deal! Shop discounted sneakers and shoes from top brands.',
};

export default async function SalePage({
  searchParams,
}: {
  searchParams: { brand?: string; style?: string; size?: string; gender?: string; };
}) {
  
  const shoesOnSale = await getShoes({ onSale: true, ...searchParams });
  
  const allShoesInType = await getShoes({ onSale: true });
  const brands = [...new Set(allShoesInType.map((shoe) => shoe.brand))];
  const styles = [...new Set(allShoesInType.map((shoe) => shoe.style))];
  const sizes = await getAllSizes();
  const genders = await getAllGenders();

  return (
    <div className="flex flex-col gap-8">
        <div className="space-y-4">
             <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Sale', href: '/sale', isActive: true },
                ]}
            />
            <h1 className="text-4xl font-bold tracking-tight">On Sale</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
                Find the best deals on your favorite footwear. Limited stock available!
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
            <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <ShoeFilters brands={brands} styles={styles} sizes={sizes} genders={genders} />
                </div>
            </aside>
            <section className="lg:col-span-3">
                <ProductGrid shoes={shoesOnSale} />
            </section>
        </div>
    </div>
  );
}
