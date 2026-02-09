import { getShoes, getAllBrands, getAllSizes, getAllStyles, getAllGenders } from '@/lib/data';
import ShoeFilters from '@/components/shoe-filters';
import ProductGrid from '@/components/product-grid';
import Breadcrumbs from '@/components/breadcrumbs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { capitalize } from '@/lib/utils';

type Props = {
  params: { brand: string };
  searchParams: { style?: string; size?: string; gender?: string; };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brandName = capitalize(params.brand);
  return {
    title: `${brandName} Shoes & Sneakers`,
    description: `Shop the latest collection of shoes and sneakers from ${brandName} at SoleMate Kenya.`,
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { brand } = params;
  
  const allBrands = await getAllBrands();
  if (!allBrands.map(b => b.toLowerCase()).includes(brand)) {
    notFound();
  }

  const shoes = await getShoes({ brand, ...searchParams });
  
  const allShoesForBrand = await getShoes({ brand });
  const styles = [...new Set(allShoesForBrand.map((shoe) => shoe.style))];
  const sizes = await getAllSizes();
  const genders = await getAllGenders();

  return (
    <div className="flex flex-col gap-8">
        <div className="space-y-4">
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Brands', href: '#' }, // No top-level brands page for now
                    { label: capitalize(brand), href: `/brands/${brand}`, isActive: true },
                ]}
            />
            <h1 className="text-4xl font-bold tracking-tight">Shop {capitalize(brand)}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">Explore our curated collection of footwear from {capitalize(brand)}.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
            <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    {/* We pass an empty array for brands to hide that filter on the brand page itself */}
                    <ShoeFilters brands={[]} styles={styles} sizes={sizes} genders={genders} />
                </div>
            </aside>
            <section className="lg:col-span-3">
                <ProductGrid shoes={shoes} />
            </section>
        </div>
    </div>
  );
}
