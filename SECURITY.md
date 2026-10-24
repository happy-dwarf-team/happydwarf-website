# Security policy

This repository builds the static website at [happydwarf.dev](https://happydwarf.dev). The
site runs no code for visitors and offers no downloads; it links to the project sites and
repositories. Please report security problems privately, not in public issues.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting:
[Report a vulnerability](https://github.com/happy-dwarf-team/happydwarf-website/security/advisories/new).
Include the page, what you found and what an attacker gains.

This is a volunteer project; reports are handled on a best-effort basis. We
will confirm the report, agree on a fix and a disclosure date with you, and
credit you in the advisory unless you prefer otherwise.

## In scope

- Links on the site that lead somewhere other than the named project, site or
  repository.
- Content injected into the site, for example through the build, a dependency
  or the project data read at build time (`plugins.json`, the GitHub API).
- The build and deploy workflows: secrets exposed to pull requests, or a
  pull request able to change the deployed site.

## Out of scope

- The projects themselves: report to the repository of the project.
- Missing HTTP security headers: GitHub Pages does not let the site set them.
