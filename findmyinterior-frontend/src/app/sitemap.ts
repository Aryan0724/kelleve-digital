import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://findmyinterior.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/professionals`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/materials`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/jobs`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/cost-calculator`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/post-requirement`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const biharCities = [
    'patna', 'gaya', 'muzaffarpur', 'bhagalpur', 'darbhanga',
    'purnia', 'bihar-sharif', 'arrah', 'begusarai', 'katihar'
  ];

  const cityRoutes: MetadataRoute.Sitemap = biharCities.map((city) => ({
    url: `${baseUrl}/professionals?city=${city}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categories = [
    'interior-designer', 'architect', 'contractor', 'builder',
    'material-supplier', 'skilled-worker', 'modular-kitchen'
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/professionals?category=${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes];
}
