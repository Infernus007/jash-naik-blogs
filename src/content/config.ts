import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    relatedPosts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    group: z.enum(["AI", "CyberSecurity", "Web Dev", "CTF"]),
    readingTime: z.number().optional(),
    author: z.string().default("Jash Naik"),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
  })
});

export const collections = { blog };
