// Image optimization constants and utilities
export const IMAGE_QUALITY = {
  HERO: 98,           // Hero images (maximum quality)
  BLOG_CONTENT: 95,   // Blog post content images
  CARDS: 95,          // Blog cards and thumbnails
  SUGGESTED: 95,      // Suggested posts images
  GALLERY: 90,        // Gallery images
  THUMBNAILS: 85,     // Small thumbnails
} as const;

export const IMAGE_FORMATS = ['avif', 'webp', 'png', 'jpeg'] as const;
export const DEFAULT_FORMAT = 'webp' as const;

// Responsive image sizes for different contexts
export const IMAGE_SIZES = {
  HERO: "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px",
  BLOG_CONTENT: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
  CARDS: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  SUGGESTED: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  GALLERY: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  THUMBNAILS: "(max-width: 768px) 50vw, 25vw",
} as const;

// Image dimensions for different contexts
export const IMAGE_DIMENSIONS = {
  HERO: { width: 1400, height: 787 }, // 16:9 aspect ratio - higher res
  BLOG_CONTENT: { width: 1000, height: 750 }, // 4:3 aspect ratio - higher res
  CARDS: { width: 800, height: 533 }, // 3:2 aspect ratio - higher res
  SUGGESTED: { width: 800, height: 533 }, // 3:2 aspect ratio - higher res
  GALLERY: { width: 800, height: 533 }, // 3:2 aspect ratio - higher res
  THUMBNAILS: { width: 400, height: 267 }, // 3:2 aspect ratio - higher res
} as const;

// Aspect ratios
export const ASPECT_RATIOS = {
  HERO: '16/9',
  BLOG_CONTENT: '4/3',
  CARDS: '3/2',
  SUGGESTED: '3/2',
  GALLERY: '3/2',
  THUMBNAILS: '3/2',
  SQUARE: '1/1',
} as const;

export type ImageContext = keyof typeof IMAGE_QUALITY;
export type ImageFormat = typeof IMAGE_FORMATS[number];

/**
 * Get optimized image configuration for a specific context
 */
export function getImageConfig(context: ImageContext) {
  return {
    quality: IMAGE_QUALITY[context],
    format: DEFAULT_FORMAT,
    sizes: IMAGE_SIZES[context],
    dimensions: IMAGE_DIMENSIONS[context],
    aspectRatio: ASPECT_RATIOS[context],
  };
}

/**
 * Get responsive sizes string for image loading
 */
export function getResponsiveSizes(context: ImageContext): string {
  return IMAGE_SIZES[context];
}

/**
 * Check if image should use eager loading (for above-the-fold content)
 */
export function shouldUseEagerLoading(context: ImageContext): boolean {
  return context === 'HERO';
}

/**
 * Get decoding strategy based on context
 */
export function getDecodingStrategy(context: ImageContext): 'sync' | 'async' | 'auto' {
  return context === 'HERO' ? 'sync' : 'async';
}
