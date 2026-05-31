import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api/', '/login', '/register', '/order/sukses/'],
      },
    ],
    sitemap: 'https://rhpcreatives.com/sitemap.xml',
  }
}
