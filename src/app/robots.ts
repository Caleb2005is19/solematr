import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-production-url.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow indexing of filter combinations
      disallow: ['/*?brand=', '/*?style=', '/*?size=', '/*?gender='],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
