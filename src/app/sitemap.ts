import type { MetadataRoute } from 'next';
import { listCategorySlugs } from '@/lib/content';
import { SITE_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const statik = ['', '/taktik', '/semak', '/kalau-dah-kena', '/status-laporan', '/privasi', '/hak-menjawab', '/tentang'];
  const kategori = listCategorySlugs().map((slug) => `/taktik/${slug}`);

  return [...statik, ...kategori].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
