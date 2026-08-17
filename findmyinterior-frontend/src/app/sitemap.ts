import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://findmyinterior.com';
  
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/professionals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/materials`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/post-requirement`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic SEO Local Pages
  const categories = [
    'interior-designers',
    'architects',
    'contractors',
    'builders',
    'carpenters',
    'electricians',
    'plumbers',
    'material-suppliers',
    'painters'
  ];
  
  const cities = ['patna']; // Expandable list of cities

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  
  cities.forEach(city => {
    categories.forEach(category => {
      dynamicRoutes.push({
        url: `${baseUrl}/${category}/${city}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  return [...baseRoutes, ...dynamicRoutes];
}
