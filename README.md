# Fivra Design System

## Overview
The Fivra Design System packages reusable tokens, icons, components, and documentation that are synchronized with the Fivra product experience. It replaces earlier demo content (including the "Figma Icon Exporter" prototype) with a production-focused library that can be consumed by React, Angular, Vue, or standards-based web components. In addition to UI primitives, the repository includes a Storybook instance that demonstrates implementation guidance and provides designers and engineers with a shared reference.

For a deeper look at the architecture decisions, see the evolving documentation in [`docs/tech-stack.md`](docs/tech-stack.md) and forthcoming guides under `docs/architecture/` (coming soon).

## Goals
- Ship a consistent, accessible, and themeable component library that mirrors the design language in Figma.
- Support multi-framework adoption by exporting framework-agnostic tokens and web components alongside React and Angular bindings (Vue wrappers are next on the roadmap).
- Automate the icon and asset pipeline so generated artifacts stay in sync with Figma exports.
- Provide a reference Storybook to surface usage examples, accessibility notes, and design guidelines.

## Tech Stack
- **Language & Tooling**: TypeScript, Vite, Storybook 9, Yarn 4 (via Corepack), SVGO, and modern linting/formatting tooling. The living stack is documented in [`docs/tech-stack.md`](docs/tech-stack.md).
- **Build Targets**: ESM packages for direct consumption, generated icon maps, and Storybook static builds for documentation.
- **Planned Deliverables**: Framework-specific entry points (React today, Angular/Vue wrappers next), and web-component bundles for direct browser consumption.

## Components
- **Icon** – Renders generated SVG assets by name with outline/solid variants and accessibility helpers.
- **Button** – Multi-variant action trigger available as a React component, Angular module, and `<fivra-button>` custom element that share styling tokens.

## Local Development
### Requirements
- Node.js 18.17+ (Node 22.x recommended)
- Corepack (bundled with Node ≥ 16.9)
- Yarn 4.9.4 (activated through Corepack)

Check your environment:

```bash
node -v
corepack --version || echo "Corepack bundled with Node"
yarn -v || echo "Use Corepack to activate Yarn 4"
```

Enable Corepack and activate Yarn 4 on first use:

```bash
corepack enable
corepack prepare yarn@4.9.4 --activate
```

### Quick Start
Install dependencies and generate the icon map and theme tokens used by components:

```bash
yarn install --immutable
yarn generate:icons
yarn generate:tokens
```

Run the composed Storybook experience for React, Angular, and Vue on ports 6006/6007/6008. The script boots the Angular and Vue
dev servers first and waits for them to respond before composing the React manager so the tabs populate as soon as the window
opens:

```bash
yarn storybook
```

If you need to focus on the React workspace alone, run:

```bash
yarn storybook:react
```

This command disables the Angular and Vue refs by default. Use `yarn storybook:react:compose` when you want the React manager to boot with the Angular and Vue refs without starting their dev servers separately.

Build the component package (production output):

```bash
yarn build
```

If you prefer to preview the static Storybook output, run:

```bash
yarn build-storybook
```

The composed manager reads URLs from environment variables when you need to point at remote Storybook deployments (e.g., a shared Angular build running in CI):

```bash
# Override the Angular ref (defaults to http://localhost:6007)
STORYBOOK_ANGULAR_URL="https://design-system-angular.example.com" yarn storybook

# Override the Vue ref (defaults to http://localhost:6008)
STORYBOOK_VUE_URL="https://design-system-vue.example.com" yarn storybook

# Launch the React manager with local refs only (no Angular/Vue dev servers)
yarn storybook:react:compose
```

## Scripts
Commonly used scripts are listed below. Run them with `yarn <script>`.

- `generate:icons` – Scan `src/shared/assets/icons/**/*` and regenerate `src/shared/icons/icons.generated.ts`.
- `optimize-icons` – Normalize SVG assets with SVGO prior to generation.
- `generate:tokens` – Run the design token transformer (`scripts/generate-design-tokens.mjs`) to refresh `src/styles/themes/*.css` and `tokens.generated.ts`.
- `changeset` – Launch the interactive Changesets prompt to document the change surface area and select the appropriate semver bump.
- `version` – Apply accumulated Changesets (`changeset version`) to bump `package.json`, changelogs, and generated release metadata (`yarn run version`).
- `release` – Publish the release defined by Changesets (used by CI; requires `NPM_TOKEN`).
- `verify:agents` – Ensure modified directories updated their `AGENTS.md` with a new semantic-version bullet (runs automatically in CI).
- `storybook` – Launch the React, Angular, and Vue Storybook instances together (ports 6006/6007/6008). The script waits for the
  Angular and Vue dev servers to report ready before composing the React manager so refs resolve locally.
- `storybook:react` – Start the Storybook 9 (React + Vite) dev server with hot reload.
- `storybook:react:compose` – Run the React manager with composition enabled (Angular/Vue refs) without booting the other dev servers.
- `build-storybook` – Produce the static Storybook bundle and copy the Angular/Vue builds into `storybook-static/{angular,vue}` for composition.
- `build` – Create the distributable library bundles (React, Angular, and web components).
- `build:angular` – Build the Angular package with `ng-packagr`.
- `lint` / `typecheck` (coming soon) – Static analysis tasks that will be documented in the architecture guides.

Refer to `package.json` for the full list of scripts and watch the `docs/architecture/` directory for deeper implementation notes.

### Theming workflow
- Generated CSS lives in `src/styles/themes/` (`engage.css`, `legacy.css`) and is surfaced through `src/styles/index.css`.
- The Engage theme is the default and applies to `:root`; add `data-fivra-theme="legacy"` to any container to opt into the legacy variables at runtime.
- Run `yarn generate:tokens` whenever tokens change (or rely on the automated `prebuild`/`prestorybook` hooks) to keep the manifest and CSS up to date.

## Storybook Usage
- Storybook 9 runs on Vite 5 with the `@storybook/react-vite` framework.
- Accessibility, documentation, and design review workflows are supported via `@storybook/addon-a11y`, `@storybook/addon-docs`, and `@storybook/addon-designs`.
- Production builds set `base: './'`, include a Vite transform to ensure assets resolve correctly on GitHub Pages deployments, and wire Storybook refs to static Angular/Vue directories for hosted composition.
- The composed Angular (`http://localhost:6007`) and Vue (`http://localhost:6008`) workspaces surface under `Components/Button/{Angular,Vue}` in the sidebar when the refs are running.
- Icon galleries and component examples automatically consume the generated icon map; rerun `yarn generate:icons` when assets change.

Visit the published Storybook (if available) to explore live components, or run the local command above to iterate on new work.

## Release & Versioning Workflow
- Run `yarn changeset` on every PR that affects behavior, tooling, or documentation so the automated release pipeline can calculate semver bumps.
- After committing Changeset entries, update the relevant `AGENTS.md` files with a new `<major>.<minor>[.<patch>]` bullet summarizing the change—CI uses `yarn verify:agents` to enforce this requirement.
- Execute `yarn run version` locally to preview the resulting package version, then rerun `yarn build` and `yarn test` before pushing the release branch or triggering CI.
- The `Release` GitHub Actions workflow runs on pushes to `main`; it installs dependencies, validates AGENTS updates, runs Changesets versioning/publish steps, re-runs tests/builds post-version bump, and uploads the updated changelog.

## Contribution Guidelines
- Follow the Yarn/Corepack workflow described above; commits should not modify the lockfile unexpectedly.
- Keep icons and other generated artifacts in sync by running `yarn optimize-icons` and `yarn generate:icons` before opening a PR.
- Storybook stories should include accessibility notes, usage guidelines, and design references whenever possible.
- Review the appropriate `AGENTS.md` files for directory-specific standards before editing code or docs.
- When architecture guides are published under `docs/architecture/`, align code structure and naming with the documented conventions.

Please open issues or discussions for large proposals (e.g., new framework adapters or token schemas) so maintainers can help scope and prioritize the work.
