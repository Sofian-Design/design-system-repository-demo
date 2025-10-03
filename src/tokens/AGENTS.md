# Tokens Directory Guidelines

This document inherits all policies from the repository root `AGENTS.md`. Review those standards before working within `src/tokens/`.

## Design Token Exports
- Tokens Studio exports are stored verbatim in this directory. `$themes.json` aggregates theme metadata, while the `Internals/` folder contains source token collections (currently `Engage.json` and `Legacy.json`).
- `Internals/Engage.json` tracks the actively maintained Engage theme. `Internals/Legacy.json` preserves the historical baseline for migration references.
- Additional exports (for example, future `Externals/` packages) must document their purpose in this README and mirror the naming conventions established by Tokens Studio.

## Maintenance Expectations
- Keep the README in this directory updated whenever token hierarchies, theme naming, or export workflows change.
- Preserve file integrity for downstream automation: do not manually edit JSON exports—refresh them directly from Tokens Studio and note the update in the change log below.
- Coordinate with the Style Dictionary pipeline when introducing new token categories so preprocessing assumptions remain valid.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Established directory governance, documented Engage/Legacy exports, and recorded the initial Tokens Studio import; validated with `yarn test` and `yarn build`.
- 1.1.0: Updated font family tokens to default to Google Sans with sans-serif fallback and refreshed generated outputs.
