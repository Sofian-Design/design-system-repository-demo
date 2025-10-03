# Angular Stories Guidelines

This directory inherits guidance from the repository root, `storybooks/AGENTS.md`, and `storybooks/angular/AGENTS.md`. Author stories here using the Component Story Format while preserving parity with the React examples in `src/components/Button/Button.stories.tsx`.

- Import Angular modules from `src/angular` and shared helpers such as `ensureButtonStyles()` instead of duplicating CSS or tokens.
- Mirror the React args, controls, and documentation text so cross-framework regressions are easy to spot.
- Prefer inline `render` functions that showcase Angular templates and directives rather than bespoke wrapper components.

## Functional Changes
- 1.2.0: Added Angular Button stories that reuse shared styles and React-aligned controls.
