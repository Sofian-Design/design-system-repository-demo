# Figma Icon Exporter (Demo)
Ideal setup to handle assets export from Figma

- Figma Icon Exporter: **[Documentation](https://sofian-design.github.io/fivra/)**
- Figma Plugin: **[Figma Icon Exporter](https://www.figma.com/community/plugin/1533548616572213704/figma-icon-exporter)**
- Storybook Demo: **[Storybook](https://sofian-design.github.io/design-system-repository-demo/)**  
- Pro License: **[Get Pro](https://figma-icon-exporter.lemonsqueezy.com/buy/d7258c83-561d-496b-a1cc-33bd5ddb0b22)**

## Table of Contents

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Storybook 9 Setup (React + Vite)](#storybook-9-setup-react--vite)
- [React Icon Component](#react-icon-component)
  - [Auto-generated icons map](#auto-generated-icons-map)
- [Icons Pipeline](#icons-pipeline)
  - [Customize variants/directories](#customize-variantsdirectories)
- [CI / GitHub Actions](#ci--github-actions)
- [Troubleshooting](#troubleshooting)

## Requirements

- Node.js: 18.17+ (recommended: 22.x)
- Corepack: enabled (bundled with Node >= 16.9)
- Yarn: v4.9.4 (pinned via `packageManager`)

Check your environment:

```
node -v
corepack --version || echo "Corepack bundled with Node"
yarn -v || echo "Use Corepack to activate Yarn 4"
```

Enable Corepack and activate Yarn 4 (first time on a machine/CI):

```
corepack enable
corepack prepare yarn@4.9.4 --activate
```

The repo uses Yarn’s node-modules linker (`.yarnrc.yml`) and a Yarn v4 lockfile (`yarn.lock`).

## Quick Start

Install deps and generate the icons map:

```
yarn install --immutable
yarn generate:icons
```

Run Storybook locally:

```
yarn storybook
```

Build static Storybook:

```
yarn build-storybook
```

Notes:

- If you see a “packageManager … Corepack” error, ensure you ran the Corepack commands above.
- If you see “Your lockfile needs to be updated … --frozen-lockfile”, use Yarn 4 and `--immutable`.
- On Windows/WSL or network drives, file watching can be flaky. This repo enables Vite polling in `.storybook/main.js` to improve reliability.

## Storybook 9 Setup (React + Vite)

- Framework: `@storybook/react-vite@^9.1.4`
- Builder: Vite 5
- Addons used: `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-designs`
- Not used in SB 9: `@storybook/addon-essentials`, `@storybook/addon-actions`, `@storybook/addon-controls` (Actions/Controls are built-in in SB 9)

MDX blocks import:

```
// Use the Docs addon blocks in SB9
import { Meta, Title, Subtitle } from '@storybook/addon-docs/blocks';
```

Vite config for GitHub Pages:

- In production (static build), we set `base: './'` in `.storybook/main.js` so assets resolve correctly on GitHub Pages subpaths.
- Additionally, a tiny transform rewrites the absolute `/vite-inject-mocker-entry.js` to a relative `./vite-inject-mocker-entry.js` to prevent 404s when hosted under `/OWNER/REPO/`.

## React Icon Component

The repository includes a flexible React `Icon` component that renders icons from a map you provide. It supports React component icons, raw SVG strings, path data strings, and simple objects.

File: `src/components/Icon.tsx:1`

Example usage:

```tsx
import React from 'react';
import Icon from './src/components/Icon';

// Build a map from your `src/icons` directory
// Values can be:
// - React components (e.g. from SVGR)
// - Strings with SVG path data ("M0 0 ...")
// - Objects like { paths: ["M..."], viewBox: "0 0 24 24" }

const icons = {
  // Using variants (outline/solid)
  search: {
    // SearchOutline and SearchSolid are React components that render <svg>
    // e.g. created with SVGR from src/icons/outline/search.svg, src/icons/solid/search.svg
    // SearchOutline,
    // SearchSolid,
  },
  // Using a single path string
  circle: "M12 2a10 10 0 110 20 10 10 0 010-20z",
  // Using multiple paths
  square: { paths: ["M4 4h16v16H4z"], viewBox: "0 0 24 24" },
};

export default function Example() {
  return (
    <div>
      <Icon name="circle" icons={icons} size={24} color="#1e40af" variant="solid" />
      {/* <Icon name="search" icons={icons} variant="outline" size={24} /> */}
    </div>
  );
}
```

Notes:
- The component defaults to `size="1em"` and `color="currentColor"`.
- When `variant="outline"`, it uses `stroke: currentColor; fill: none` by default.
- When `variant="solid"`, it uses `fill: currentColor` by default.
- If you pass raw `<svg>` markup as a string, it is injected via `dangerouslySetInnerHTML` and sized via the wrapper element.
 - Aliases supported: `variant="stroke"` maps to `outline`, `variant="fill"` maps to `solid`.

### Auto-generated icons map

- Script: `scripts/generate-icons-map.mjs:1`
- Generates: `src/icons.generated.ts:1`
- Source folders: `src/icons/outline` and `src/icons/solid`

Run generation:

```
yarn generate:icons
```

The `Icon` component imports the generated map by default. You can still pass a custom `icons` map prop to override or extend it.

## Icons Pipeline

Folder structure expected from the Figma plugin:

```
src/
  icons/
    outline/
      <category>/<name>.svg
    solid/
      <category>/<name>.svg
```

Scripts:

- `yarn optimize-icons` — Runs SVGO to normalize SVGs
- `yarn generate:icons` — Scans `src/icons/*` and generates `src/icons.generated.ts`
- `prebuild-storybook` — Runs `generate:icons` before a Storybook build

How generation works (summary):

- Recursively scans `src/icons/**/*.svg` under the configured variant folders.
- For each SVG, removes `<defs>` blocks, extracts `<path d="...">` entries, and preserves `fill-rule`/`clip-rule` when present.
- Captures `viewBox` if present; defaults to `0 0 24 24` at render time when missing.
- If no `<path>` is found, stores the raw `<svg>` markup and injects it at render time.
- Writes a deterministic, typed map to `src/icons.generated.ts` used by the Icon component.

### Customize variants/directories

By default, the generator expects two styles/variants under `src/icons`:

- `outline/<category>/<name>.svg`
- `solid/<category>/<name>.svg`

If your design/plugin exports use different top-level folder names (e.g. `stroke` and `fill`), you can map them to the canonical variants without changing code by adding a small config in `package.json`:

```
{
  "iconsGenerator": {
    "variants": {
      "outline": ["outline", "stroke"],
      "solid": ["solid", "fill"]
    }
  }
}
```

Notes:

- Keys (`outline`, `solid`) are the canonical variant names expected by the Icon component.
- Values are one or more folder names to scan under `src/icons/<folder>`; the last occurrence wins if duplicates exist across aliases.
- You can also provide a single string instead of an array, e.g. `{ "outline": "stroke", "solid": "fill" }`.

If you customize the variant folders, update the Gallery story’s glob patterns to include your aliases. Example for `stroke`/`fill`:

```
// src/stories/IconsGallery.stories.tsx
const outlineFiles = import.meta.glob("../icons/{outline,stroke}/**/*.svg", { eager: true });
const solidFiles = import.meta.glob("../icons/{solid,fill}/**/*.svg", { eager: true });
```

## CI / GitHub Actions

Workflows:

- `.github/workflows/optimize-icons.yml`
  - Node 22 + Corepack → Yarn 4
  - Installs with `yarn install --immutable`
  - Optimizes SVGs and regenerates the icons map
  - Commits changes or uploads a patch for fork PRs

- `.github/workflows/deploy-storybook.yml`
  - Node 22 + Corepack → Yarn 4
  - Installs with `yarn install --immutable`
  - Builds Storybook and deploys to GitHub Pages

Important:

- The repo pins Yarn via `package.json#packageManager`. CI enables Corepack and activates Yarn 4 prior to install.
- Avoid `setup-node cache: yarn` with Yarn 4 — it calls Yarn before Corepack activation. We cache `.yarn/cache` instead.

## Troubleshooting

- “Your lockfile needs to be updated … --frozen-lockfile”
  - You’re likely using Yarn 1. Enable Corepack and activate Yarn 4, then `yarn install --immutable`.

- GitHub Pages loads but preview fails with 404s on assets
  - Ensure `base: './'` is set in `.storybook/main.js` for PRODUCTION.
  - The config includes a Vite transform to rewrite `/vite-inject-mocker-entry.js` to `./vite-inject-mocker-entry.js`.
  - Hard-refresh to bust caches after deploy.

- Windows
  - Consider running in WSL (Ubuntu). If using Windows FS, polling is enabled in Storybook’s Vite server for reliability.
