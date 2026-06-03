import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://avoc.ca',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/merci') &&
        !page.includes('/landing/'),
      serialize(item) {
        if (item.url === 'https://avoc.ca/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (item.url.includes('/services/')) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        if (item.url.match(/\/avocat-/)) {
          return { ...item, changefreq: 'monthly', priority: 0.85 };
        }
        if (
          item.url.includes('/le-cabinet') ||
          item.url.includes('/notre-equipe') ||
          item.url.includes('/nous-joindre')
        ) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        if (item.url === 'https://avoc.ca/blog/') {
          return { ...item, changefreq: 'weekly', priority: 0.75 };
        }
        if (item.url.includes('/blog/')) {
          return { ...item, changefreq: 'yearly', priority: 0.65 };
        }
        return { ...item, changefreq: 'yearly', priority: 0.3 };
      },
    }),
  ],
  output: 'static',
});
