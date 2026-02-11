import { MetadataRoute } from 'next'
import { getShoes, getAllBrands } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://solemate.co.ke';

  // Base static routes - Give homepage highest priority
  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/sneakers', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/shoes', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/sale', priority: 0.8, changeFrequency: 'weekly' as const },
  ].map((route) => ({
    url: `${siteUrl}${route.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Product pages - lower priority, updated weekly
  const products = await getShoes();
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Category pages for sneakers
  const sneakerCategories = [...new Set(products.filter(p => p.type === 'Sneakers').map(p => p.category.toLowerCase()))];
  const sneakerCategoryRoutes = sneakerCategories.map(category => ({
    url: `${siteUrl}/sneakers/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages for shoes
  const shoeCategories = [...new Set(products.filter(p => p.type === 'Shoes').map(p => p.category.toLowerCase()))];
  const shoeCategoryRoutes = shoeCategories.map(category => ({
    url: `${siteUrl}/shoes/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Brand pages
  const brands = await getAllBrands();
  const brandRoutes = brands.map(brand => ({
    url: `${siteUrl}/brands/${brand.toLowerCase()}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));


  return [
    ...routes,
    ...productRoutes,
    ...sneakerCategoryRoutes,
    ...shoeCategoryRoutes,
    ...brandRoutes,
  ];
}
