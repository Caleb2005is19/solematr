import { getShoes, getAllSizes, getAllStyles, getAllGenders, getCategoryDetails } from '@/lib/data';
import ShoeFilters from '@/components/shoe-filters';
import ProductGrid from '@/components/product-grid';
import Breadcrumbs from '@/components/breadcrumbs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { capitalize } from '@/lib/utils';

type Props = {
  params: { category: string };
  searchParams: { brand?: string; style?: string; size?: string; gender?: string; };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryDetails = await getCategoryDetails('sneakers', params.category);
  if (!categoryDetails || categoryDetails.title.includes('All')) {
    return {
      title: 'Category Not Found'
    }
  }

  return {
    title: categoryDetails.title,
    description: categoryDetails.description,
  };
}

export async function generateStaticParams() {
  const allShoes = await getShoes({ type: 'Sneakers' });
  const categories = [...new Set(allShoes.map(shoe => shoe.category.toLowerCase()))];
  return categories.map((category) => ({ category }));
}

export default async function SneakerCategoryPage({ params, searchParams }: Props) {
  const { category } = params;
  
  const { title, description } = await getCategoryDetails('sneakers', category);

  // If the category doesn't exist in our details mapping, it's a 404
  if (title.includes('All ')) {
      notFound();
  }

  const shoes = await getShoes({ type: 'Sneakers', category, ...searchParams });
  
  // Filters should be based on the items available within this category
  const allShoesInCategory = await getShoes({ type: 'Sneakers', category });
  const brands = [...new Set(allShoesInCategory.map((shoe) => shoe.brand))];
  const styles = [...new Set(allShoesInCategory.map((shoe) => shoe.style))];
  const sizes = await getAllSizes();
  const genders = await getAllGenders();

  return (
    <div className="flex flex-col gap-8">
        <div className="space-y-4">
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Sneakers', href: '/sneakers' },
                    { label: capitalize(category), href: `/sneakers/${category}`, isActive: true },
                ]}
            />
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
            <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <ShoeFilters brands={brands} styles={styles} sizes={sizes} genders={genders} />
                </div>
            </aside>
            <section className="lg:col-span-3">
                <ProductGrid shoes={shoes} />
            </section>
        </div>
    </div>
  );
}
