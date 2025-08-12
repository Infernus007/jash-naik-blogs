export const siteConfig = {
  // Core Site Info
  name: "Jash's Blog",
  title: "Jash Naik's Blog - Cybersecurity & AI Insights",
  description: "Explore cutting-edge insights in Cybersecurity and Artificial Intelligence with in-depth blogs, tutorials, and projects. Learn how AI is transforming security, master ethical hacking, and stay ahead of digital threats.",
  url: "https://jashnaik.dev", // Updated to match robots.txt
  
  // SEO & Social
  keywords: [
    "cybersecurity", "artificial intelligence", "AI", "machine learning", 
    "ethical hacking", "security", "web development", "tech tutorials",
    "CTF", "penetration testing", "zero trust", "supply chain attacks",
    "AI security", "software development", "programming"
  ],
  author: {
    name: "Jash Naik",
    email: "jash@example.com", // Replace with actual email
    twitter: "@CodeAIShield",
    linkedin: "https://linkedin.com/in/jashnaik", // Replace with actual LinkedIn
    github: "https://github.com/jashnaik", // Replace with actual GitHub
  },
  
  // Technical SEO
  sitemap: true,
  rss: true,
  robots: true,
  canonical: true,
  
  // Content Settings
  postsPerPage: 10,
  blogPath: "/blog",
  
  // Features
  enableAiFeatures: false,
  enableComments: false,
  enableAnalytics: true,
  
  // Performance
  enableImageOptimization: true,
  enableLazyLoading: true,
} as const;

export type SiteConfig = typeof siteConfig; 