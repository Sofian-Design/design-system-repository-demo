# Button Component Guidelines

This directory follows the repository and `src/components/` standards. Keep shared logic (styles, tokens, accessibility helpers) framework-agnostic so React, web components, and future adapters stay in sync.

- Prefer data attributes over brittle class name selectors when syncing styles between frameworks.
- Mirror any API changes in the accompanying Storybook stories, tests, and documentation during the same change.
- Update the "Functional Changes" section below with a short note when behavior or public API changes.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Initial `Button` component authored as both a React component and custom element with shared styling.
- 1.0: Button styling variables now map directly to Engage/Legacy design tokens (backgrounds, states, spacing, radii, icon sizes).
- 1.2.0: Added the tertiary variant, icon-only/dropdown/loading affordances, and explicit token-aligned spacing across implementations.
- 1.2.1: Corrected radius scaling, loading-state colors, and the custom element preview to match the updated button contract.
- 1.3.0: State layers now derive from accent-driven `color-mix()` overlays with documented semantic overrides in Storybook.
- 1.4.0: Added per-variant overlay custom properties that weight neutral variants toward their accent color and documented/tested the behavior across React and web components.
- 1.5.0: Introduced halo custom properties for hover, active, and focus states to deliver consistent glow styling across implementations.
- 1.5.1: Primary hover halo now targets the layer mix to align with the hover background weighting across implementations.
- 1.6.0: Defaulted the button font family to the generated body token so React and web component builds use Google Sans.
- 1.7.0: Updated primary button halos to weight hover, active, and focus glows toward the accent color by default.
- 1.8.0: Added the Angular adapter (component + directives + module) with parity tests and packaging support.
- 1.8.1: Pointed React exports to the Angular-owned button style module so all frameworks share the same source without symlinks.
- 1.8.2: Added a components-level barrel that re-exports the Angular-owned button styles via `@components/Button/button.styles` so every adapter shares the same import path.
- 1.8.3: Pointed the shared tests at the canonical Angular button styles to cover the inlined color-mix helper.
- 1.8.4: Updated Button stories to import `Meta`/`StoryObj` from `@storybook/react-vite` so typings match the composed framework.
