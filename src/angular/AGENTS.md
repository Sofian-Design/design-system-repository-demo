# Angular Package Guidelines

This directory extends the repository root guidance. Components here wrap the shared design system primitives so Angular apps ca
n share styling and accessibility behavior with the React and web component targets.

- Author Angular modules/components with `ChangeDetectionStrategy.OnPush` to match the perf characteristics of other adapters.
- Reuse the shared tokens and style helpers under `src/components/` instead of duplicating CSS.
- Mirror behavioral and API updates across Angular, React, and web component implementations in the same change.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.8.0: Added the Angular workspace with the button module/directives and packaging configuration for `ng-packagr` builds.
- 1.8.1: Promoted `src/angular/button/button.styles.ts` to the canonical style source and updated path aliases so other frameworks reuse it without symlinks.
- 1.8.2: Kept the canonical button styles under `src/angular/button` while exporting them through the `@components` alias for cross-framework parity.
- 1.8.3: Inlined the button color-mix helper so Angular builds no longer rely on a `src/angular/styles` symlink.
