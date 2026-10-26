# Design

Design decisions for `happydwarf.dev`. Change them here first, then in code. What the site
contains is in [docs/spec.md](docs/spec.md); terms are in [GLOSSARY.md](GLOSSARY.md).

This file is also the **canonical source of the family**, the dark-forge design system shared
by the organization, Anvil and Etch sites
([#11](https://github.com/happy-dwarf-team/.github/issues/11)). The "Family" section and
`src/styles/forge-family.css` belong together; other sites copy the file, never edit it.

## Family

Based on [`anvil-website/DESIGN.md`](https://github.com/happy-dwarf-team/anvil-website/blob/main/DESIGN.md)
("dark forge") at `9e17a5f`.

### Family tokens

Everything except the site accent. Dark only; there is no light theme.

| Token | Value | Use | Contrast on `--forge-bg` |
| --- | --- | --- | --- |
| `--forge-bg` | `#16171a` | page background | — |
| `--forge-surface` | `#1f2024` | featured row, boxes, row hover | — |
| `--forge-surface-raised` | `#26272c` | raised controls | — |
| `--forge-border` | `#34363c` | borders, row rules (decorative) | 1.6:1 |
| `--forge-text` | `#e8e6e3` | body text | 14.4:1 |
| `--forge-text-muted` | `#a8a29e` | secondary text | 7.1:1 (6.5:1 on surface) |
| `--forge-radius` | `0.75rem` | corner radius | — |
| `--forge-ease` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | the one easing curve | — |
| `--forge-font-sans` | `'IBM Plex Sans Variable', system-ui, sans-serif` | body text | — |
| `--forge-font-mono` | `'JetBrains Mono Variable', ui-monospace, monospace` | headings, names, numbers, code | — |

Components use the `--forge-*` tokens, never raw hex values.

### Site accent

Each site sets four accent tokens under the **same names**, so components move between sites
unchanged. They are not in `forge-family.css`; each site defines them in its own stylesheet.

| Token | Forge orange (organization, Anvil) | Verdigris (Etch) |
| --- | --- | --- |
| `--forge-accent` | `#f5922a`: 7.7:1 on bg, 7.0:1 on surface | `#4fc9a8`: 8.8:1 on bg, 7.9:1 on surface |
| `--forge-accent-strong` | `#ffad55` (hover, links), > 7.7:1 | `#7fe0c5`: 11.4:1 / 10.4:1 |
| `--forge-accent-soft` | `#3d2611` | `#11332b`: accent on it 6.7:1, body text 11.0:1 |
| `--forge-on-accent` | `#16171a`, 7.7:1 on accent | `#16171a`, 8.8:1 on accent |

- **Forge orange is the family and organization colour.** It comes from the beard in the team
  logo (`#f78d1c` in `happy-dwarf.svg`). Anvil keeps it unchanged as the house product; the
  organization and Anvil sites are told apart by mark and wordmark, not colour.
- **Only projects with their own site get their own accent** (today Etch: verdigris, the patina
  of acid-etched copper). Tools, mods and plugins without a site use orange.
- White on orange is 2.3:1 and on verdigris 2.0:1, so labels on accent fills are always
  `--forge-on-accent`.

### Typography

- Body: **IBM Plex Sans Variable**, 16 px, line height 1.6. No body text below 13 px.
- Headings, wordmarks, names, numbers and code: **JetBrains Mono Variable**, tight tracking.
- Both self-hosted through Fontsource; no font CDN.

### Motion

- Hover and focus transitions of 150–220 ms with `--forge-ease`.
- A 2 px lift on hover is for card layouts; ledger rows do not lift.
- `prefers-reduced-motion: reduce` turns off every transition, animation and smooth scrolling.
  Nothing autoplays except a demo loop that follows its own rules (Etch).
- **Signature effects are not shared.** Sparks and the ember glow stay on Anvil's download
  button; the organization site has none, and Etch's motion is its demo loop.

### Icon grammar

- 32 × 32 viewBox, flat shapes, no gradients.
- Colour is `currentColor` (set to the accent by the component) plus at most one dark accent in
  `#16171a` at opacity .35.
- Readable at 16 px: no detail thinner than about 1.5 grid units.
- Inlined, decorative and `aria-hidden="true"`; the name next to it is the label.
- The full team logo is the one exception: it keeps its gradients.

### Accessibility checklist

- Text contrast at least 4.5:1 (every pair above passes AA).
- A visible focus ring on every focusable element: 2 px outline in the site's interaction
  accent, offset 2 px.
- Click targets at least 44 × 44 px for navigation, buttons and media controls.
- SVG icons only, no emoji; decorative icons are `aria-hidden`.
- No horizontal scroll at 375 px, on every page.
- Symbols that carry meaning are `aria-hidden` with `sr-only` text beside them; `aria-label` is
  not used on plain `span`s.
- CI runs axe-core on every page. It cannot see colours or sizes, so contrast and target sizes
  stay a manual check against the tables above.

### Marks

- **Organization:** the full team logo (`happy-dwarf.svg`) at 32 px and up (header, hero); a
  simplified glyph (helmet and beard) in the icon grammar for the favicon and small sizes;
  wordmark "HAPPY DWARF" in JetBrains Mono, uppercase. Sources: `src/assets/happy-dwarf.svg`
  (the full logo, as in `anvil-website`) and `src/assets/happy-dwarf-glyph.svg` (the glyph:
  horned helmet in orange under the dark accent, nose and beard in orange).
- **Etch:** the extension's glyph (window plus etching stylus, `packages/extension/media/icon.svg`
  in `etch`), recoloured to verdigris. Recolouring the extension's own Marketplace icon is a
  separate `etch` matter.
- **Favicon tile:** every favicon of the organization and Etch sites sits on a `#16171a` square
  with rx 6 on the 32 grid; without it, orange on a light tab strip is about 2.3:1 and verdigris
  about 1.9:1.
- **Family marker:** product sites carry the small team mark with "A Happy Dwarf project",
  linking to `https://happydwarf.dev/`, in their footer. Anvil gets it when it moves onto the
  family.

### Distribution

- `src/styles/forge-family.css` in this repository holds the family tokens, the font faces, the
  focus ring and the reduced-motion rule. It is the source. It imports the font faces from
  `@fontsource-variable/ibm-plex-sans` and `@fontsource-variable/jetbrains-mono`, so a site
  that copies it installs both packages. The site accent and the site's own base styles live in
  the site's own stylesheet (here `src/styles/site.css`).
- Other sites **copy it verbatim** with a header naming the source repository and commit, e.g.
  `/* Copied from happy-dwarf-team/happydwarf-website src/styles/forge-family.css at <commit>. Do not edit; change the source and copy again. */`
- Sync is manual when tokens change; there is no package and no CI check. Move to a package (or
  add a check) only when a fourth site appears, tokens change often, or copies drift.
- Moving `anvil-website` onto the family file is out of scope for now.

## This site

The "Ledger" layout chosen in [#12](https://github.com/happy-dwarf-team/.github/issues/12).
Prototype for reference only:
[`prototype/org-home/index.html`](https://github.com/happy-dwarf-team/.github/blob/prototype/org-home/prototype/org-home/index.html)
(variant B; [desktop](https://github.com/happy-dwarf-team/.github/blob/prototype/org-home/prototype/org-home/screenshots/ledger-desktop.png),
[capped at 11 plugins](https://github.com/happy-dwarf-team/.github/blob/prototype/org-home/prototype/org-home/screenshots/ledger-desktop-11-plugins-capped.png),
[phone at 375 px](https://github.com/happy-dwarf-team/.github/blob/prototype/org-home/prototype/org-home/screenshots/ledger-phone-375.png)).
The prototype loads fonts from Google Fonts and uses JavaScript only to switch variants; the site
does neither.

### Direction

- A calm hub, not a product page. One interaction accent per view: **forge orange**.
- A project with its own accent shows it **on its icon only** (Etch's icon is verdigris);
  borders, hover, the button and the focus ring stay orange.
- No signature effect, no carousels, no client-side JavaScript.

### Layout and breakpoints

- Content max width 72 rem. Side gutter 16 px below 640 px and 24 px from 640 px, plus
  `env(safe-area-inset-*)`.
- **560 px:** the header switches from two rows (logo and GitHub on top, the three anchors in one
  row below) to one row.
- **900 px:** the hero splits into text and logo, and every band becomes rail plus content.
  Below 900 px the rail stacks above its rows and the logo sits above the hero text.
- No horizontal scroll at 375 px.

### Header

Sticky. Team logo at 32 px and the "HAPPY DWARF" wordmark, anchors *Projects · About · Get
involved*, GitHub icon link with an `sr-only` label. No hamburger menu.

### Hero

Left-aligned: eyebrow, h1, lead, three static chips, the "See the projects ↓" link. From 900 px
the full logo (about 13 rem) sits to the right of the text.

### Ledger band

The shape of every project group, About and Get involved: a two-column band.

- **Rail** (17 rem from 900 px, sticky under the header): the band's heading, a one-sentence
  intro and a count ("N plugins", "N projects"); About and Get involved have no count.
- **Content:** the band's rows.

### Project row

- A grid of three areas: **icon** (32 px) | **name** (h3, mono, links to the primary
  destination) | **status badge** on the right. Under the name the **summary** (muted, at most
  about 44 rem wide), then the **links**: the primary destination in the accent with a "→",
  "Source on GitHub" in muted text when the primary destination is not the repository, and
  "Steam Workshop" in muted text for a plugin whose mod is on the Workshop.
- Rows are separated by 1 px `--forge-border` rules, with no box around them.
- On hover or keyboard focus inside the row (`:focus-within`), the row gets a faint
  `--forge-surface` background. Only the explicit links are clickable; there is no whole-row
  link.
- The status badge carries `sr-only` text ("Latest version ") before a version number.
- **Archived rows** show only the "Archived" badge, a muted name and summary, and stay last.

### Featured row

Anvil's row and the only boxed row: `--forge-surface` background, a border mixing 45 % accent
into `--forge-border`, `--forge-radius`, a 44 px icon, a larger name and the page's **only
filled button**, "Go to anvil.happydwarf.dev →".

### Catalog link

A dashed, full-width "All N plugins in the Anvil catalog →" link that closes the Anvil group's
rows when the catalog has more than five plugins (rules in [docs/spec.md](docs/spec.md#44-anvil-group-cap-and-catalog-link)).

### About and Get involved

- About: the paragraph, then the three principles as ruled rows, the principle's name in mono on
  the left and one line of muted text on the right.
- Get involved: the four paths as a grid of question plus link(s), then the closing line in
  muted text.

### 404 block

A large mono "404" in orange (`aria-hidden`), the h1, one line, the filled "Back to
happydwarf.dev" button (the page's only filled button) and the three groups as anchor links.

### Footer

The favicon glyph with "Happy Dwarf Team · MIT licensed", "Source of this site", "GitHub
organization", and the disclaimer as its own paragraph in muted text.

### Motion on this site

Family rules only: 160–180 ms with `--forge-ease` on nav hover, row background, button
background and a 3 px nudge of the "→" arrow on hover. Smooth scrolling for the anchor links.
Under reduced motion all of it is off.

### Rules

- One filled button per page (Anvil's on `/`, "Back to happydwarf.dev" on 404).
- Archived rows muted and last.
- The Anvil group shows at most five plugins plus the Plugin template, last.
- Etch's row links to `etch.happydwarf.dev`.
- No client-side JavaScript; fonts self-hosted.
- No EU4 or Paradox logos, key art or game screenshots anywhere on the hub, Open Graph image
  included.

## Content rules

- Measurements belong on project sites, labelled with their source; the hub shows none.
- Unverified claims say so.
- The disclaimer stays in the footer only.
- At most one dwarven touch per section; plain first, joke second.
