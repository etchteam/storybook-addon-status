# Sidebar Status Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `sidebarTags` config option that renders full status tags in the sidebar (slightly smaller than the toolbar tag) instead of the existing dots, addressing [issue #22](https://github.com/etchteam/storybook-addon-status/issues/22).

**Architecture:** Refactor `StatusTag` into a presentational `StatusTagBase` (variant-aware: `'toolbar'` | `'sidebar'`) plus thin wrappers. The toolbar continues to map current-story configs and renders `StatusTagBase` with the `'toolbar'` variant; a new `SidebarStatusTag` wrapper renders a single config with the `'sidebar'` variant (10px font, 16px line-height, 0.4em padding, span only — no link). `manager.jsx`'s `renderLabel` reads the new `sidebarTags` config and chooses tags vs. existing dots; when unset, behavior is unchanged.

**Tech Stack:** React 18, `storybook/theming` (styled-components), `lodash/startCase`, Storybook 10 manager API.

**Spec:** [docs/superpowers/specs/2026-04-30-sidebar-status-tags-design.md](docs/superpowers/specs/2026-04-30-sidebar-status-tags-design.md)

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/components/StatusTagBase.jsx` | Create | Presentational, variant-aware single status tag (span or link). |
| `src/components/StatusTag.jsx` | Modify | Toolbar entry point. Keeps hooks; delegates rendering to `StatusTagBase`. |
| `src/components/SidebarStatusTag.jsx` | Create | Thin wrapper that renders a single config via `StatusTagBase` with `variant="sidebar"`, no link. |
| `src/manager.jsx` | Modify | Read new `sidebarTags` config; choose tag vs. dot rendering with documented precedence. |
| `.storybook/manager.js` | Modify | Demo config switched to `sidebarTags: 'multiple'` for verification. |
| `Readme.md` | Modify | Document the new `sidebarTags` option. |

The repo has **no unit test suite** (confirmed against `package.json` — only `prebuild`, `prepare`, `storybook`, `build-storybook`, `release` scripts). Verification is via the running Storybook dev server. Each task includes a build/lint check; a single manual-verification task at the end exercises the matrix from the spec.

---

## Task 1: Create `StatusTagBase` presentational component

**Files:**
- Create: `src/components/StatusTagBase.jsx`

- [ ] **Step 1: Create the file**

```jsx
import startCase from 'lodash/startCase';
import React from 'react';
import { styled, css } from 'storybook/theming';

import {
  defaultStatuses,
  defaultBackground,
  defaultColor,
} from '../defaults';

const baseStyles = css`
  align-self: center;
  border-radius: 0.25em;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
`;

const toolbarStyles = css`
  font-size: 11px;
  line-height: 20px;
  padding: 0 0.5em;
`;

const sidebarStyles = css`
  font-size: 10px;
  line-height: 16px;
  margin-left: 0.5em;
  padding: 0 0.4em;
`;

const variantStyles = ({ variant }) =>
  variant === 'sidebar' ? sidebarStyles : toolbarStyles;

const LinkTag = styled.a`
  ${baseStyles}
  ${variantStyles}
`;

const TextTag = styled.span`
  ${baseStyles}
  ${variantStyles}
`;

const StatusTagBase = ({ label, status, url, variant = 'toolbar' }) => {
  const resolvedColor =
    status?.color ??
    (defaultStatuses[label] ? defaultStatuses[label].color : defaultColor);
  const resolvedBackground =
    status?.background ??
    (defaultStatuses[label]
      ? defaultStatuses[label].background
      : defaultBackground);

  const style = {
    color: resolvedColor,
    backgroundColor: resolvedBackground,
  };

  const description = status?.description;
  const displayLabel = startCase(label);
  const isLink = variant === 'toolbar' && !!url;

  if (isLink) {
    return (
      <LinkTag variant={variant} style={style} title={description} href={url}>
        {displayLabel}
      </LinkTag>
    );
  }

  return (
    <TextTag variant={variant} style={style} title={description}>
      {displayLabel}
    </TextTag>
  );
};

export default StatusTagBase;
```

**Notes:**
- `label` is the raw camelCase status name (e.g. `'releaseCandidate'`); `startCase` is applied internally for display. Defaults lookup uses the raw `label` so it correctly matches built-in keys like `releaseCandidate`. This matches `StatusDot`'s lookup (which uses the raw `type` prop).
- `align-self: center` is preserved from the existing toolbar styles. `margin-left: 0.5em` on the sidebar variant mirrors the existing `StatusDot` spacing.
- `padding: 0 0.5em` was duplicated in the original `tagStyles` block. The duplicate is dropped here; only one rule is applied per variant.

- [ ] **Step 2: Run lint to verify the file is clean**

Run: `npx eslint src/components/StatusTagBase.jsx`
Expected: no errors.

- [ ] **Step 3: Run the build to verify it compiles**

Run: `npm run prepare`
Expected: `tsup` exits successfully and writes to `dist/`.

- [ ] **Step 4: Commit**

```bash
git add src/components/StatusTagBase.jsx
git commit -m "feat: add StatusTagBase presentational component

Variant-aware (toolbar | sidebar) presentational status tag. Renders
either a span or an anchor depending on variant + url. Internalises
the defaults-fallback logic and label start-casing.

Refs #22"
```

---

## Task 2: Refactor `StatusTag` (toolbar) to use `StatusTagBase`

**Files:**
- Modify: `src/components/StatusTag.jsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `src/components/StatusTag.jsx` with:

```jsx
import React from 'react';
import { useParameter, useStorybookApi, addons } from 'storybook/manager-api';

import { ADDON_ID } from '../constants';
import { getStatusConfigs } from '../getStatusConfigs';
import StatusTagBase from './StatusTagBase';

const StatusTag = () => {
  const api = useStorybookApi();
  const tags = api.getCurrentStoryData()?.tags ?? [];

  const parameters = useParameter(ADDON_ID, null);
  const customConfigs = addons.getConfig()?.[ADDON_ID]?.statuses;

  const statusConfigs = getStatusConfigs({
    tags,
    parameters,
    customConfigs,
  });

  if (!statusConfigs?.length) {
    return null;
  }

  return (
    <>
      {statusConfigs.map((statusConfig) => (
        <StatusTagBase
          key={statusConfig.label}
          label={statusConfig.label}
          status={statusConfig.status}
          url={statusConfig.url}
          variant="toolbar"
        />
      ))}
    </>
  );
};

export default StatusTag;
```

**Notes:**
- Removes the local `tagStyles`, `LinkTag`, `TextTag`, and inline color/background resolution — all of that now lives in `StatusTagBase`.
- Removes unused imports (`startCase`, `styled`, `css`, default colour constants).
- Public behavior is preserved: same DOM output (`<a>` for URL statuses, `<span>` otherwise) at the existing toolbar size.

- [ ] **Step 2: Run lint to verify the file is clean**

Run: `npx eslint src/components/StatusTag.jsx`
Expected: no errors.

- [ ] **Step 3: Run the build to verify it compiles**

Run: `npm run prepare`
Expected: `tsup` exits successfully.

- [ ] **Step 4: Smoke-check the toolbar in Storybook**

Run: `npm run storybook` (in a separate terminal — leave running for later tasks).
Open http://localhost:6006, pick a story with a status (e.g. an existing `'beta'` story), and confirm the toolbar shows the same status tag as before this change. Hover should still show the description.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatusTag.jsx
git commit -m "refactor: route StatusTag through StatusTagBase

The toolbar StatusTag now delegates rendering to the new
StatusTagBase presentational component. No public behaviour change.

Refs #22"
```

---

## Task 3: Create `SidebarStatusTag` wrapper

**Files:**
- Create: `src/components/SidebarStatusTag.jsx`

- [ ] **Step 1: Create the file**

```jsx
import React from 'react';

import StatusTagBase from './StatusTagBase';

const SidebarStatusTag = ({ statusConfig }) => (
  <StatusTagBase
    label={statusConfig.label}
    status={statusConfig.status}
    variant="sidebar"
  />
);

export default SidebarStatusTag;
```

**Notes:**
- Deliberately does not pass `url`. Sidebar tags are always rendered as a `<span>` per the spec (URL is intentionally ignored to avoid nested clickable elements inside Storybook's sidebar row).
- Takes a single `statusConfig` (not an array) so the caller controls iteration and `key`.

- [ ] **Step 2: Run lint to verify the file is clean**

Run: `npx eslint src/components/SidebarStatusTag.jsx`
Expected: no errors.

- [ ] **Step 3: Run the build to verify it compiles**

Run: `npm run prepare`
Expected: `tsup` exits successfully.

- [ ] **Step 4: Commit**

```bash
git add src/components/SidebarStatusTag.jsx
git commit -m "feat: add SidebarStatusTag wrapper

Thin wrapper around StatusTagBase fixing variant=\"sidebar\" and
omitting url so sidebar tags are always rendered as spans.

Refs #22"
```

---

## Task 4: Wire `sidebarTags` into `manager.jsx` `renderLabel`

**Files:**
- Modify: `src/manager.jsx`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `src/manager.jsx` with:

```jsx
import startCase from 'lodash/startCase';
import React from 'react';
import { addons, types } from 'storybook/manager-api';

import SidebarStatusTag from './components/SidebarStatusTag';
import StatusDot from './components/StatusDot';
import StatusTag from './components/StatusTag';
import { ADDON_ID } from './constants';
import { getStatusConfigs } from './getStatusConfigs';

addons.register(ADDON_ID, (api) => {
  const addonsConfig = addons.getConfig();
  const existingSidebarConfig = addonsConfig?.sidebar ?? {};

  addons.add(ADDON_ID, {
    title: 'Status',
    type: types.TOOL,
    render: () => <StatusTag />,
  });

  const statusAddonConfig = addonsConfig?.[ADDON_ID] ?? {};

  addons.setConfig({
    sidebar: {
      ...existingSidebarConfig,
      renderLabel: (item) => {
        const { name, tags } = item;
        const isLeaf = ['root', 'group', 'story'].includes(item.type);

        try {
          const fallbackLabel = existingSidebarConfig?.renderLabel
            ? existingSidebarConfig.renderLabel(item)
            : name;

          const sidebarTagsConfig = statusAddonConfig?.sidebarTags;
          const sidebarDotsConfig = statusAddonConfig?.sidebarDots;

          // sidebarTags, when set, fully overrides sidebarDots.
          const isTagMode =
            sidebarTagsConfig === 'single' || sidebarTagsConfig === 'multiple';

          if (sidebarTagsConfig === 'none') {
            return fallbackLabel;
          }

          if (sidebarTagsConfig === undefined && sidebarDotsConfig === 'none') {
            return fallbackLabel;
          }

          const parameters = api.getParameters(item.id, ADDON_ID);

          // item can be a Root | Group | Story
          if (!isLeaf || (tags.length === 0 && !parameters?.type)) {
            return fallbackLabel;
          }

          // Get custom status configurations from the current story's parameters.
          // This will include any custom statuses defined in manager.js, preview.js or story parameters.
          // However custom statuses from story parameters will only be available in the sidebar
          // when viewing that story. This is a storybook limitation:
          // https://github.com/storybookjs/storybook/discussions/24022
          const customConfigs =
            statusAddonConfig?.statuses ||
            api.getCurrentStoryData().parameters?.status?.statuses;

          let statusConfigs = getStatusConfigs({
            tags,
            parameters,
            customConfigs,
          });

          if (statusConfigs.length === 0) {
            return fallbackLabel;
          }

          const showMultiple = isTagMode
            ? sidebarTagsConfig === 'multiple'
            : sidebarDotsConfig === 'multiple';

          if (!showMultiple) {
            statusConfigs = [statusConfigs[0]];
          }

          return (
            <>
              {fallbackLabel}
              {statusConfigs.map((statusConfig) => {
                if (isTagMode) {
                  return (
                    <SidebarStatusTag
                      key={statusConfig.label}
                      statusConfig={statusConfig}
                    />
                  );
                }

                const {
                  label: statusName,
                  status: { background, description },
                } = statusConfig;

                return (
                  <StatusDot
                    key={statusName}
                    type={statusName}
                    background={background}
                    title={`${startCase(statusName)}: ${description}`}
                  />
                );
              })}
            </>
          );
        } catch (error) {
          return name;
        }
      },
    },
  });
});
```

**Notes on the precedence logic** (mirrors the spec's "Precedence rules" section):
- `sidebarTags === 'none'` → no indicator, regardless of `sidebarDots`.
- `sidebarTags === 'single' | 'multiple'` → tag mode; `sidebarDots` is ignored.
- `sidebarTags === undefined` AND `sidebarDots === 'none'` → no indicator (existing behavior).
- `sidebarTags === undefined` otherwise → existing dot behavior, where `sidebarDots === 'multiple'` shows all and any other value (or `undefined`) shows only the first.

- [ ] **Step 2: Run lint**

Run: `npx eslint src/manager.jsx`
Expected: no errors.

- [ ] **Step 3: Run the build**

Run: `npm run prepare`
Expected: `tsup` exits successfully.

- [ ] **Step 4: Commit**

```bash
git add src/manager.jsx
git commit -m "feat: support sidebarTags option in renderLabel

Adds a new \`status.sidebarTags\` config ('single' | 'multiple' |
'none') that, when set, renders SidebarStatusTag components in the
sidebar instead of dots. When unset, the existing sidebarDots
behaviour is preserved exactly.

Closes #22"
```

---

## Task 5: Update demo `.storybook/manager.js` for verification

**Files:**
- Modify: `.storybook/manager.js`

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `.storybook/manager.js` with:

```js
import { addons } from "storybook/manager-api";

addons.setConfig({
  status: {
    statuses: {
      customStatus: {
        background: '#0000ff',
        color: '#ffffff',
        description: 'This component is stable and released',
      },
    },
    // 'single' | 'multiple' | 'none'. When set, takes precedence over sidebarDots.
    sidebarTags: 'multiple',
    sidebarDots: 'multiple', // 'single' | 'multiple' | 'none'. 'single' is the default
  },
});
```

**Note:** This is dev-only config used to exercise the new mode in `npm run storybook`. We keep `sidebarDots: 'multiple'` in place so it's easy to flip `sidebarTags` between values (or comment it out) and confirm the precedence rules behave as documented.

- [ ] **Step 2: Verify Storybook reloads cleanly**

If the Storybook dev server from Task 2 is still running, it should hot-reload. Otherwise: `npm run storybook`.
Open http://localhost:6006 and confirm the addon still loads (no console errors).

- [ ] **Step 3: Commit**

```bash
git add .storybook/manager.js
git commit -m "chore(demo): enable sidebarTags multiple in dev storybook

Refs #22"
```

---

## Task 6: Manual verification matrix

**Files:** none.

This task exercises every row of the verification matrix in the spec. The Storybook dev server (`npm run storybook`) must be running. After each scenario, edit `.storybook/manager.js` and let Storybook hot-reload. Check each box only after observing the expected behavior.

- [ ] **Default (no `sidebarTags`, no `sidebarDots`):** comment out both lines.
  Expected: one **dot** per story (single, default).

- [ ] **Existing dots opt-in (`sidebarDots: 'multiple'`):** comment out `sidebarTags`, keep `sidebarDots: 'multiple'`.
  Expected: multiple **dots** per story for stories with multiple statuses.

- [ ] **New tag mode — single (`sidebarTags: 'single'`):**
  Expected: one **tag** per story (the first matching status), no dots. Tag is at the smaller sidebar size.

- [ ] **New tag mode — multiple (`sidebarTags: 'multiple'`):**
  Expected: a sidebar tag for **every** matching status, no dots.

- [ ] **New tag mode — none (`sidebarTags: 'none'`, `sidebarDots: 'multiple'`):**
  Expected: **no** indicator at all (sidebarTags overrides sidebarDots). Toolbar tag still shows.

- [ ] **Long status names:** with `sidebarTags: 'multiple'`, view a story whose statuses include `customStatus` (long-ish label after `startCase` → "Custom Status").
  Expected: row layout doesn't break; long names either fit or wrap acceptably.

- [ ] **Hover title:** with any tag mode, hover a sidebar tag.
  Expected: native browser tooltip shows the status `description`.

- [ ] **URL ignored in sidebar:** add `parameters.status.url` to a story (or pick one that already has it from `stories/`). With `sidebarTags: 'single'`:
  Expected: sidebar tag is a `<span>` (not an `<a>`); toolbar tag is still an `<a>`. Inspect the DOM to confirm.

- [ ] **Custom statuses:** with `sidebarTags: 'multiple'`, navigate to a story that uses `customStatus` (defined in `.storybook/manager.js`).
  Expected: sidebar tag renders with the configured `#0000ff` background.

- [ ] **Restore demo config to a sensible default before commit:**

After verification, set `.storybook/manager.js` back to:

```js
import { addons } from "storybook/manager-api";

addons.setConfig({
  status: {
    statuses: {
      customStatus: {
        background: '#0000ff',
        color: '#ffffff',
        description: 'This component is stable and released',
      },
    },
    sidebarTags: 'multiple',
    sidebarDots: 'multiple',
  },
});
```

(This is the same as the end of Task 5 — verification-only edits should not have been committed.)

- [ ] **Commit only if a fix was needed.** If verification surfaced no bugs, no commit is created in this task. If a bug was found and fixed, commit the fix with a descriptive message referencing the failing scenario.

---

## Task 7: Update the Readme

**Files:**
- Modify: `Readme.md`

- [ ] **Step 1: Update the Configuration section**

Replace the existing Configuration code example block in `Readme.md` (currently the block starting `import { addons } from "storybook/manager-api";` and ending with `});` directly under the **Configuration** heading) with:

````markdown
```js
import { addons } from "storybook/manager-api";

addons.setConfig({
  status: {
    statuses: {
      released: {
        background: '#0000ff',
        color: '#ffffff',
        description: 'This component is stable and released',
      },
    },
    sidebarDots: 'single', // 'single' | 'multiple' | 'none'. 'single' is the default
    sidebarTags: 'single', // 'single' | 'multiple' | 'none'. When set, overrides sidebarDots and renders full status tags in the sidebar instead of dots.
  },
});
```

By default the sidebar shows a small coloured dot next to each story. Setting `sidebarTags` to `'single'` or `'multiple'` switches the sidebar to render the full status tag — the same colour and label as the toolbar tag, but slightly smaller. `sidebarTags: 'none'` hides the indicator entirely (and overrides `sidebarDots`). When `sidebarTags` is not set, `sidebarDots` keeps its existing behaviour.

**Note:** Status URLs are intentionally not used by sidebar tags — clicking a story row in the sidebar should always navigate to that story. Use the toolbar tag (which still renders as a link) to follow the URL.
````

**Note:** The replacement preserves the existing `sidebarDots` line and adds `sidebarTags` immediately below it, then adds a short prose paragraph explaining the new option and the URL-handling caveat.

- [ ] **Step 2: Eyeball the Readme**

Open `Readme.md` and confirm the new section reads cleanly and matches the rest of the document's tone.

- [ ] **Step 3: Commit**

```bash
git add Readme.md
git commit -m "docs: document sidebarTags configuration option

Refs #22"
```

---

## Task 8: Open the pull request

**Files:** none.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feature/sidebar-status-tags
```

- [ ] **Step 2: Open a PR linked to issue #22**

```bash
gh pr create --title "feat: optional status tags in sidebar (closes #22)" --body "$(cat <<'EOF'
## Summary
- Adds a new `status.sidebarTags` config (`'single' | 'multiple' | 'none'`) that renders full status tags in the sidebar instead of dots.
- Refactors `StatusTag` into a presentational `StatusTagBase` so the toolbar and sidebar share rendering. The sidebar variant is slightly smaller (10px / 16px line-height / 0.4em padding).
- When `sidebarTags` is unset, the existing `sidebarDots` behaviour is preserved exactly.

Closes #22.

## Test plan
- [ ] Default (no config): single dot per story.
- [ ] `sidebarDots: 'multiple'`: multiple dots per story.
- [ ] `sidebarTags: 'single'`: one sidebar tag per story.
- [ ] `sidebarTags: 'multiple'`: all sidebar tags per story.
- [ ] `sidebarTags: 'none'`: no indicator (overrides `sidebarDots`).
- [ ] Sidebar tag is rendered as `<span>` even when the status has a `url`.
- [ ] Toolbar tag is unchanged (still renders as `<a>` for statuses with a `url`).
- [ ] Hovering a sidebar tag shows the status description.
- [ ] Custom statuses defined in `manager.js` render with the configured colours.
EOF
)"
```

- [ ] **Step 3: Capture the PR URL** and report it back.

---

## Self-review

Run through the spec section-by-section and confirm coverage. (Done while writing this plan; no gaps identified.)

- **Problem / Goals / Non-goals:** Covered by Tasks 1–4 (feature) + Task 7 (docs).
- **Configuration API + precedence rules:** Implemented in Task 4. The `if (sidebarTagsConfig === 'none')` short-circuit, the `isTagMode` branch, and the `showMultiple` choice each map to a numbered rule in the spec.
- **`StatusTagBase`:** Task 1 (matches the props table in the spec exactly: `label`, `status`, `url`, `variant`).
- **`StatusTag` (toolbar refactor):** Task 2.
- **`SidebarStatusTag`:** Task 3 (passes no `url`, fixed variant, takes a single config).
- **`manager.jsx` flow change:** Task 4 (matches the spec's pseudocode).
- **Verification matrix:** Task 6 — every row in the spec's table is a checkbox.
- **Documentation:** Task 7 — covers `sidebarTags` next to `sidebarDots`, precedence note, URL caveat.
- **Open decisions resolved (Q1 API shape, Q2 link behavior, Q3 sizing):** Q1 → Task 4 (parallel `sidebarTags` setting); Q2 → Task 3 (`SidebarStatusTag` omits `url`) + Task 1 (`isLink` only when `variant === 'toolbar'`); Q3 → Task 1 (`sidebarStyles` block sets 10px / 16px / 0.4em).

No placeholders. Type/prop names consistent across tasks (`statusConfig`, `label`, `status`, `url`, `variant`, `sidebarTags`, `isTagMode`, `showMultiple`).
