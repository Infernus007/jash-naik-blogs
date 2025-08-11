import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { siteConfig } from '../site.config';

export async function GET(context) {
	const posts = await getCollection('blog');
	
	// Sort posts by publication date (newest first)
	const sortedPosts = posts.sort((a, b) => 
		new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
	);
	
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		language: 'en-us',
		managingEditor: `${siteConfig.author.email} (${siteConfig.author.name})`,
		webMaster: `${siteConfig.author.email} (${siteConfig.author.name})`,
		copyright: `Copyright ${new Date().getFullYear()} ${siteConfig.author.name}`,
		category: 'Technology',
		ttl: 60, // Cache for 1 hour
		customData: `
			<image>
				<url>${new URL('/og-image.png', context.site)}</url>
				<title>${SITE_TITLE}</title>
				<link>${context.site}</link>
				<width>1200</width>
				<height>630</height>
			</image>
		`,
		items: sortedPosts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			link: `/blog/${post.slug}/`,
			pubDate: post.data.pubDate,
			author: `${siteConfig.author.email} (${siteConfig.author.name})`,
			categories: [post.data.group, ...(post.data.tags || [])],
			guid: `/blog/${post.slug}/`,
			// Add custom namespaces for better SEO
			customData: `
				<content:encoded><![CDATA[${post.data.description}]]></content:encoded>
				<dc:creator>${siteConfig.author.name}</dc:creator>
				${post.data.heroImage ? `<media:content url="${new URL(post.data.heroImage.startsWith('/') ? post.data.heroImage : `/assets/${post.data.heroImage}`, context.site)}" type="image/png" />` : ''}
			`
		})),
		xmlns: {
			content: 'http://purl.org/rss/1.0/modules/content/',
			dc: 'http://purl.org/dc/elements/1.1/',
			media: 'http://search.yahoo.com/mrss/'
		}
	});
}
