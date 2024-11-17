export const siteConfig = {
  enableAiFeatures: false,
  // Add other site-wide configuration options here
} as const;

export type SiteConfig = typeof siteConfig; 