import type { ImageMetadata } from "astro";

/**
 * Retrieves the image promise based on the provided imagePath.
 *
 * @param {string} imagePath - The path of the image to retrieve ("ex. logo.svg").
 * @return {ImageMetadata} The promise representing the image metadata.
 */
export const getImagePromise = (imagePath: string) => {
  const images = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/*.{jpeg,jpg,png,gif,svg}"
  );
  if (!images[`/src/assets/${imagePath}`])
    throw new Error(
      `"${imagePath}" does not exist in glob: "src/assets/*.{jpeg,jpg,png,gif}"`
    );

  return images[`/src/assets/${imagePath}`];
};
