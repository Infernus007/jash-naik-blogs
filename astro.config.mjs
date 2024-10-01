import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import rehypePrettyCode from "rehype-pretty-code";
import pagefind from "astro-pagefind";


/** @type {import('rehype-pretty-code').Options} */
const options = {
	// See Options section below.
	theme: 
	{
	dark : JSON.parse(fs.readFileSync("./public/OneDark-Pro.json", "utf-8")),
	light : JSON.parse(fs.readFileSync("./public/OneLight.json", "utf-8")),
	},
keepBackground : false
  };



// https://astro.build/config
export default defineConfig({
	build : {
		format : "file"
	},
	site: "https://example.com",
	integrations: [mdx(), sitemap(), react(), tailwind() , pagefind()],


	markdown: {
		syntaxHighlight: false,
		rehypePlugins : [[rehypePrettyCode, options]]
	},
});
