# Happy Dwarf Team website: repository rules

- Static site for `happydwarf.dev`: Astro without Starlight, deployed to GitHub Pages. Keep
  it minimal: no UI framework, no Tailwind and no client-side JavaScript.
- [docs/spec.md](docs/spec.md) says what the site contains and how it is built,
  [DESIGN.md](DESIGN.md) how it looks and [GLOSSARY.md](GLOSSARY.md) what the terms mean.
  Change a rule there first, then in code.
- `DESIGN.md`'s "Family" section and `src/styles/forge-family.css` are the source of the
  design system shared with the Anvil and Etch sites; those sites copy them, never edit them.
- Use the `--forge-*` tokens instead of raw colours, keep text contrast at 4.5:1 or more,
  keep focus rings visible and respect `prefers-reduced-motion`.
- Internal links in components go through `url()` from `src/lib/url.ts`. The site must work
  both at the custom domain and under `/happydwarf-website/`.
- Content is English. Do not imply affiliation with Paradox Interactive. No analytics,
  cookies or third-party requests from the page; fonts are self-hosted.
- Check `npm run check`, `npm run build`, `npm run check:links` and `npm run check:a11y`
  before finishing a change; CI runs all four.
- The agent owns the pull request flow: it works on a branch with Conventional Commits,
  pushes it and opens the PR as a draft. Once ready (green CI, build checked, no blocking
  review findings, not put on hold by the user) it marks the PR ready and squash-merges
  it; GitHub does not allow auto-merge on a draft. Pull requests from other contributors
  get a review and a recommendation; the maintainer decides on merging them. Do not
  bypass CI or branch protection, and do not change repository settings beyond what
  auto-merge needs.

## Development

`npm run dev` starts the dev server on http://localhost:4321. Astro docs:
https://docs.astro.build.
