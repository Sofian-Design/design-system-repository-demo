# Storybook Authoring Guidelines

This guide supplements the repository root `AGENTS.md`. Review the root standards first, then apply the Storybook-specific practices below when working in `src/stories/`.

## Story Structure
- Write stories using the Component Story Format (CSF 3) with typed meta definitions to ease multi-framework consumption.
- Provide controls and accessibility scenarios that highlight framework-specific nuances without duplicating logic.
- Keep stories colocated with the components they exercise, referencing shared configuration where possible.

## Multi-Framework Support
- Create parallel stories or framework toggles when React, Web Component, or upcoming framework implementations diverge.
- Ensure stories demonstrate how to load icons and other assets via the shared icon pipeline.
- Coordinate with component authors to keep args, play functions, and regression tests aligned across frameworks.

## Review Checklist
- Follow root testing and documentation requirements; sync changes with `src/components/` and `docs/` as needed.
- When story adjustments reflect functional behavior changes, append a "Functional Changes" note in the associated change documentation (commit or PR) describing the behavior impact.
- Validate stories in all supported frameworks before merging.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Added Button stories covering React usage, variants, sizes, icons, and responsive layouts.
- 1.1.0: Migrated shared story typings to `@storybook/react-vite` following the Storybook 9 automigration.
