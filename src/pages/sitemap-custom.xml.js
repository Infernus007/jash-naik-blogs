import { getCollection } from 'astro:content';
import { siteConfig } from '../site.config';

export async function GET(context) {
  const posts = await getCollection('blog');
  
  // Define URL priorities and change frequencies
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/search', priority: 0.8, changefreq: 'weekly' },
  ];

  // Generate blog post entries
  const blogPages = posts.map(post => ({
    url: `/blog/${post.slug}/`,
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: post.data.updatedDate || post.data.pubDate
  }));

  // Combine all pages
  const allPages = [...staticPages, ...blogPages];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${new URL(page.url, context.site).toString()}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod.toISOString()}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
}
