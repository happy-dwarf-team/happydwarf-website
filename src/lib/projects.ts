// The project list (docs/spec.md, section 4): the team projects of src/data/projects.yaml plus
// the team's plugins from the Anvil catalog's plugins.json, as the three project groups of the
// home page. Read once per build.
import { getCollection } from 'astro:content';
import { z } from 'astro/zod';
import { getLatestVersion } from './release';

export const PLUGINS_JSON_URL = 'https://anvil.happydwarf.dev/plugins.json';
export const CATALOG_URL = 'https://anvil.happydwarf.dev/plugins/';
// Plugin rows shown in the Anvil group; the catalog link covers the rest.
export const PLUGIN_ROW_CAP = 5;
const TEAM_REPO_PREFIX = 'https://github.com/happy-dwarf-team/';

export type GroupId = 'anvil-ecosystem' | 'mod-tools' | 'anbennar';

export type Badge =
	| { kind: 'version'; version: string }
	| { kind: 'label'; label: 'Preview' | 'Template' | 'Archived' };

export interface ProjectRow {
	id: string;
	name: string;
	// One sentence; `code` spans are written in backticks.
	summary: string;
	// null when the release data could not be fetched (the build log has a warning).
	badge: Badge | null;
	primary: { href: string; label: string };
	// "Source on GitHub", set when the primary destination is not the repository.
	source?: string;
	// "Steam Workshop", set for a plugin whose mod is on the Workshop.
	workshop?: string;
	// Inline SVG markup in the family icon grammar; its accent is currentColor. A plugin
	// without an icon has none.
	icon: string | null;
	// The project's own site accent for its icon; unset means the site accent.
	accent?: string;
	featured: boolean;
	archived: boolean;
}

export interface ProjectGroup {
	id: GroupId;
	title: string;
	intro: string;
	rows: ProjectRow[];
	// The rail count: every catalog entry for the Anvil group, the rows for the others.
	count: number;
	unit: 'plugins' | 'projects';
	// The "All N plugins in the Anvil catalog" link, when the catalog has more than five.
	catalog?: { href: string; count: number };
}

// The three project groups in page order.
export const GROUPS: { id: GroupId; title: string; intro: string }[] = [
	{
		id: 'anvil-ecosystem',
		title: 'Anvil ecosystem',
		intro: 'Anvil loads native plugins into the game; the plugins do what mods can’t.',
	},
	{
		id: 'mod-tools',
		title: 'Tools for mod authors',
		intro: 'For people who make mods: see your interface as you write it, publish with one command.',
	},
	{
		id: 'anbennar',
		title: 'Anbennar mods',
		intro:
			'Interface mods for Anbennar, the fantasy total conversion of EU4. Anbennar is made by its own team; these mods need it installed.',
	},
];

// The hub's side of the plugins.json contract (docs/spec.md, section 7.7). Unknown fields are
// ignored; anything else that does not match fails the build.
const pluginsJsonSchema = z.object({
	schemaVersion: z.literal(1),
	plugins: z.array(
		z.object({
			id: z.string().regex(/^[a-z0-9-]+$/),
			name: z.string(),
			tagline: z.string(),
			repo: z.url(),
			status: z.enum(['planned', 'in-development', 'released']),
			order: z.number(),
			url: z.url(),
			// Inlined into the page, so only plain SVG markup.
			icon: z
				.string()
				.refine((svg) => /^<svg[\s>]/.test(svg) && !/<script|<foreignObject|\son\w+\s*=|javascript:/i.test(svg), {
					message: 'must be SVG markup without scripts or event handlers',
				})
				.nullable(),
			// The plugin's Workshop item page; missing or null without one.
			workshop: z
				.string()
				.regex(/^https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=\d+$/)
				.nullish(),
		}),
	),
});

type CatalogPlugin = z.infer<typeof pluginsJsonSchema>['plugins'][number];

async function fetchCatalog(): Promise<CatalogPlugin[]> {
	let data: unknown;
	try {
		const res = await fetch(PLUGINS_JSON_URL, { signal: AbortSignal.timeout(30_000) });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		data = await res.json();
	} catch (error) {
		throw new Error(`Cannot fetch ${PLUGINS_JSON_URL}: ${String(error)}`);
	}
	const parsed = pluginsJsonSchema.safeParse(data);
	if (!parsed.success) {
		throw new Error(`${PLUGINS_JSON_URL} does not match the contract:\n${z.prettifyError(parsed.error)}`);
	}
	return parsed.data.plugins;
}

const icons = import.meta.glob<string>('../assets/projects/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default',
});

// Status badge rules, in order: archived, template, released (latest release, "Preview"
// without one), preview.
async function badgeFor(status: 'released' | 'preview' | 'template' | 'archived', repo: string): Promise<Badge | null> {
	if (status === 'archived') return { kind: 'label', label: 'Archived' };
	if (status === 'template') return { kind: 'label', label: 'Template' };
	if (status === 'released') {
		const version = await getLatestVersion(repo);
		if (version === undefined) return null;
		if (version !== null) return { kind: 'version', version };
	}
	return { kind: 'label', label: 'Preview' };
}

async function loadProjectRows(): Promise<(ProjectRow & { group: GroupId; order: number })[]> {
	const entries = await getCollection('projects');
	// The file() loader logs a YAML error and loads nothing instead of failing the build.
	if (entries.length === 0) throw new Error('src/data/projects.yaml has no projects');
	if (entries.filter((e) => e.data.featured).length > 1) {
		throw new Error('src/data/projects.yaml: only one project can be featured');
	}
	return Promise.all(
		entries.map(async ({ id, data }) => {
			const icon = icons[`../assets/projects/${id}.svg`];
			if (!icon) throw new Error(`Project ${id} has no icon src/assets/projects/${id}.svg`);
			return {
				id,
				name: data.name,
				summary: data.summary,
				badge: await badgeFor(data.status, data.repo),
				primary: data.primary,
				source: data.primary.href === data.repo ? undefined : data.repo,
				icon: icon.trim(),
				accent: data.accent,
				featured: data.featured,
				archived: data.status === 'archived',
				group: data.group,
				order: data.order,
			};
		}),
	);
}

async function pluginRow(plugin: CatalogPlugin): Promise<ProjectRow> {
	return {
		id: plugin.id,
		name: plugin.name,
		summary: plugin.tagline,
		badge: await badgeFor(plugin.status === 'released' ? 'released' : 'preview', plugin.repo),
		primary: { href: plugin.url, label: 'Plugin page' },
		source: plugin.repo,
		workshop: plugin.workshop ?? undefined,
		icon: plugin.icon?.trim() ?? null,
		featured: false,
		archived: false,
	};
}

async function loadGroups(): Promise<ProjectGroup[]> {
	const [projects, catalog] = await Promise.all([loadProjectRows(), fetchCatalog()]);
	// Only the team's own plugins get rows, and none that are only planned.
	const plugins = await Promise.all(
		catalog
			.filter((p) => p.repo.startsWith(TEAM_REPO_PREFIX) && p.status !== 'planned')
			.sort((a, b) => a.order - b.order)
			.slice(0, PLUGIN_ROW_CAP)
			.map(pluginRow),
	);

	return GROUPS.map(({ id, title, intro }) => {
		// By order, archived rows last.
		const own = projects
			.filter((p) => p.group === id)
			.sort((a, b) => Number(a.archived) - Number(b.archived) || a.order - b.order)
			.map(({ group: _group, order: _order, ...row }) => row);
		if (id !== 'anvil-ecosystem') return { id, title, intro, rows: own, count: own.length, unit: 'projects' };
		// Anvil, then the plugins, then the Plugin template last.
		return {
			id,
			title,
			intro,
			rows: [...own.filter((r) => r.featured), ...plugins, ...own.filter((r) => !r.featured)],
			count: catalog.length,
			unit: 'plugins',
			catalog: catalog.length > PLUGIN_ROW_CAP ? { href: CATALOG_URL, count: catalog.length } : undefined,
		};
	});
}

let groups: Promise<ProjectGroup[]> | undefined;

// The three project groups in page order. Throws, failing the build, when plugins.json cannot
// be fetched or does not match its contract, or when projects.yaml is incomplete.
export function getProjectGroups(): Promise<ProjectGroup[]> {
	groups ??= loadGroups();
	return groups;
}
