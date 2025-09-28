# Components Directory Guidelines

This document extends the root-level `AGENTS.md`. All contributors must read and comply with the repository-wide policies before working in `src/components/`.

## Structural Expectations
- Organize components into self-contained folders that include implementation, styles, tests, and co-located README snippets when necessary.
- Favor composition and hooks over inheritance. Keep props strictly typed and document public APIs through TypeScript interfaces.
- Maintain accessibility semantics (ARIA, focus management) and ensure parity between React, Web Component, and future framework targets.

## Multi-Framework Support
- Implement framework-agnostic core logic in shared modules so React, Web Component, and upcoming framework adapters can reuse it.
- When adding new components, provide a clear adapter layer to support Storybook stories in multiple frameworks.
- Verify icon usage through the central icon pipeline to guarantee assets work across frameworks.
- Add or update tests for each supported framework target. Coordinate with `src/stories/` to confirm example coverage in Storybook.

## Review Checklist
- Reference the root guidelines for testing, documentation, and architectural decisions.
- Whenever code behavior changes, append a "Functional Changes" note to the commit description or PR summary covering `src/components/` modifications.
- Update corresponding documentation in `docs/` and stories under `src/stories/` when component APIs or visuals shift.

## Functional Changes
- 2025-09-25: Added the shared Button implementation (React + web component) with reusable styling primitives.
- 2025-10-02: Button and Icon now consume theme tokens for layout, color, and state styling; Storybook docs updated accordingly.
