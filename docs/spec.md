# happydwarf.dev specification

What the Happy Dwarf Team's organization site (the *hub*) is, what it shows, how it is built
and the shared infrastructure it owns. Design rules are in [DESIGN.md](../DESIGN.md) and terms
in [GLOSSARY.md](../GLOSSARY.md). Change a rule here first, then in code.

Every rule comes from the wayfinder map
[happy-dwarf-team/.github#4](https://github.com/happy-dwarf-team/.github/issues/4) and the
resolutions of its tickets, linked where a rule is stated. Prototypes and research notes on the
`prototype/*` and `research/*` branches of `.github` are references only: where they differ from
this file, this file wins. Copy marked *draft* is final wording to be edited at build time
within the rule it belongs to.

The Etch site ([etch-website](https://github.com/happy-dwarf-team/etch-website),
`etch.happydwarf.dev`) has its own specification and refers here for the shared parts
(sections 7 and 8).

## 1. Purpose and scope

- **What:** the organization's hub at **`https://happydwarf.dev/`**: who we are, what we make,
  and a way to every project. It points to projects; it does not describe them in depth
  ([#9](https://github.com/happy-dwarf-team/.github/issues/9)).
- **Audience:** players, mod authors and plugin authors, named equally.
- **Main action:** "go to the project". There is no download button on the hub.
- **Language:** English only.
- **Not on the hub:** a blog, newsletter, changelog, per-project pages, member names or photos,
  measurements (they belong on the project sites, labelled with their source), contact by
  email, Discord, form or Discussions.
- **Privacy:** no analytics, no cookies, no consent banner, no third-party requests from the
  page. Fonts are self-hosted.
- **Launch order:** the hub launches only after the Etch site has launched, because Etch's row
  links to `etch.happydwarf.dev` ([#12](https://github.com/happy-dwarf-team/.github/issues/12)).
  *Launch* is defined in section 2.4.

## 2. Stack and repository

### 2.1 Stack

- **Astro, static output, without Starlight** (the hub is one page plus 404), on GitHub Pages
  through a workflow, like [`anvil-website`](https://github.com/happy-dwarf-team/anvil-website).
- No UI framework, no Tailwind and **no client-side JavaScript** on the hub
  ([#12](https://github.com/happy-dwarf-team/.github/issues/12)).
- Node.js 22 or newer, npm, `sharp` for the image scripts. Fonts through Fontsource
  (IBM Plex Sans Variable, JetBrains Mono Variable).
- `site` and `base` come from `SITE_URL` / `SITE_BASE` as in `anvil-website`'s
  `astro.config.mjs`; internal links in components go through a `url()` helper
  (`src/lib/url.ts`) so the site works both at the custom domain and under
  `/happydwarf-website/`. `trailingSlash: 'always'`.

### 2.2 Commands and checks

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server on `http://localhost:4321` |
| `npm run check` | `astro check`: types and the `projects` collection schema |
| `npm run build` | static site in `dist/`; fetches `plugins.json` and release data (section 4) |
| `npm run check:links` | every internal link and `#anchor` in `dist/` resolves |
| `npm run check:a11y` | axe-core on every page in `dist/` |

The link and axe scripts are copied from `anvil-website`'s `scripts/check-links.mjs` and
`scripts/check-a11y.mjs`.

### 2.3 Workflows, ruleset and repository files

- **`deploy`** workflow, modelled on `anvil-website`'s: runs on `push` to `main`,
  `pull_request`, `workflow_dispatch` and a **daily `schedule`**; **no `repository_dispatch`**
  ([#9](https://github.com/happy-dwarf-team/.github/issues/9),
  [#10](https://github.com/happy-dwarf-team/.github/issues/10)). Its `build` job runs
  `npm ci`, `check`, `build` (with `GITHUB_TOKEN` for the API), `check:links` and `check:a11y`;
  the `deploy` job publishes `dist/` to Pages except on pull requests. Repository variable
  `CUSTOM_DOMAIN` switches `SITE_URL`/`SITE_BASE` from the github.io preview to the custom
  domain, as in `anvil-website`. Actions are pinned by commit SHA.
- **`pr-title`** workflow with the `conventional-title` job, copied from `anvil-website`.
- **Pages source:** "GitHub Actions" (`build_type: workflow`).
- **Ruleset `main`**, as `anvil-website`'s: no deletion, no force push, linear history, pull
  request required with squash only, required checks `build` and `conventional-title`. It is
  added only after both workflows exist on `main`, because a ruleset that requires missing
  checks blocks every PR ([#26](https://github.com/happy-dwarf-team/.github/issues/26)).
- **`AGENTS.md`** (with `CLAUDE.md` containing `@AGENTS.md`) and **`SECURITY.md`** modelled on
  `anvil-website`'s, adapted to a site with no client JavaScript and no downloads.

### 2.4 Preview and launch

- Before launch, every push to `main` deploys to
  `https://happy-dwarf-team.github.io/happydwarf-website/`. That is a **preview**, not a launch.
- **Launch:** the final domain serves the site: the Pages custom domain is set, the DNS records
  of section 7.1 exist, and the HTTPS certificate is issued and checked
  ([#26](https://github.com/happy-dwarf-team/.github/issues/26)). Steps in section 7.6.

## 3. Pages

The hub has **one page `/` plus `404`**
([#9](https://github.com/happy-dwarf-team/.github/issues/9),
[#12](https://github.com/happy-dwarf-team/.github/issues/12)). The layout ("Ledger") and
components are in [DESIGN.md](../DESIGN.md); prototype for reference:
[`prototype/org-home`](https://github.com/happy-dwarf-team/.github/tree/prototype/org-home/prototype/org-home)
(variant B).

### 3.1 Sections of `/`, in order

1. **Header** (sticky): team logo at 32 px with the "HAPPY DWARF" wordmark linking to `/`;
   anchors *Projects · About · Get involved*; a GitHub icon link to the organization with a
   screen-reader label; a "Skip to content" link. On phones the three anchors stay in one row;
   there is no hamburger menu.
2. **Hero**: eyebrow "Happy Dwarf Team"; h1 "Open-source tools and mods for Europa Universalis
   IV."; lead "They work beside the game, not inside its files."; three static chips
   *Players · Mod authors · Plugin authors* (labels, not links); the only action,
   "See the projects ↓", an anchor to the first group. The full team logo sits beside the text.
   No numbers and no download button.
3. **Project groups**, in this order: **Anvil ecosystem → Tools for mod authors → Anbennar
   mods**, each a Ledger band (section 4). No filters and no tabs.
4. **About**: one paragraph and three principles (section 3.3).
5. **Get involved**: four paths and a closing line (section 3.3).
6. **Footer** (section 6).

### 3.2 `404`

A large mono "404" in the accent; h1 "This tunnel was never dug."; one line (draft: "The page
you followed does not exist. The projects are all on the home page."); a filled "Back to
happydwarf.dev" button; the three groups as anchor links to `/`. Same header and footer as `/`.

### 3.3 Copy outline

All copy is a draft, edited at build time within these rules. Tone follows the team's
[`docs/workshop-pages.md`](https://github.com/happy-dwarf-team/.github/blob/main/docs/workshop-pages.md):
plain first, joke second, at most one dwarven touch per section.

**Group intros:**

| Group | Intro (draft) |
| --- | --- |
| Anvil ecosystem | Anvil loads native plugins into the game; the plugins do what mods can't. |
| Tools for mod authors | For people who make mods: see your interface as you write it, publish with one command. |
| Anbennar mods | Interface mods for Anbennar, the fantasy total conversion of EU4. Anbennar is made by its own team; these mods need it installed. |

The Anbennar intro is where independence from the Anbennar team is stated; the footer
disclaimer covers Paradox only ([#14](https://github.com/happy-dwarf-team/.github/issues/14)).

**About** (draft): "Happy Dwarf is a small volunteer team. We name our tools after the forge
because we like work that is made slowly and meant to last, and because a dwarf without a hammer
is just a short man with a beard." Then three principles, the name on the left and one line on
the right:

- **Never touch the game's files:** no changes to `eu4.exe`, and Steam file checks keep working.
- **Open source, MIT, free:** no payments and no data collection.
- **Claims we can back up:** measurements are labelled with their source; unverified things are
  marked as unverified.

About carries no legal notice ([#14](https://github.com/happy-dwarf-team/.github/issues/14)).

**Get involved**, four paths with one link each, then "Volunteer projects, answers can take a
few days.":

| Question | Link(s) |
| --- | --- |
| Need help installing? | the [install guide](https://anvil.happydwarf.dev/docs/install/) on `anvil.happydwarf.dev`, then [`SUPPORT.md`](https://github.com/happy-dwarf-team/.github/blob/main/SUPPORT.md) |
| Found a bug or have an idea? | the issues of the project it concerns, through the organization's [repository list](https://github.com/orgs/happy-dwarf-team/repositories) |
| Want to contribute? | [`CONTRIBUTING.md`](https://github.com/happy-dwarf-team/.github/blob/main/CONTRIBUTING.md); plugin authors start from the Plugin template |
| Security problem? | private reporting as in [`SECURITY.md`](https://github.com/happy-dwarf-team/.github/blob/main/SECURITY.md) |

## 4. Project list

The *project list* is the hub's team projects plus the team's plugins from the Anvil catalog.
Each has exactly one source; neither is copied anywhere else
([#10](https://github.com/happy-dwarf-team/.github/issues/10)).

### 4.1 Team projects: `src/data/projects.yaml`

- One YAML file, loaded as an Astro content collection with the `file()` loader and a zod schema
  in `src/content.config.ts`, validated by `npm run check`.
- It holds every team project **except the plugins**: Anvil, the Plugin template, Etch,
  paradox-workshop-publish and the Anbennar mods.
- Fields:

  | Field | Type | Meaning |
  | --- | --- | --- |
  | `id` | slug | the project's slug; also the media bucket prefix (section 7.2) and the icon file name |
  | `name` | string | as shown |
  | `group` | `anvil-ecosystem` \| `mod-tools` \| `anbennar` | its project group |
  | `order` | number | order inside the group |
  | `summary` | string | one sentence in a user's words, no jargon |
  | `status` | `released` \| `preview` \| `template` \| `archived` | drives the status badge (section 4.3) |
  | `primary` | `{ href, label }` | the primary destination and its link text |
  | `repo` | GitHub URL | source of the release version and of "Source on GitHub" |
  | `workshop` | string, optional | Steam Workshop item id; when set, `primary.href` is that item's page |
  | `featured` | boolean, default false | only Anvil |
  | `accent` | colour, optional | the project's site accent for its icon; only projects with their own site accent (today Etch, `#4fc9a8`) |

- Icons: `src/assets/projects/<id>.svg`, in the family icon grammar
  ([DESIGN.md](../DESIGN.md#icon-grammar)).
- **Primary destination** rule: own site › Steam Workshop › repository.
- **Not in the file:** the site repositories (`anvil-website`, `etch-website`, this one; "Source
  of this site" is in the footer), private repositories, and the Dwarven Knowledge patch (its
  repository holds only `LICENSE` and `README.md`; it comes back as one entry when it ships).

Initial entries (summaries and labels are drafts):

| `id` | Group | Status | Primary destination (label) | Source link | Summary |
| --- | --- | --- | --- | --- | --- |
| `anvil` | Anvil ecosystem, featured | released | `https://anvil.happydwarf.dev/` ("Go to anvil.happydwarf.dev") | yes | Loads native plugins into Europa Universalis IV without changing `eu4.exe`, so Steam updates and file checks keep working. |
| `anvil-plugin-template` | Anvil ecosystem | template | the repository ("Use this template") | no | Start your own Anvil plugin with build, CI checks and releases ready to go. |
| `etch` | Tools for mod authors | released | `https://etch.happydwarf.dev/` ("etch.happydwarf.dev") | yes | A VS Code extension that previews EU4 interface mods: edit a `.gui` or `.gfx` file and see the window as the game draws it. |
| `paradox-workshop-publish` | Tools for mod authors | released | the repository ("Read the README") | no | Publish Paradox game mods to the Steam Workshop from GitHub Actions or your own PC, driven by the mod descriptor. |
| `widescreen-loading-screens` | Anbennar mods | released | Workshop item `3686212690` ("Steam Workshop") | yes | Anbennar loading screens that fit widescreen monitors. |
| `proper-2k-ui` | Anbennar mods, last | archived | Workshop item `3681465653` ("Steam Workshop") | yes | A proper 2K interface for Anbennar. No longer maintained. |

Etch's primary destination is its site, not the VS Code Marketplace; this is why the hub
launches after the Etch site ([#12](https://github.com/happy-dwarf-team/.github/issues/12)).

### 4.2 Plugins: `plugins.json` from the Anvil catalog

- Plugins live only in the **Anvil catalog** (`anvil-website`, `src/content/plugins/*.md`). The
  hub reads them at build time from **`https://anvil.happydwarf.dev/plugins.json`**, whose
  contract is in section 7.7.
- **Fetch failure fails the build:** if `plugins.json` cannot be fetched or does not pass the
  hub's zod schema, `npm run build` exits non-zero. Pages keeps serving the last good
  deployment and the daily cron retries. There is no fallback copy in this repository.
- **Which plugins get rows:** only plugins whose `repo` is in `happy-dwarf-team`, and not those
  with status `planned`. Their row uses `name`, `tagline` (as the summary), `url` (primary
  destination, label "Plugin page"), `repo` ("Source on GitHub") and `icon` (inlined SVG with
  `currentColor` set to family orange, as `anvil-website`'s `PluginIcon.astro` does). The hub
  keeps no copies of plugin icons.
- The hub lists the team's projects, so it does not show rows for other authors' plugins; the
  catalog link (section 4.4) covers them.

### 4.3 Status badge

Every row shows one status badge, decided in this order
([#9](https://github.com/happy-dwarf-team/.github/issues/9),
[#10](https://github.com/happy-dwarf-team/.github/issues/10),
[#12](https://github.com/happy-dwarf-team/.github/issues/12)):

1. `archived` → "Archived", even if the project has releases. The row's name and summary are
   muted, and it stays last in its group.
2. `template` → "Template".
3. `released` (team project) or a catalog plugin with status `released` → the version of the
   latest GitHub release (`v1.3.0`), fetched at build time from the GitHub API with
   `GITHUB_TOKEN`. A plugin with no release yet shows "Preview".
4. `preview`, or a catalog plugin with status `in-development` → "Preview".

The badge never says "No release yet". **If the release data cannot be fetched** (network,
rate limit, API error), the build continues: that row shows no badge and the build log carries
a warning, as `anvil-website`'s `release.ts` does. The daily build corrects it. (Decided with
@s-tyda while writing this spec; the map left it open.)

The row has no stars, no update date and no technology tags.

### 4.4 Anvil group cap and catalog link

- The Anvil group shows **Anvil** (the featured row), then **at most five plugin rows by
  `order`**, then the **Plugin template, always shown and always last**
  ([#12](https://github.com/happy-dwarf-team/.github/issues/12)).
- The group's rail count reads "N plugins", and N counts **every** catalog entry, third-party
  and `planned` included ([#10](https://github.com/happy-dwarf-team/.github/issues/10)).
- When the catalog has more than five plugins, a dashed **"All N plugins in the Anvil catalog →"**
  link to `https://anvil.happydwarf.dev/plugins/` closes the group's rows, with the same N. With
  five or fewer it is not shown.
- The other groups' rails count their rows: "N projects".

### 4.5 Freshness

The site rebuilds on push, `workflow_dispatch` and once a day. A version or a new plugin can lag
by up to a day; no project repository needs a token for the hub. Add a dispatch only if that lag
starts to matter ([#9](https://github.com/happy-dwarf-team/.github/issues/9)).

## 5. Head, social preview and icons

From [#18](https://github.com/happy-dwarf-team/.github/issues/18).

### 5.1 Titles and description

- Pattern `<page title> | Happy Dwarf Team`. The *site name* is `Happy Dwarf Team`.
  `og:title` is the page title without the suffix; `og:site_name` is the site name.
- `/`: `Tools and mods for Europa Universalis IV | Happy Dwarf Team`.
- `404`: `Page not found | Happy Dwarf Team`.
- One meta description for the site, also `og:description` and used by 404 (draft, under ~155
  characters, no version or status): "Free, open-source tools and mods for Europa Universalis IV:
  the Anvil plugin loader and its plugins, tools for mod authors, and Anbennar mods."

### 5.2 `Head.astro`

One component holds title, description, canonical, Open Graph and Twitter tags, icons,
`theme-color` `#16171a`, the sitemap link and JSON-LD.

- **Canonical** and `og:url`: absolute, with a trailing slash. The 404 page has neither: it
  answers every missing URL and has no address of its own.
- **Open Graph and Twitter, on `/` and 404 alike:** `og:image` (absolute URL),
  `og:image:width` 1200, `og:image:height` 630, `og:image:alt` "Happy Dwarf Team, open-source
  tools and mods for Europa Universalis IV", `og:type` `website`, `og:locale` `en`,
  `twitter:card` `summary_large_image`, `twitter:image`. No `twitter:site`.
- **Sitemap:** `@astrojs/sitemap`, 404 left out; `<link rel="sitemap" href="/sitemap-index.xml">`.
- **`robots.txt`:** as `anvil-website`'s `src/pages/robots.txt.ts`: `Allow: /` and an absolute
  `Sitemap:` line.
- **404 has no `noindex`**: GitHub Pages answers it with status 404.
- **JSON-LD `Organization`:** `name` "Happy Dwarf Team", `url`, `logo` (absolute URL of
  `public/logo.png`, the full team logo at 512 × 512), `sameAs` the GitHub organization.
- No Google Search Console or Bing Webmaster Tools at the start.

### 5.3 Social preview image

- One static, committed `public/og.png` (1200 × 630), rendered by `scripts/og-image.mjs` with
  `sharp` like `anvil-website`'s, re-run when the mark or wording changes and reviewed in its PR.
- Composition: `#16171a` background; the full team logo on the left (its gradients are the
  allowed exception); "HAPPY DWARF" in mono; two lines "Tools and mods for / Europa Universalis
  IV" in `--forge-text-muted`; `happydwarf.dev` in forge orange `#f5922a`; an 8 px orange bar
  along the bottom.
- No game art, no EU4 or Paradox logo, no version and no status.

### 5.4 Favicons and logo

- Three files in `public/`, rendered by one script from the mark's source SVG and committed:
  `favicon.svg`, `favicon.ico` (32 × 32, a `sharp` PNG wrapped in an ICO header by the script,
  no extra package) and `apple-touch-icon.png` (180 × 180, opaque). The same script renders
  `public/logo.png` (512 × 512) for JSON-LD.
- Links: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
  `<link rel="icon" href="/favicon.ico" sizes="32x32">`, `apple-touch-icon`. No web manifest
  and no 192/512 icons.
- The favicon glyph (helmet and beard, drafted in the `prototype/org-home` prototype) sits on
  the **favicon tile**: `#16171a`, rx 6 on the 32 grid. **Acceptance:** legible at 16 px on its
  tile, checked in a light and a dark tab strip.

## 6. Footer and disclaimer

From [#9](https://github.com/happy-dwarf-team/.github/issues/9),
[#12](https://github.com/happy-dwarf-team/.github/issues/12) and
[#14](https://github.com/happy-dwarf-team/.github/issues/14). The footer is on every page,
404 included, and holds:

- the favicon glyph and "Happy Dwarf Team · MIT licensed";
- "Source of this site" (this repository) and "GitHub organization";
- the **disclaimer** as its own paragraph in muted text, not joined to "MIT licensed". On the hub
  it has two lines (no game art is shown, so no game-art line):

  > Happy Dwarf Team projects are unofficial community projects, not affiliated with or endorsed
  > by Paradox Interactive. Europa Universalis and Paradox Interactive are trademarks or
  > registered trademarks of Paradox Interactive AB.

There is no legal page and no "Legal" link. Steam, VS Code and Open VSX are named descriptively
and their logos are not used, so the notice covers Paradox only.

## 7. Infrastructure

Shared parts of the `happydwarf.dev` zone, the media bucket and the organization profile. The
Etch site specification refers here for the `etch` record and the bucket.

### 7.1 DNS

Every web record of the `happydwarf.dev` zone and its proxy status
([#25](https://github.com/happy-dwarf-team/.github/issues/25), findings:
[`research/media-dns-setup.md`](https://github.com/happy-dwarf-team/.github/blob/research/media-dns-setup/research/media-dns-setup.md)):

| Name | Type | Target | Proxy | Owner |
| --- | --- | --- | --- | --- |
| `@` | A ×4 | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | DNS only | `happydwarf-website` |
| `@` | AAAA ×4 | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | DNS only | `happydwarf-website` |
| `www` | CNAME | `happy-dwarf-team.github.io` | DNS only | redirects to the apex (GitHub Pages) |
| `anvil` | CNAME | `happy-dwarf-team.github.io` | DNS only | `anvil-website` (exists) |
| `etch` | CNAME | `happy-dwarf-team.github.io` | DNS only | `etch-website` |
| `media` | CNAME (read-only) | R2 custom domain of `happydwarf-media` | **Proxied** | R2 |
| `_github-pages-challenge-happy-dwarf-team` | TXT | organization domain verification | n/a | never delete (exists) |

- GitHub Pages records are **DNS only**, or GitHub cannot issue their certificates.
- **`media` is the one intentional exception:** R2 creates it as a read-only proxied record and
  serves the bucket through Cloudflare's cache; it cannot be made DNS only.
- The apex uses GitHub's A/AAAA list rather than a flattened apex CNAME.
- `www` reaches the apex through **GitHub Pages' own redirect** (the apex is the configured
  custom domain). A Cloudflare redirect rule cannot work on DNS-only records.
- No wildcard record, ever. Any future CAA record must include `letsencrypt.org`.
- Email Routing records (MX, SPF, DMARC, DKIM) are not part of the sites; leave them alone.
- The organization's Pages domain verification is already done (the TXT record above); it covers
  the apex and its immediate subdomains.
- State when this was written (read through public DNS, 2026-10-24): apex has only Email Routing
  records, `anvil` exists, `www`, `etch` and `media` do not; nothing collides.

### 7.2 Media bucket

From [#8](https://github.com/happy-dwarf-team/.github/issues/8) and
[#17](https://github.com/happy-dwarf-team/.github/issues/17).

- **One R2 bucket, `happydwarf-media`**, behind `https://media.happydwarf.dev/`, for all public
  media of the organization. Standard storage class, default jurisdiction, automatic location
  hint.
- **One prefix per project slug** from `projects.yaml` (`etch/`, later `anvil/`, `happydwarf/`
  for this site). A prefix appears with its first object; at launch only `etch/` exists.
- **Keys** `<project>/v<version>/<scene>.<hash8>.<ext>`, e.g.
  `etch/v0.4.0/hero.3f9a2c1d.webm`: `v<version>` is the release the media were captured for,
  `<hash8>` the first 8 hex characters of the file's SHA-256, so a key is never overwritten.
- **Uploads are conditional** (`If-None-Match: *`) with `Content-Type` and
  `Cache-Control: public, max-age=31536000, immutable`.
- Only videos go to the bucket. Posters, stills and the media manifest live in the site
  repository; a site learns keys only from its media manifest.
- **Retention:** old versions are kept; no lifecycle expiry and no prune script. The only
  lifecycle rule is R2's default abort of incomplete multipart uploads after 7 days. Revisit when
  the bucket passes 1 GB.
- **Takedown** is the only reason to delete: delete the affected objects (or a whole
  `<project>/v<version>/` folder), purge the cache for `media.happydwarf.dev`, and remove them
  from the site's media manifest in the same change.
- No game files ever enter the bucket.

### 7.3 Setting up `media.happydwarf.dev`

The checklist from [#25](https://github.com/happy-dwarf-team/.github/issues/25), in order. Steps
2–7 go through the Cloudflare API MCP if its OAuth grant carries R2 and zone-settings scopes,
otherwise through Wrangler (`wrangler login`); never a token in a file or chat.

1. **Enable R2** on the Happy Dwarf account: **dashboard only**, done by @s-tyda (the API refuses
   until then).
2. **Create the bucket** `happydwarf-media`, Standard, no location hint, no jurisdiction
   (`wrangler r2 bucket create happydwarf-media --storage-class Standard`). Check that the only
   lifecycle rule is the default multipart abort.
3. **Connect `media.happydwarf.dev` with minimum TLS 1.2**
   (`wrangler r2 bucket domain add happydwarf-media --domain media.happydwarf.dev --zone-id <ZONE_ID> --min-tls 1.2`,
   or the API's `minTLS: "1.2"`). R2's default is 1.0 and the zone's Minimum TLS setting does not
   apply. R2 creates `media` as a read-only proxied record.
4. **`r2.dev` stays disabled**: off by default on a new bucket, so only check it
   (`wrangler r2 bucket dev-url get happydwarf-media`).
5. **CORS**, the whole policy (the API replaces all rules):

   ```json
   [
     {
       "AllowedOrigins": ["https://etch.happydwarf.dev", "https://happydwarf.dev", "http://localhost:4321"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["Range"],
       "ExposeHeaders": ["Content-Range", "Accept-Ranges", "ETag"],
       "MaxAgeSeconds": 86400
     }
   ]
   ```

   No `www` origin (it only redirects). Purge the hostname's cache after any CORS change.
6. **Smart Tiered Cache** on the zone (available on every plan): dashboard or
   `PATCH /zones/{zone_id}/cache/tiered_cache_smart_topology_enable` with `{"value": "on"}`.
7. **No cache or WAF rule**: WebM and MP4 are cached by default and the origin `Cache-Control`
   is honoured. Revisit only if anything other than video is ever put in the bucket.
8. **Upload token** (section 7.4).

### 7.4 Upload token

From [#24](https://github.com/happy-dwarf-team/.github/issues/24):

- One **Account API token** created in the dashboard (R2 → Manage API tokens → Create Account
  API token), named **`happydwarf-media-upload`**, permission **Object Read & Write**, scoped to
  the bucket `happydwarf-media` only (R2 cannot scope a prefix), **expiry one year**.
- The S3 key pair lives only in the maintainer's Windows **user environment variables**
  `HAPPYDWARF_MEDIA_ACCESS_KEY_ID` and `HAPPYDWARF_MEDIA_SECRET_ACCESS_KEY`, set by the
  maintainer. Never in chat, a file, a repository, a `.env` or CI. Not `AWS_*`.
- **Rotate** at expiry, on a maintainer change and on any suspicion of a leak: create the new
  token, then revoke the old one at once.
- The account ID, bucket name and endpoint (`https://<account-id>.r2.cloudflarestorage.com`)
  are not secrets.

### 7.5 Verification

After the first real upload (done by the Etch media pipeline, see the Etch site
specification), with `U` an object URL
([#25](https://github.com/happy-dwarf-team/.github/issues/25)):

- Setup state: the domain is enabled with min TLS 1.2, `r2.dev` is disabled, CORS lists the
  policy above, Smart Tiered Cache is on; `media` resolves to Cloudflare addresses.
- `curl --range 0-99 "$U"` returns `206` with `content-range: bytes 0-99/<size>`.
- A second request from the same machine returns `cf-cache-status: HIT`.
- `Content-Type` and `Cache-Control: public, max-age=31536000, immutable` come back as uploaded.
- CORS headers appear only with an allowed `Origin`, checked **on a cache hit first filled by a
  request without `Origin`**; a preflight with `Range` succeeds.
- A TLS 1.1 handshake is refused by the server; TLS 1.2 succeeds.
- Safari on iOS plays the loop inline (no fullscreen), loops, and shows `206` responses.

Open checks from #25, each owned by a build issue:

1. Does a cache hit filled without `Origin` still return CORS headers? If not, decide on
   `crossorigin` or a cache-key rule. (Etch's first media publication.)
2. Does GitHub's certificate for the apex also cover `www`? Without it the HTTPS redirect on
   `.dev` (HSTS-preloaded) fails. (Hub launch, section 7.6.)
3. Does the Cloudflare API MCP's OAuth grant include R2 and zone-settings scopes? If not, steps
   2–7 go through Wrangler. (Bucket setup.)
4. Does enabling R2 require a payment method on the free tier? (Bucket setup, done by
   @s-tyda.)

### 7.6 Launching `happydwarf.dev`

In this order, only after the Etch site has launched:

1. The site has deployed to its github.io preview from `main` at least once.
2. **Set the custom domain `happydwarf.dev`** in the repository's Pages settings **before adding
   DNS** (`PUT /repos/happy-dwarf-team/happydwarf-website/pages` with `{"cname": "happydwarf.dev"}`)
   and set the repository variable `CUSTOM_DOMAIN`. A custom workflow ignores any `CNAME` file.
3. Add the apex A/AAAA and the `www` CNAME of section 7.1, **DNS only**.
4. Wait for the certificate, then **Enforce HTTPS**.
5. Check: `Resolve-DnsName` shows GitHub's addresses for the apex and the CNAME for `www`;
   `gh api repos/happy-dwarf-team/happydwarf-website/pages` shows `protected_domain_state`
   `verified`, `https_enforced` true and the certificate approved;
   `https://www.happydwarf.dev/` answers `301` to `https://happydwarf.dev/`; the certificate's
   domains include `www.happydwarf.dev` (open check 2).
6. The same day: the organization profile rewrite and README lines of section 7.8.

`.dev` is HSTS-preloaded as a whole TLD, so until the certificate is issued the site does not
load at all; plan the DNS change for a moment when a short gap does not matter.

### 7.7 `plugins.json` contract

From [#10](https://github.com/happy-dwarf-team/.github/issues/10). Published by `anvil-website`
at **`https://anvil.happydwarf.dev/plugins.json`**, generated at build from the Anvil catalog,
and read by the hub at build time (section 4.2).

```json
{
  "schemaVersion": 1,
  "plugins": [
    {
      "id": "bellows",
      "name": "Bellows",
      "tagline": "Makes the game start faster, without changing game files or how it plays.",
      "repo": "https://github.com/happy-dwarf-team/bellows",
      "status": "released",
      "order": 1,
      "url": "https://anvil.happydwarf.dev/plugins/bellows/",
      "icon": "<svg viewBox=\"0 0 32 32\" …>…</svg>"
    }
  ]
}
```

- **Every catalog entry** is listed, third-party and `planned` included.
- `id`: the catalog file name (the plugin page slug). `name`, `repo`, `status`
  (`planned` | `in-development` | `released`) and `order` as in the catalog frontmatter.
- **`tagline`**: a new, **required** one-sentence field in the catalog frontmatter, written the
  way a user would say it. The catalog's two-sentence `summary` stays as it is. The first values
  are the drafts below.
- `url`: the absolute URL of the plugin's catalog page, with a trailing slash.
- `icon`: the SVG markup of `src/assets/plugins/<id>.svg`, or `null` for a plugin without an
  icon file. The hub sets `currentColor`.
- `schemaVersion` changes only on a breaking change. Adding a field is not breaking, and the hub
  ignores fields it does not know.

| Plugin | Tagline (draft) |
| --- | --- |
| Bellows | Makes the game start faster, without changing game files or how it plays. |
| Tongs | Lets scripts and agents control a running game: read its state, take screenshots, use keyboard and mouse. |

### 7.8 Organization profile and READMEs

From [#10](https://github.com/happy-dwarf-team/.github/issues/10) and
[#14](https://github.com/happy-dwarf-team/.github/issues/14). Done **on the day the hub
launches**; until then the current profile stays.

- **Profile** (`.github/profile/README.md`) **lists no projects**, so there is nothing to
  generate or keep in sync. New content: a short "who we are" paragraph; one sentence on Anvil
  with a link to `anvil.happydwarf.dev`; a clear "All projects: happydwarf.dev" link; a "Get
  involved" line (issues, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`); and the closing
  `<sub>`: *Unofficial community projects, not affiliated with or endorsed by Paradox
  Interactive. MIT licensed.* The tables and the Website and Dwarven Knowledge patch entries go.
- **Pinned repositories**, set by hand in the organization settings: `anvil`, `bellows`,
  `tongs`, `etch`, `paradox-workshop-publish`, `anvil-plugin-template`. No site repositories and
  no Anbennar mods. The pins are featured repositories, not a second project list.
- **README non-affiliation line** in the License section of `anvil`, `bellows`, `tongs`, `etch`,
  `anvil-plugin-template` and `paradox-workshop-publish`, with the project's name:
  *"<Project> is an unofficial community project, not affiliated with or endorsed by Paradox
  Interactive."* `anvil`, `bellows` and `tongs` have it without "or endorsed by" today; the
  other three have none. One small PR per repository. READMEs carry only this line, not the
  trademark or game-art lines.

## 8. Build order

The build issues that implement this specification, under the tracking issue in
`happy-dwarf-team/.github`:

| Issue | Sections | Blocked by |
| --- | --- | --- |
| A1 `anvil-website`: publish `plugins.json` with plugin taglines | 7.7 | — |
| H1 Scaffold the site | 2 | — |
| H2 Add the forge family tokens | [DESIGN.md](../DESIGN.md) | H1 |
| H3 Add head tags, icons and the social preview | 5 | H2 |
| H4 Load the project data | 4 | H1, A1 |
| H5 Build the home and 404 pages | 3, 4, 6 | H2, H4 |
| H6 Set up `media.happydwarf.dev` | 7.2–7.5 | — |
| H7 Launch `happydwarf.dev` | 7.1, 7.6, 7.8 | H3, H5, Etch site launch |

## 9. Not verified

- The copy has been seen on the built pages at 375 px and on desktop, but not by readers outside
  the team.
- Contrast values in [DESIGN.md](../DESIGN.md) are computed, not measured in a browser.
- The disclaimer wording is our interpretation of the Paradox User Agreement, not checked by a
  lawyer or Paradox; not legal advice.
- No bucket, record, token or certificate exists yet; the open checks of section 7.5 are
  answered in the build.
