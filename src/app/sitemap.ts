import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://infraroodverwarming-soest.nl'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/embed`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/embed/example`,
      lastModified: new Date(),
    },
  ]
}
