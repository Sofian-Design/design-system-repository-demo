# Tokens Overview

This directory stores raw exports from Tokens Studio that feed the Style Dictionary build pipeline. The exports are organized as follows:

- `$themes.json`: Master theme manifest produced by Tokens Studio. It maps semantic theme names (for example, Engage and Legacy) to token sets and metadata consumed by downstream tooling.
- `Internals/Engage.json`: Source tokens for the Engage theme. These values represent the actively supported design language for new product work.
- `Internals/Legacy.json`: Source tokens for the Legacy theme. They provide compatibility for products that have not migrated to Engage yet.
- `Externals/`: Reserved for vendor-facing or shared exports that mirror the Tokens Studio structure. Populate this directory only when those token groups are introduced upstream.

## Refreshing Exports from Tokens Studio
1. Open the Fivra workspace in Tokens Studio and ensure the Engage and Legacy token sets are up to date.
2. Use the "Export" workflow to generate JSON outputs for `$themes.json` and each token set under `Internals/` (and `Externals/` when applicable).
3. Replace the corresponding files in this directory with the newly exported JSON files. Avoid manual edits so checksums remain trustworthy for automation.
4. Update this README and the local `AGENTS.md` if the export structure (file names, folder organization, or theme coverage) changes.
5. Record the refresh in the `Functional Changes` log inside `src/tokens/AGENTS.md`, including a summary of what changed and any validation performed.

## Style Dictionary Preprocessing Assumptions
- The build expects the Engage and Legacy themes to be declared in `$themes.json` with keys matching the file names inside `Internals/`.
- Tokens are stored in raw Tokens Studio format. Style Dictionary scripts handle normalization, naming conversions, and platform-specific transforms during the build.
- New token categories should use the same naming conventions (PascalCase groupings with slash-delimited paths) so the preprocessing scripts can infer semantic groupings without additional configuration.
- Any new themes or token sets must be added to the Style Dictionary configuration before running `yarn build`, otherwise the pipeline will omit them.
