import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Trang được host tại https://vacif.github.io/OSCP/
export default defineConfig({
  site: 'https://vacif.github.io',
  base: '/OSCP',
  trailingSlash: 'always',
  integrations: [mdx(), react()],
});
