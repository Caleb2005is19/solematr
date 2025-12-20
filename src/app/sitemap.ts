import { MetadataRoute } from 'next'
import { getShoes, getAllBrands } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-production-url.com';

  // Base static routes
  const routes = [
    '/',
    '/sneakers',
    '/shoes',
    '/sale',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Product pages
  const products = await getShoes();
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    lastModified: new Date().toISOString(),
  }));

  // Category pages for sneakers
  const sneakerCategories = [...new Set(products.filter(p => p.type === 'Sneakers').map(p => p.category.toLowerCase()))];
  const sneakerCategoryRoutes = sneakerCategories.map(category => ({
    url: `${siteUrl}/sneakers/${category}`,
    lastModified: new Date().toISOString(),
  }));

  // Category pages for shoes
  const shoeCategories = [...new Set(products.filter(p => p.type === 'Shoes').map(p => p.category.toLowerCase()))];
  const shoeCategoryRoutes = shoeCategories.map(category => ({
    url: `${siteUrl}/shoes/${category}`,
    lastModified: new Date().toISOString(),
  }));

  // Brand pages
  const brands = await getAllBrands();
  const brandRoutes = brands.map(brand => ({
    url: `${siteUrl}/brands/${brand.toLowerCase()}`,
    lastModified: new Date().toISOString(),
  }));


  return [
    ...routes,
    ...productRoutes,
    ...sneakerCategoryRoutes,
    ...shoeCategoryRoutes,
    ...brandRoutes,
  ];
}
