// Reads the latest release of a project from the GitHub API at build time, for its status
// badge (docs/spec.md, section 4.3). A failure never fails the build: the row shows no badge,
// the log carries a warning and the daily build corrects it.

const versions = new Map<string, Promise<string | null | undefined>>();

// The version of the latest release ("1.3.0"), null when the repository has no release yet,
// or undefined when the release data could not be fetched.
export function getLatestVersion(repoUrl: string): Promise<string | null | undefined> {
	const repo = new URL(repoUrl).pathname.replace(/^\/|\/$/g, '');
	let version = versions.get(repo);
	if (!version) {
		version = fetchLatestVersion(repo);
		versions.set(repo, version);
	}
	return version;
}

function githubHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

async function fetchLatestVersion(repo: string): Promise<string | null | undefined> {
	try {
		// The latest release that is neither a draft nor a prerelease.
		const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
			headers: githubHeaders(),
			signal: AbortSignal.timeout(30_000),
		});
		if (res.status === 404) return null;
		if (!res.ok) {
			console.warn(`[release] ${repo}: GitHub API returned ${res.status}; no status badge.`);
			return undefined;
		}
		const { tag_name } = (await res.json()) as { tag_name: string };
		return tag_name.replace(/^v/, '');
	} catch (error) {
		console.warn(`[release] ${repo}: ${String(error)}; no status badge.`);
		return undefined;
	}
}
