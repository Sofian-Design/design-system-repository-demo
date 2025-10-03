# Repository Guidelines

## Project Goals
- Maintain a cohesive design system that delivers reusable, accessible UI primitives and documentation for Fivra products.
- Prioritize developer experience and consistent visual language across libraries, demos, and documentation.
- Ensure each change preserves design tokens, component contracts, and cross-platform parity.

## Coding and Documentation Standards
- Follow TypeScript best practices with strict typing and descriptive naming. Avoid implicit `any` and prefer composable, well-documented modules.
- Preserve accessibility considerations (ARIA attributes, keyboard interaction) in every component. Provide regression-safe tests when functionality changes.
- Update or add unit and visual regression tests when altering component behavior, APIs, or styles.
- Document noteworthy code paths with succinct comments when intent is non-obvious. Keep documentation in `docs/` aligned with implementation changes.

## AGENTS Governance
- Every directory that contains source files must include its own `AGENTS.md` outlining any additional or overriding rules.
- When creating a new directory, add an `AGENTS.md` that explicitly references this root file and describes any directory-specific expectations.
- Keep child `AGENTS.md` files synchronized with root policies. If root standards change, review and update descendant instructions accordingly.
- Record all functional or behavioral changes in the relevant directory-level `AGENTS.md` under a "Change Log" or similar section.
- Run `yarn changeset` to capture a summary and proposed semver bump for every PR that changes behavior or tooling.
- Record the resulting version increment in the directory-specific `AGENTS.md` (see the verification guard below).
- Run `yarn generate:icons` then run `yarn build`.
- Always make sure `yarn build` is ✅ successful before marking the task as completed.
- Always make sure `yarn test` has ✅ passed before marking the task as completed.
- After applying version changes locally, rerun `yarn build` and `yarn test` to confirm the repository still compiles and the suite passes.
- `yarn verify:agents` (invoked by CI) must succeed; ensure each modified directory's `AGENTS.md` adds a new semantic-version bullet describing the change.

## Key Documentation References
- Tech stack details live in `docs/tech-stack.md`.
- Component architecture guidance is maintained in `docs/component-architecture.md`.
- Product overview and integration guides reside under `docs/overview/` and `docs/integrations/` respectively.
- When implementing features that alter technology choices, architectural boundaries, integration contracts, or documented component behavior, update the corresponding documents alongside your code changes.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Introduced the Button component with shared React and web component implementations plus associated documentation.
- 1.0: Established tokens governance in `src/tokens/` (see the new `AGENTS.md` and README) and verified repository health with `yarn test` and `yarn build`.
- 1.0: Added a Style Dictionary + Tokens Studio transform workflow; run `yarn generate:tokens` to refresh theme CSS before builds.
- 1.0: Scoped generated Engage/Legacy CSS to `data-fivra-theme`, added theme helpers/tests, and wired `yarn generate:tokens` into build + Storybook hooks.
- 1.1.0: Documented the Changesets-powered release workflow, required `yarn changeset` for feature work, and enforced semantic-version bullets via `scripts/verify-agents-version.mjs`.
- 1.1.1: Added a compose-friendly React Storybook script, refreshed README guidance, and noted the tooling alignment.

