# Storybook Configuration Guidelines

This document augments the repository root `AGENTS.md`. Review root conventions first, then apply these rules when editing files within `.storybook/`.

## Configuration Standards
- Author Storybook configuration files in TypeScript where supported, using explicit `StorybookConfig` typings and `export default`.
- Preserve and document alias, base, and plugin settings that keep React, Web Component, and documentation stories in sync.
- Resolve filesystem paths via `fileURLToPath` helpers (and `path.resolve` or `path.dirname`) so configs behave consistently across ESM and CommonJS runtimes.

## Workflow Expectations
- Keep production (`build-storybook`) and development (`storybook dev`) behaviors aligned; test both when altering config.
- When updating addons or frameworks, validate compatibility with our accessibility, docs, and design tooling before committing.
- Document notable configuration changes in PR descriptions and cross-reference related updates under `src/stories/` when behavior changes.
- Use `yarn storybook` to validate Storybook refs locally; the command launches the React, Angular, and Vue workspaces together on ports 6006/6007/6008.
- Toggle Angular/Vue composition by setting `STORYBOOK_COMPOSE_ANGULAR` and `STORYBOOK_COMPOSE_VUE` (defaults to `true` for the composed workflow).

## Review Checklist
- Ensure `yarn storybook`, `yarn build-storybook`, and TypeScript type checks succeed after modifying configuration.
- Avoid introducing duplicated configuration files or unused legacy settings.
- Coordinate with component authors if configuration changes require story updates or new documentation.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Updated Storybook story globs to read MDX documentation from `docs/` so overview and integration pages render.
- 1.1.0: Added design token diagnostics and cleanup logging in the preview decorator to detect missing theme CSS during development.
- 1.2.0: Split the configuration so the React workspace lives here while Angular stories load from `storybooks/angular/.storybook`.
- 1.3.0: Introduced Storybook composition refs, the runtime manager entry, and the `storybook:compose`/`build-storybook` orchestration workflow.
- 1.3.1: Updated preview typing to reference `@storybook/react-vite` after running the automigration tooling.
- 1.4.0: Simplified refs configuration and promoted the composed workflow to `yarn storybook`.
- 1.5.0: Reintroduced environment toggles so the React manager only composes Angular/Vue refs when explicitly enabled.
