# Sidebar status tags option

**Issue:** [#22 — Customize the bullet located on the left menu](https://github.com/etchteam/storybook-addon-status/issues/22)
**Date:** 2026-04-30
**Status:** Approved

## Problem

The sidebar currently shows a small 6px coloured `StatusDot` next to each story, with a `title` attribute on hover. Multiple users (most recently in [#22](https://github.com/etchteam/storybook-addon-status/issues/22)) have asked for the option to display the full status as a coloured tag — like the `StatusTag` shown in the toolbar — so the status is visible at a glance without hovering.

## Goals

- Provide a config option to render full status tags in the sidebar instead of dots.
- Tags in the sidebar should be slightly smaller than the toolbar tag so they fit cleanly next to story names.
- Keep the existing `sidebarDots` API working unchanged for users who don't opt in.

## Non-goals

- Changing the default sidebar appearance. Existing users still see dots unless they opt in.
- Custom icons or alternate sidebar indicators (out of scope; raised separately in the issue).
- Configurable indicator location.
- Making the sidebar tag a link. (See [Open decisions](#open-decisions-resolved).)

## Configuration API

A new optional config sits alongside the existing `sidebarDots`:

```js
import { addons } from 'storybook/manager-api';

addons.setConfig({
  status: {
    sidebarDots: 'single',                          // existing, unchanged
    sidebarTags: 'single' | 'multiple' | 'none',    // new
  },
});
```

### Precedence rules

When `renderLabel` runs:

1. If `sidebarTags === 'none'` → render the fallback label only (no indicator).
2. If `sidebarTags === 'single'` → render a single sidebar tag (the first matching status).
3. If `sidebarTags === 'multiple'` → render a sidebar tag for every matching status.
4. If `sidebarTags` is not set (`undefined`) → fall back to the existing `sidebarDots` behavior, unchanged.

`sidebarTags`, when set to a non-`undefined` value, fully overrides `sidebarDots`. The two settings are not combined.

### Why a separate setting (option A from brainstorm)

Considered alternatives:
- **B. Extend `sidebarDots` values** (e.g. add `'tag'`) — rejected: a setting named `sidebarDots` returning `'tag'` is confusing.
- **C. New structured `sidebar` config object** — rejected for now: bigger change, requires deprecating `sidebarDots`. Can evolve to this later if more sidebar options accumulate.
- **A. Parallel `sidebarTags` config** — chosen: smallest change, fully backward-compatible, mirrors existing naming.

## Components

The current `StatusTag.jsx` couples the toolbar's data fetching (via `useStorybookApi` / `useParameter` hooks) with the visual rendering of a tag. To share rendering between the toolbar and sidebar, we split it.

### `StatusTagBase` (new — presentational)

Single-status presentational component. Stateless, takes everything it needs as props.

**Props:**
- `label: string` — raw status label (e.g. `'releaseCandidate'`). `StatusTagBase` applies `startCase` internally so callers don't need to know about display formatting.
- `status: { background?: string, color?: string, description?: string }` — the resolved status config.
- `url?: string` — when present and `variant === 'toolbar'`, renders an anchor.
- `variant: 'toolbar' | 'sidebar'` — controls size and link rendering.

**Behavior:**
- Renders `<a>` only when `variant === 'toolbar'` AND `url` is set. Otherwise renders `<span>`.
- Applies the appropriate size styles for the variant.
- Sets `title={description}` for hover tooltip.

**Sizes:**

| | Font size | Line height | Padding (horizontal) | Border radius |
|---|---|---|---|---|
| `toolbar` (existing) | 11px | 20px | 0.5em | 0.25em |
| `sidebar` (new) | 10px | 16px | 0.4em | 0.25em |

The base styled-component composes shared rules; variant-specific rules are layered on top via a `variant` prop or two extending styled-components.

### `StatusTag` (toolbar — refactored)

Keeps current responsibilities: read current story via hooks, resolve configs via `getStatusConfigs`, render a list. Internally maps each config to `<StatusTagBase variant="toolbar" url={...} />`. Public behavior unchanged.

### `SidebarStatusTag` (new — thin wrapper)

A minimal component used from `manager.jsx`'s `renderLabel`. Takes a single resolved status config (label + status + description) and renders `<StatusTagBase variant="sidebar" />` (no `url` passed — sidebar tags are never links per [Open decisions](#open-decisions-resolved)).

This wrapper exists so `manager.jsx` can stay clean and the sidebar component is easy to reason about.

## `manager.jsx` flow change

The current logic in [src/manager.jsx](src/manager.jsx) reads `sidebarDotsConfig` and short-circuits on `'none'`. The new logic, in pseudocode:

```
const sidebarTagsConfig = statusAddonConfig?.sidebarTags;
const sidebarDotsConfig = statusAddonConfig?.sidebarDots;

if (sidebarTagsConfig === 'none') return fallbackLabel;
if (sidebarTagsConfig === undefined && sidebarDotsConfig === 'none') return fallbackLabel;

// ... unchanged: resolve statusConfigs from tags + parameters ...

if (statusConfigs.length === 0) return fallbackLabel;

const isTagMode = sidebarTagsConfig === 'single' || sidebarTagsConfig === 'multiple';
const showMultiple = isTagMode
  ? sidebarTagsConfig === 'multiple'
  : sidebarDotsConfig === 'multiple';

const visibleConfigs = showMultiple ? statusConfigs : [statusConfigs[0]];

return (
  <>
    {fallbackLabel}
    {visibleConfigs.map(config =>
      isTagMode
        ? <SidebarStatusTag key={...} config={config} />
        : <StatusDot key={...} {...} />
    )}
  </>
);
```

The default-status logic that resolves `background`/`color`/`description` already lives in the dot rendering and inside `StatusTag`'s map; the sidebar tag goes through `StatusTagBase`, which uses the same defaults logic shared with the toolbar.

## Verification

The repo has no unit test suite. Verification will be done in the running Storybook (`npm run storybook`).

**Test matrix:**

| Scenario | Config | Expected |
|---|---|---|
| Default | (no `sidebarTags`, no `sidebarDots`) | Single dot per story (existing behavior). |
| Existing dots opt-in | `sidebarDots: 'multiple'` | Multiple dots per story (existing behavior). |
| New tag mode — single | `sidebarTags: 'single'` | One sidebar tag per story (first status), no dots. |
| New tag mode — multiple | `sidebarTags: 'multiple'` | All sidebar tags per story, no dots. |
| New tag mode — none | `sidebarTags: 'none'` | No indicator, regardless of `sidebarDots`. |
| Long status names | Tag mode, custom status with long name | Tag does not break the row layout; truncation or wrap looks acceptable. |
| Hover title | Any tag mode | Hovering the sidebar tag shows the description. |
| URL is ignored in sidebar | Story with `parameters.status.url` set, tag mode | Sidebar tag renders as `<span>` not `<a>`; toolbar tag still renders as `<a>`. |
| Custom statuses | Tag mode + custom status from `manager.js` | Renders with custom colours. |

The demo `.storybook/manager.js` will be updated during implementation to make the new mode easy to verify.

## Documentation

Update `Readme.md` configuration section to:
- Document `sidebarTags` next to `sidebarDots`.
- Note that `sidebarTags` (when set) overrides `sidebarDots`.
- Note that URLs on statuses are not used in sidebar tags (the toolbar tag is the linked one).

## Open decisions (resolved)

1. **Configuration API shape** — chose option A (parallel `sidebarTags` setting). [Q1]
2. **Link behavior in sidebar** — sidebar tags are always rendered as `<span>`, never `<a>`, even when the status has a URL. The toolbar tag remains the linked surface. Reason: a link inside Storybook's already-clickable sidebar row creates conflicting interactions, and adding `stopPropagation` was deemed unnecessary complexity. [Q2]
3. **Sidebar tag size** — slightly smaller than toolbar: 10px font, 16px line-height, 0.4em horizontal padding. [Q3]
