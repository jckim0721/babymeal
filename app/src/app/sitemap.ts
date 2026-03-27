import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://babymeal-eight.vercel.app';
  const now = new Date();

  return [
    { url: base,                              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/recipe`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/gacha`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/history`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/badge`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/about`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy-policy`,          lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms-of-service`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
