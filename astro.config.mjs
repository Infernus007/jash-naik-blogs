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
