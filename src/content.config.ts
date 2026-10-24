import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// The hub's team projects (docs/spec.md, section 4.1). Plugins are not here: they come from
// the Anvil catalog's plugins.json at build time (src/lib/projects.ts).
const projects = defineCollection({
	loader: file('src/data/projects.yaml'),
	schema: z
		.object({
			name: z.string(),
			group: z.enum(['anvil-ecosystem', 'mod-tools', 'anbennar']),
			order: z.number(),
			// One sentence in a user's words; `code` spans are allowed.
			summary: z.string(),
			status: z.enum(['released', 'preview', 'template', 'archived']),
			// Own site, else the Steam Workshop item, else the repository.
			primary: z.object({ href: z.url(), label: z.string() }),
			repo: z.url().startsWith('https://github.com/happy-dwarf-team/'),
			// Steam Workshop item id; primary.href is then that item's page.
			workshop: z.string().regex(/^\d+$/).optional(),
			featured: z.boolean().default(false),
			// Only for a project with its own site accent (today Etch); shown on its icon.
			accent: z
				.string()
				.regex(/^#[0-9a-f]{6}$/i)
				.optional(),
		})
		.refine(
			(p) =>
				!p.workshop ||
				p.primary.href === `https://steamcommunity.com/sharedfiles/filedetails/?id=${p.workshop}`,
			{ message: 'must be the page of the `workshop` item', path: ['primary', 'href'] },
		),
});

export const collections = { projects };
