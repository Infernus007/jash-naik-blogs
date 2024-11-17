import type { ImageMetadata } from "astro";
import { siteConfig } from '../site.config';

export const getImagePromise = (imagePath: string) => {
	const images = import.meta.glob<{ default: ImageMetadata }>(
		"/src/assets/*.{jpeg,jpg,png,gif,svg}",
	);
	console.log("images", images);
	if (!images[`/src/assets/${imagePath}`])
		throw new Error(
			`"${imagePath}" does not exist in glob: "src/assets/*.{jpeg,jpg,png,gif}"`,
		);


	return images[`/src/assets/${imagePath}`]();
};

export const useAiFeatures = () => {
	return siteConfig.enableAiFeatures;
};
