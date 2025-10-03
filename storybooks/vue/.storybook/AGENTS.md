# Vue Storybook Configuration Guidelines

This directory inherits the repository root, `storybooks/AGENTS.md`, and `storybooks/vue/AGENTS.md` standards. Keep Vue-specific configuration aligned with the React and Angular workspaces while targeting the Vue 3 renderer.

- Write configuration in TypeScript with explicit `StorybookConfig` typings from `@storybook/vue3-vite`.
- Mirror addon registration, Vite aliasing, and production tweaks from the other workspaces to keep shared imports working.
- Document configuration changes here when they affect Vue consumers or deployment behavior.

## Functional Changes
- 1.3.0: Added Vue Storybook configuration powered by `@storybook/vue3-vite` with shared aliases and theming support.
- 1.3.2: Enabled credentialed CORS handling in the Vite dev server without overriding Storybook defaults.
