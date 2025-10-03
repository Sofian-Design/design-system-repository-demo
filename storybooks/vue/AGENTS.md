# Vue Storybook Workspace Guidelines

This workspace inherits the repository root and `storybooks/AGENTS.md` guidance. Use it to document Vue 3 adapters while reusing shared tokens, helpers, and documentation structure from the React workspace.

- Configure Storybook with the Vue 3 renderer powered by Vite so aliases, addons, and preview tooling match the React and Angular setups.
- Import shared utilities (for example `ensureButtonStyles()` and theming helpers) from `src/` instead of re-creating CSS or tokens locally.
- Load `src/styles/index.css` from the workspace preview to guarantee fonts and global theming utilities are available to stories.
- Capture any Vue-specific requirements, caveats, or follow-up work in this file to keep cross-framework parity visible.

## Functional Changes
- 1.3.0: Introduced the Vue Storybook workspace with shared theming, configuration, and placeholder button stories.
- 1.3.1: Added CORS headers to the Vite dev server so React can consume the Vue ref without sidebar errors.
