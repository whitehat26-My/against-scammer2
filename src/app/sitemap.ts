import type { MetadataRoute } from 'next';
import { listCategorySlugs } from '@/lib/content';
import { listArticleSlugs } from '@/lib/berita';
import { SITE_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const statik = [
    '',
    '/taktik',
    '/semak',
    '/lapor',
    '/berita',
    '/kalau-dah-kena',
    '/status-laporan',
    '/privasi',
    '/hak-menjawab',
    '/tentang',
  ];
  const kategori = listCategorySlugs().map((slug) => `/taktik/${slug}`);
  const artikel = listArticleSlugs().map((slug) => `/berita/${slug}`);

  return [...statik, ...kategori, ...artikel].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
