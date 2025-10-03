# Documentation Guidelines

This document augments the root `AGENTS.md`. Ensure you understand the repository-wide policies before contributing to `docs/`.

## Content Expectations
- Keep documentation synchronized with component and tooling changes, highlighting cross-framework considerations and migration steps.
- Use concise, task-oriented sections with code snippets that reflect the current implementations in React, Web Component, and upcoming frameworks.
- When documenting icons or shared assets, reference the canonical icon pipeline and note any framework-specific usage.

## Multi-Framework Support
- Provide guidance for integrating components and scripts in each supported framework, flagging any deviations or caveats.
- Update testing and Storybook sections to describe how contributors validate behavior across frameworks.
- Maintain versioned change logs that record how features evolve for different framework targets.

## Review Checklist
- Follow root standards for accuracy, tone, and completeness.
- Whenever documentation reflects a behavior change in code, append a "Functional Changes" note in the associated change record (commit or PR) summarizing the user-facing impact.
- Cross-link relevant component stories, scripts, and architectural docs to help teams adopt multi-framework patterns.
- Mirror the repository release workflow by noting which Changeset entry triggered a documentation update and referencing the resulting version bump recorded in directory `AGENTS.md` files.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Documented the new Button component, including React usage and custom element registration steps.
- 1.0: Ensured Storybook pulls overview and integration MDX pages from `docs/` for sidebar visibility.
- 1.0: Documented the theme token workflow, runtime helpers, and data-attribute switching strategy.
- 1.1.0: Added documentation for the Changesets release pipeline, the `yarn changeset` authoring flow, and the AGENTS verification guard.
- 1.2.0: Updated Button reference materials with tertiary styling, icon-only guidance, and loading/dropdown documentation.
- 1.3.0: Documented percent-based intensity helpers and neutral state-layer sources for generated themes.
- 1.4.0: Added guidance for bundling Google Sans fonts via the shared typography assets.
- 1.8.0: Documented Angular consumption patterns for the Button component alongside existing React and web component usage.
- 1.9.0: Captured the multi-framework Storybook composition model, including build orchestration and local dev commands.
- 1.10.0: Documented the `yarn storybook` workflow and remote ref overrides.
- 1.11.0: Clarified that `yarn storybook` waits for Angular/Vue dev servers before composing the React manager.
