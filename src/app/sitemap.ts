import type { MetadataRoute } from 'next'
import { getAllModSlugs } from '@/lib/queries/mods'
import { CATEGORIES, MOD_SUBCATEGORIES, SITE_URL } from '@/lib/constants'

export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllModSlugs()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/browse`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/install`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/sponsor`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/browse?category=${cat.value}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: cat.value === 'mod' ? 0.95 : 0.75,
  }))

  const modSubcategoryRoutes: MetadataRoute.Sitemap = MOD_SUBCATEGORIES.map((sub) => ({
    url: `${SITE_URL}/browse?category=mod&sub=${sub.value}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }))

  const modRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/mods/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...modSubcategoryRoutes, ...modRoutes]
}
