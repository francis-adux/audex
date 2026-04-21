import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string().default('Équipe'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const landings = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroTitle: z.string(),
    heroSubtitle: z.string(),
    ctaText: z.string().default('Nous contacter'),
    image: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    order: z.number().default(0),
    seoTitle: z.string(),
    seoDescription: z.string(),
    heroTitle: z.string(),
    heroSubtitle: z.string(),
    heroImage: z.string().optional(),
    heroImageWebp: z.string().optional(),
    heroImageAlt: z.string().optional(),
    introTitle: z.string(),
    offeringsTitle: z.string().default("Ce qu'Audex peut faire pour vous"),
    offeringsSubtitle: z.string().optional(),
    offerings: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    highlight: z
      .object({
        title: z.string(),
        description: z.string(),
      })
      .optional(),
    testimonial: z
      .object({
        quote: z.string(),
        author: z.string().default('Client(e) vérifié(e), Google'),
      })
      .optional(),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
    ctaText: z.string().default('Discutez de votre situation avec un avocat'),
    relatedServices: z.array(z.string()).default([]),
  }),
});

const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    credentials: z.string().optional(),
    role: z.string(),
    bio: z.string(),
    photo: z.string().optional(),
    order: z.number().default(0),
    mascot: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroTitle: z.string(),
    heroSubtitle: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageWebp: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

export const collections = { blog, landings, services, team, pages };
