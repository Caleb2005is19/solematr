import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solemate.co.ke';

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
