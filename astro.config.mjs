import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import rehypePrettyCode from "rehype-pretty-code";
import pagefind from "astro-pagefind";
import compressor from "astro-compressor";
import embeds from 'astro-embed/integration';
import fs from 'fs';

/** @type {import('rehype-pretty-code').Options} */
const options = {
	// See Options section below.
	theme: {
		dark: JSON.parse(fs.readFileSync("./public/OneDark-Pro.json", "utf-8")),
		light: JSON.parse(fs.readFileSync("./public/OneLight.json", "utf-8")),
	},
	keepBackground: false,
};

// https://astro.build/config
export default defineConfig({
	site: "https://jash-naik-blogs.vercel.app/",
	image: {
		// Enable image optimization with high-quality settings
		service: {
			entrypoint: 'astro/assets/services/sharp',
			config: {
				limitInputPixels: false,
				// Sharp-specific configuration for better quality
				jpeg: {
					quality: 95,
					progressive: true,
				},
				webp: {
					quality: 95,
					lossless: false,
				},
				avif: {
					quality: 95,
				},
				png: {
					quality: 95,
					compressionLevel: 6,
				},
			},
		},
		// Configure image formats with priority order
		formats: ['avif', 'webp', 'png', 'jpeg'],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.vercel.app",
			},
			{
				protocol: "https",
				hostname: "*.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "*.gstatic.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "cdn.jsdelivr.net",
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
			},
		],
	},
	integrations: [
		embeds(),
		mdx(),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
			// Add custom entries for better SEO
			customPages: [
				'https://jash-naik-blogs.vercel.app/',
				'https://jash-naik-blogs.vercel.app/search',
			],
			// Filter out unnecessary pages
			filter: (page) => !page.includes('/api/') && !page.includes('/sidebar-content'),
		}),
		react(),
		tailwind(),
		pagefind(),
		compressor(),
	],

	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [[rehypePrettyCode, options]],
	},
});
