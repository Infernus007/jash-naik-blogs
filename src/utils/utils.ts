import type { ImageMetadata } from "astro";
import { siteConfig } from '../site.config';

export const getImagePromise = (imagePath: string) => {
	const images = import.meta.glob<{ default: ImageMetadata }>(
		"/src/assets/**/*.{jpeg,jpg,png,gif,svg,webm}",
	);

	// Normalize the path to always start with /
	const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
	const fullPath = `/src/assets${normalizedPath}`;

	if (!images[fullPath])
		throw new Error(
			`"${imagePath}" does not exist in glob: "src/assets/**/*.{jpeg,jpg,png,gif,svg,webm}". Tried path: ${fullPath}`,
		);

	return images[fullPath]();
};

export const useAiFeatures = () => {
	return siteConfig.enableAiFeatures;
};

export const getImagePath = (path: string) => {
	if (path.startsWith('http')) return path;
	return new URL(path, import.meta.url).href;
};

/**
 * Resolves hero image path for OG meta tags and social sharing
 * @param heroImage - Hero image path from blog frontmatter
 * @param siteUrl - Site base URL
 * @returns Resolved absolute URL for the image
 */
export const resolveHeroImageUrl = (heroImage: string | undefined, siteUrl: URL): string => {
	if (!heroImage) {
		return new URL("/og-image.png", siteUrl).toString();
	}

	// If it's already a full URL, return as is
	if (heroImage.startsWith('http')) {
		return heroImage;
	}

	// If it starts with /, treat as public asset
	if (heroImage.startsWith('/')) {
		return new URL(heroImage, siteUrl).toString();
	}

	// For assets from src/assets, they get processed by Astro and placed in /_astro/
	// During build, these become public assets, so we need to reference them correctly
	// For now, treat them as if they're in the public folder under /assets/
	return new URL(`/assets/${heroImage}`, siteUrl).toString();
};

/**
 * Validates if hero image exists in assets
 * @param heroImage - Hero image path
 * @returns boolean indicating if image exists
 */
export const validateHeroImage = async (heroImage: string | undefined): Promise<boolean> => {
	if (!heroImage) return false;

	try {
		const images = import.meta.glob<{ default: ImageMetadata }>(
			"/src/assets/**/*.{jpeg,jpg,png,gif,svg,webp}",
		);

		const imagePath = heroImage.startsWith('/') ? heroImage : `/${heroImage}`;
		const imageKey = `/src/assets${imagePath}`;

		return imageKey in images;
	} catch {
		return false;
	}
};
