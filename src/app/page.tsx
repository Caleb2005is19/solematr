import { getShoes } from '@/lib/data';
import ShoeCard from '@/components/shoe-card';
import ShoeFilters from '@/components/shoe-filters';
import { XCircle } from 'lucide-react';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { brand?: string; style?: string; size?: string };
}) {
  const allShoes = await getShoes();

  const brands = [...new Set(allShoes.map((shoe) => shoe.brand))];
  const styles = [...new Set(allShoes.map((shoe) => shoe.style))];
  const sizes = [...new Set(allShoes.flatMap(shoe => shoe.sizes))].sort((a,b) => a - b);

  const filteredShoes = allShoes.filter((shoe) => {
    return (
      (!searchParams.brand || shoe.brand === searchParams.brand) &&
      (!searchParams.style || shoe.style === searchParams.style) &&
      (!searchParams.size || shoe.sizes.includes(Number(searchParams.size)))
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <ShoeFilters brands={brands} styles={styles} sizes={sizes} />
        </div>
      </aside>
      <section className="lg:col-span-3">
        {filteredShoes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredShoes.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed">
            <XCircle className="w-16 h-16 text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-semibold">No Shoes Found</h2>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
