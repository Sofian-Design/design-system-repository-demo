# Angular Button Guidelines

This directory follows the repository, `src/components/`, and `src/angular/` standards. Keep the Angular adapter in parity with t
he shared button behavior and styling.

- Rely on `ensureButtonStyles()` from `@components/Button/button.styles` so CSS stays centralized without duplicating logic.
- Keep DOM structure, data attributes, and ARIA behavior aligned with the React and web component implementations.
- Update accompanying tests and documentation when adjusting the Angular API or markup.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.8.0: Added the Angular button component, directives, module, and test suite matching the shared button contract.
- 1.8.2: Re-exported the Angular button styles through `@components/Button/button.styles` so the React and web component adapters share the same module.
- 1.8.3: Inlined the color-mix helper within the Angular button styles to drop the `src/angular/styles` symlink dependency.
