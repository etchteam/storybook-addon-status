# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@etchteam/storybook-addon-status` is a Storybook 10 addon that surfaces a per-story status (beta / deprecated / stable / releaseCandidate / custom) in the toolbar and sidebar. Distributed as ESM. The repo is also a self-hosted Storybook used to dogfood the addon.

Node version is pinned in `.nvmrc` (22.14.0).

## Commands

- `npm run prepare` — build the addon with tsup into `dist/`. This runs automatically on `npm install`, but you must re-run it manually after editing `src/` for the local Storybook to pick up changes (the local Storybook loads `dist/manager.js`, not `src/`).
- `npm run storybook` — run the demo Storybook on port 6006. Run `npm run prepare` first if you've changed addon source.
- `npm run build-storybook` — production build of the demo Storybook (also what CI runs).
- `npx --no -- eslint src` — lint addon source (matches CI exactly). There is no `lint` npm script.
- `npm run release` — semantic-release; only meant to run from CI on `main`.

There is **no test suite**. Verification is manual via the demo Storybook.

## Architecture

This is a **manager-only addon** — it ships no preview-side code. The published entry point is `manager.js` at the repo root, which is a one-liner that imports `dist/manager.js`. tsup (see `tsup.config.js`) bundles `src/manager.jsx` to `dist/manager.js` as ESM with `react`, `react-dom`, and `@storybook/icons` externalized.

### Runtime flow ([src/manager.jsx](src/manager.jsx))

On `addons.register`:

1. Adds a toolbar tool (`type: types.TOOL`) that renders [StatusTag](src/components/StatusTag.jsx) — the pill(s) shown above the canvas for the current story.
2. Calls `addons.setConfig({ sidebar: { renderLabel } })` to inject [StatusDot](src/components/StatusDot.jsx)s next to story names in the sidebar. It preserves any pre-existing `renderLabel` by chaining to it.

### Status resolution ([src/getStatusConfigs.js](src/getStatusConfigs.js))

There are three sources of status data, merged in this precedence:

1. **Tags** (`tags: ['beta', 'myStatus']` on the story/meta) — the recommended API. Enables Storybook's built-in tag filtering. Tags that don't match a known status name are silently ignored.
2. **Story parameters** (`parameters.status.type` — string | object `{name, url}` | array of either) — legacy API, but still required when a story needs a per-story `url` or per-story custom status definition.
3. **Status definitions** — looked up from (in order): `addons.setConfig({ status: { statuses } })` in the user's `manager.js`, then `parameters.status.statuses`, then [defaults](src/defaults.js) (`beta`, `deprecated`, `stable`, `releaseCandidate`).

Tag and parameter statuses are concatenated and deduplicated by name; on collision the parameter version wins (it carries the optional `url`). Statuses with no matching definition are filtered out.

### Sidebar dots quirk

`addons.setConfig({ status: { sidebarDots: 'single' | 'multiple' | 'none' } })` controls how many dots render per story. There is a known Storybook limitation (see comment in [src/manager.jsx:50-54](src/manager.jsx#L50-L54)) that custom status definitions declared in `parameters.status.statuses` are only available to the sidebar while that story is the active one — global custom statuses must live in `manager.js`'s `setConfig`.

### Demo Storybook ([.storybook/](.storybook/))

[main.js](.storybook/main.js) registers [local-preset.js](.storybook/local-preset.js), which loads the **built** `dist/manager.js` via `managerEntries`. This is why source changes require a rebuild before they appear in `npm run storybook`. [manager.js](.storybook/manager.js) configures a sample custom status and `sidebarDots: 'multiple'` to exercise the addon.

## Conventions

- **Commits must be Conventional Commits.** Husky + commitlint enforce this on commit (`commitlint.config.cjs` extends `@commitlint/config-conventional`). Releases are determined entirely by commit messages via semantic-release ([release.config.cjs](release.config.cjs)) on pushes to `main`.
- **Lint-staged** runs `eslint --fix` on staged JS/TS/JSON/YAML via the pre-commit hook ([lint-staged.config.cjs](lint-staged.config.cjs)).
- ESLint uses `@etchteam` shared config; see [.eslintrc.cjs](.eslintrc.cjs) for the few overrides.
- Source is `.js` / `.jsx` (no TypeScript). Don't introduce TS without a separate discussion — the build is set up for plain JS through tsup/swc.
- Storybook is a **peer dependency** (`^10.0.0`). Imports come from `storybook/manager-api` and `storybook/theming` (the new Storybook 10 entry points), not from the older `@storybook/*` packages.
