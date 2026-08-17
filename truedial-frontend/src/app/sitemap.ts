import { MetadataRoute } from 'next';

const POPULAR_CITIES = ['mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai'];
const POPULAR_CATEGORIES = ['interior-designers', 'architects', 'restaurants', 'plumbers', 'contractors'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://truedial.in';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic City x Category Routes
  POPULAR_CITIES.forEach(city => {
    POPULAR_CATEGORIES.forEach(category => {
      routes.push({
        url: `${baseUrl}/${city}/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  return routes;
}
