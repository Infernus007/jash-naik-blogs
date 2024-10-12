import type { ImageMetadata } from "astro";

export const getImagePromise = (imagePath: string) => {
	const images = import.meta.glob<{ default: ImageMetadata }>(
		"/src/assets/*.{jpeg,jpg,png,gif,svg}",
	);
	if (!images[`/src/assets/${imagePath}`])
		throw new Error(
			`"${imagePath}" does not exist in glob: "src/assets/*.{jpeg,jpg,png,gif}"`,
		);

	return images[`/src/assets/${imagePath}`];
};
