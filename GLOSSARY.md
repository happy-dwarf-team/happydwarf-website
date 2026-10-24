# Happy Dwarf Team website

The organization site at `happydwarf.dev`: a hub that points to the team's projects, and the
owner of the infrastructure the team's sites share.

## The site

**Hub**:
The organization site; it points to projects and does not describe them in depth.
_Avoid_: portal, landing page, homepage (for the site as a whole)

**Launch**:
The moment a site's final domain serves it: the Pages custom domain is set, its DNS records
exist, and the HTTPS certificate is issued and checked.
_Avoid_: release (release-please's word), go-live

**Preview deployment**:
The site as deployed from `main` to `happy-dwarf-team.github.io/<repo>/` before launch.
_Avoid_: staging, beta

**Site name**:
The name after `|` in page titles and in `og:site_name`: `Happy Dwarf Team` here, `Etch` on the
Etch site.
_Avoid_: brand name, title

## Projects

**Project list**:
The hub's team projects (`src/data/projects.yaml`) plus the team's plugins from the Anvil
catalog; each has exactly one source.
_Avoid_: project registry, directory

**Project group**:
One of the three sections of projects on the hub: Anvil ecosystem, Tools for mod authors,
Anbennar mods.
_Avoid_: category, section (for a group)

**Ledger band**:
The two-column shape of every project group, About and Get involved: a sticky rail with heading,
intro and count beside ruled rows.
_Avoid_: card grid, panel

**Project row**:
One project on the hub: icon, name, status badge, summary and at most two links.
_Avoid_: card, tile, entry

**Featured row**:
Anvil's row, the only boxed row and the only one with a filled button.
_Avoid_: hero card, highlight

**Primary destination**:
Where a row's name and main link go: the project's own site, else its Steam Workshop item, else
its repository.
_Avoid_: main link, homepage

**Status badge**:
The label on a project row: the latest release version, or `Preview`, `Archived` or `Template`.
_Avoid_: version tag, label

**Catalog link**:
The "All N plugins in the Anvil catalog" link that closes the Anvil group when the catalog has
more than five plugins.
_Avoid_: see more, view all

## Plugins

**Anvil catalog**:
The plugin list in `anvil-website` (`src/content/plugins/`); the only source of plugins.
_Avoid_: plugin registry, plugin store

**`plugins.json`**:
The published contract of the Anvil catalog at `anvil.happydwarf.dev/plugins.json`, read by the
hub at build time.
_Avoid_: plugin feed, plugin API

**Tagline**:
A plugin's one-sentence description for the hub, as distinct from the catalog's two-sentence
`summary`.
_Avoid_: blurb, short summary

## Design

**Family**:
The shared dark-forge design system of the organization, Anvil and Etch sites.
_Avoid_: theme, design system (for this one)

**Family tokens**:
Every family design token except the site accent; their source is `forge-family.css` in this
repository.
_Avoid_: shared theme, base tokens

**Site accent**:
One site's four accent tokens (`--forge-accent`, `-strong`, `-soft`, `--forge-on-accent`):
forge orange here and on Anvil, verdigris on Etch.
_Avoid_: brand colour, primary colour

**Signature effect**:
Motion unique to one site, such as Anvil's sparks; never shared.
_Avoid_: animation, effect

**Family marker**:
The small team mark with "A Happy Dwarf project" in a product site's footer, linking to the hub.
_Avoid_: badge, made-by line

**Favicon tile**:
The dark rounded square (`#16171a`, rx 6 on the 32 grid) every favicon of the two new sites sits
on.
_Avoid_: icon background

**Social preview image**:
A site's `og.png` (1200 × 630), one per site.
_Avoid_: OG card, share image

## Disclaimer

**Disclaimer**:
The footer block on every page: the non-affiliation line and the trademark line on every site,
plus the game-art line where EU4 art is shown.
_Avoid_: legal notice, legal

**Non-affiliation line**:
The line saying a project is unofficial and not affiliated with or endorsed by Paradox
Interactive; the only line READMEs and the organization profile carry.
_Avoid_: disclaimer (for this one line)

**Trademark line**:
"Europa Universalis and Paradox Interactive are trademarks or registered trademarks of Paradox
Interactive AB."
_Avoid_: copyright line

**Game-art line**:
The line crediting game interface art in screenshots and recordings to Paradox Interactive AB;
only on sites that show EU4 art.
_Avoid_: art credit

## Media

**Media bucket**:
The `happydwarf-media` R2 bucket behind `media.happydwarf.dev`, one prefix per project slug.
_Avoid_: CDN, storage

**Media manifest**:
The file in a site repository that maps scenes to media URLs; the only place a site learns
bucket keys from.
_Avoid_: media index, media list

**Takedown**:
Deliberate removal of published media from the bucket and the site; the only reason objects are
ever deleted.
_Avoid_: cleanup, prune
