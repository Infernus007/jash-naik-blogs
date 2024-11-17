import { defineCollection, z, reference } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    relatedPosts: z.array(reference("blog")).optional(),
    tags: z.string().array().optional(),
    group: z.enum(["AI", "CyberSecurity", "Web Dev", "CTF"]),
  })
});

export const collections = { blog };
