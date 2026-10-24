// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / SITE_BASE are set by the deploy workflow. Without a custom domain the
// site lives at https://happy-dwarf-team.github.io/happydwarf-website/.
const site = process.env.SITE_URL ?? 'https://happydwarf.dev';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
	site,
	base,
	output: 'static',
	trailingSlash: 'always',
	// sitemap-index.xml for robots.txt and the head link; the integration leaves out 404.
	integrations: [sitemap()],
});
