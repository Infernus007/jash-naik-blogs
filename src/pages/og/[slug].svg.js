// Dynamic OpenGraph image generator endpoint
import { getCollection } from 'astro:content';

export async function GET({ params, request }) {
  const { slug } = params;
  
  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  try {
    // Get the blog post
    const posts = await getCollection('blog');
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // Generate SVG for the OpenGraph image
    const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0B1120"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Grid pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.1"/>
      </pattern>
      <rect width="1200" height="630" fill="url(#grid)"/>
      
      <!-- Main content area -->
      <rect x="80" y="80" width="1040" height="470" fill="rgba(255,255,255,0.05)" rx="20"/>
      
      <!-- Title -->
      <text x="120" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="start">
        ${post.data.title.length > 50 ? post.data.title.substring(0, 50) + '...' : post.data.title}
      </text>
      
      <!-- Description -->
      <text x="120" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#e2e8f0" text-anchor="start">
        ${post.data.description ? (post.data.description.length > 100 ? post.data.description.substring(0, 100) + '...' : post.data.description) : ''}
      </text>
      
      <!-- Author and date -->
      <text x="120" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#94a3b8" text-anchor="start">
        By Jash Naik • ${post.data.pubDate.toLocaleDateString()}
      </text>
      
      <!-- Category badge -->
      <rect x="120" y="360" width="${(post.data.group || 'Blog').length * 12 + 40}" height="40" fill="#3b82f6" rx="20"/>
      <text x="${120 + ((post.data.group || 'Blog').length * 12 + 40) / 2}" y="385" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="white" text-anchor="middle">
        ${post.data.group || 'Blog'}
      </text>
      
      <!-- Logo/Brand -->
      <circle cx="1050" cy="180" r="50" fill="#3b82f6" opacity="0.2"/>
      <text x="1050" y="190" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">
        JN
      </text>
      
      <!-- Decorative elements -->
      <circle cx="1000" cy="500" r="30" fill="#8b5cf6" opacity="0.3"/>
      <circle cx="200" cy="500" r="20" fill="#06b6d4" opacity="0.4"/>
      <rect x="900" y="450" width="60" height="4" fill="#f59e0b" opacity="0.5" rx="2"/>
    </svg>`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
      }
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  
  return posts.map(post => ({
    params: { 
      slug: post.slug 
    }
  }));
}
