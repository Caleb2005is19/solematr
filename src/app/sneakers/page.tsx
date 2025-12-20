import { getShoes, getAllBrands, getAllSizes, getAllStyles, getAllGenders, getCategoryDetails } from '@/lib/data';
import ShoeFilters from '@/components/shoe-filters';
import ProductGrid from '@/components/product-grid';
import Breadcrumbs from '@/components/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sneakers',
  description: 'Explore our full collection of sneakers. From streetwear to running, find your perfect pair.',
};

export default async function SneakersPage({
  searchParams,
}: {
  searchParams: { brand?: string; style?: string; size?: string; gender?: string; };
}) {
  
  const { title, description } = await getCategoryDetails('sneakers', '');
  
  const shoes = await getShoes({ type: 'Sneakers', ...searchParams });
  
  const allShoesInType = await getShoes({ type: 'Sneakers' });
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
                    { label: 'Sneakers', href: '/sneakers', isActive: true },
                ]}
            />
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
            <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <ShoeFilters brands={brands} styles={styles} sizes={sizes} genders={genders} />
                    {/* <RecentlyViewed /> can be added here if desired */}
                </div>
            </aside>
            <section className="lg:col-span-3">
                <ProductGrid shoes={shoes} />
            </section>
        </div>
    </div>
  );
}
