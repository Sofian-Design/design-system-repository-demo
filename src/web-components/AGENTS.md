# Web Components Guidelines

This directory extends the repository and `src/components/` guidance for custom elements.

- Keep custom element classes framework-agnostic and avoid importing React-specific utilities.
- Mirror property/attribute changes across React wrappers and Storybook stories when behavior changes.
- Update the "Functional Changes" log below whenever a web component gains new capabilities.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Registered the `<fivra-button>` custom element that mirrors the shared Button styles and attributes.
- 1.0: Ensured `defineDesignSystemElements` explicitly imports `defineFivraButton` to support isolated DTS builds.
- 1.0: Synced injected button styles with tokenized variables so the custom element reflects theme spacing, colors, and focus states.
- 1.2.0: Synced icon-only, dropdown, loading, and tertiary variant behavior with the React adapter, including new data attributes and ARIA forwarding.
- 1.2.1: Added overlay mix regression tests to ensure brand versus neutral button states stay aligned with the React implementation.
- 1.3.0: Synced primary halo custom properties to weight hover, active, and focus glows toward the accent color by default, mirroring the React implementation.
- 1.3.1: Repointed the button element to consume the shared Angular-owned style module so all frameworks share the same tokens.
- 1.3.2: Updated the button element to import styles from `@components/Button/button.styles`, which now re-exports the Angular module for cross-framework reuse.
