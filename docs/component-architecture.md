# Component Architecture Strategy

## Current Icon Implementation Audit
The existing React `Icon` component is a flexible renderer that accepts multiple source formats (React components, React elements, inline SVG strings, or declarative path definitions) and normalizes variant aliases such as `fill`/`solid` and `stroke`/`outline`. It also forwards accessibility attributes, converts numeric `size` values to pixel strings, and falls back to a default `viewBox` when one is not provided. Runtime checks log warnings for missing or unsupported icon entries in development builds, and the component handles both inline SVG rendering and sanitized string injection via `dangerouslySetInnerHTML` for prebuilt markup.【F:src/components/Icon.tsx†L1-L147】

While this implementation is ergonomic for React, several behaviors are React-specific:

- Reliance on `forwardRef`, `cloneElement`, and JSX composition prevents direct reuse in other frameworks.
- Accessibility defaults (automatic `role`, `aria-*` inference) rely on React's prop merging semantics.
- Variant selection is encoded in TypeScript types, which would need framework-agnostic schemas to be shared across implementations.

These characteristics make `Icon` a good candidate for a framework-agnostic core (handling icon registry, normalization, variant resolution) paired with thin framework adapters that map props/events into the conventions of React, Angular, or Vue.

## Component Categorization Approach
To determine whether a component should be authored as a web component or framework module, evaluate the following dimensions:

1. **Statefulness & Lifecycle Complexity** – Components with minimal internal state (e.g., icons, avatars, badges) fit well as web components; those depending on framework-specific lifecycle hooks, context APIs, or reactivity systems (e.g., complex forms, data tables) should use framework modules.
2. **Theming Requirements** – Components driven by design tokens and CSS custom properties can be shared as web components. Components that require deep integration with framework theming APIs (e.g., CSS-in-JS, Angular CDK overlays) should provide framework wrappers.
3. **Accessibility Patterns** – If ARIA patterns can be fully expressed in HTML and custom element semantics, use web components. Components needing programmatic focus management tied to framework routers or portals may require framework implementations.
4. **Performance & Bundle Size** – Highly reused primitives (buttons, icons) should avoid duplicated logic across frameworks by leaning on web components. Heavy components that can benefit from tree-shaking within a framework ecosystem can remain framework-specific.

## Design Principles
- **Single Source of Truth:** Define design tokens, motion curves, and shared logic in a framework-agnostic core to avoid drift.
- **Progressive Enhancement:** Web components should render meaningful HTML/CSS by default and layer on interactivity where necessary.
- **Adapter Pattern:** Provide thin React/Angular/Vue wrappers that translate props, slots, and events to the custom element interface.
- **Strict Separation of Concerns:** Keep styling (CSS custom properties, shadow DOM) independent from data logic; do not embed application-specific behavior in shared components.
- **Accessible by Design:** Bake ARIA roles, labels, focus management, and keyboard interactions into the base component implementations.
- **Composable & Extensible:** Expose slot names and prop hooks that allow host frameworks to extend behavior without forking.

## Multi-Framework Storybook Composition
- The React workspace under `.storybook/` owns the primary manager and registers framework refs. Angular and Vue live in `storybooks/<framework>/.storybook` and expose their own build outputs.
- Development: run `yarn storybook` to launch all three workspaces together. Angular (6007) and Vue (6008) boot first, and the
  script waits for them to report ready before starting the React manager on 6006 so the refs declared in `.storybook/main.ts`
  resolve to live dev servers when `STORYBOOK_REF_MODE=dev`. Override `STORYBOOK_ANGULAR_URL` or `STORYBOOK_VUE_URL` when pointing
  at remote builds.
- Static hosting: `yarn build-storybook` chains the Angular/Vue builds, runs the React build with `STORYBOOK_REF_MODE=static`, and copies the generated assets into `storybook-static/{angular,vue}` via `scripts/copy-storybook-refs.mjs`. The manager relies on the exported `refs` configuration so GitHub Pages (or any static host) serves the composed bundles without extra configuration.
- Adding a new framework Storybook:
  1. Scaffold `storybooks/<framework>/.storybook/` with its own `main.ts` and `preview` configuration.
  2. Add `storybook:<framework>` and `build-storybook:<framework>` scripts that mirror the Angular/Vue setup, assigning a unique dev port.
  3. Update `.storybook/main.ts` to append a ref with a nested `title` (e.g., `React`, `Angular`, `Vue`), and extend `scripts/copy-storybook-refs.mjs` to recognise the new id.
  4. Document the workflow in `README.md`, `docs/tech-stack.md`, and the relevant `AGENTS.md` files so contributors know how to launch and host the additional workspace.

## Lifecycle Constraints
- **Web Components:** Avoid storing framework-managed state inside custom elements; instead, accept attributes/properties and emit standard DOM events. Use `connectedCallback`/`disconnectedCallback` only for DOM subscriptions and keep render updates idempotent.
- **React:** Prefer functional components with hooks, derive state from props, and avoid custom DOM mutation in favor of React refs. When wrapping web components, use `useEffect` to bridge attribute/property updates.
- **Angular:** Implement Angular components/directives that wrap custom elements, ensuring change detection via `ChangeDetectionStrategy.OnPush`. Use Angular services only within Angular-specific modules.
- **Vue:** Provide single-file component (SFC) wrappers that map props and `v-on` listeners to custom element APIs. Use `defineCustomElement` only when full Vue lifecycle is required.

## Theming & Accessibility Requirements
- Maintain design tokens via the Tokens Studio export consumed by `scripts/generate-design-tokens.mjs`; run `yarn generate:tokens` (or rely on `prebuild`/`prestorybook`) to regenerate `src/styles/themes/*.css` and the manifest before shipping changes.
- Engage tokens remain the default by scoping to `:root` in `src/styles/themes/engage.css`; alternative themes (e.g., `legacy`) apply when `data-fivra-theme='<slug>'` is present on a container.
- Import `src/styles/index.css` wherever global CSS is bundled so both Engage and Legacy layers are registered.
- Typography tokens resolve to `'Google Sans', sans-serif`; ensure `src/styles/fonts.css` (or the packaged `styles/fonts.css`) is bundled so the family is available at runtime.
- Generated themes expose state-layer helpers for blending effects. Every `--intensity…` token now has a `--intensity…Percent` companion that multiplies the decimal value by `100%`, and the script aliases `--stateLayerBrightenBase`/`--stateLayerDarkenBase` to the neutral backgrounds so each theme shares a consistent surface.
- Use `color-mix()` with the percent helpers to calculate component overlays. For example:

  ```css
  color-mix(
    in srgb,
    var(--stateLayerBrightenBase) var(--intensityBrandHoverPercent),
    var(--backgroundPrimaryBrand)
  );
  ```

- Use the helpers in `src/styles/themes/index.ts` (`applyDesignTokenTheme`, `clearDesignTokenTheme`, `FIVRA_THEME_ATTRIBUTE`) to toggle themes in React apps, web components, or tests instead of duplicating attribute management.
- Ensure every interactive component exposes ARIA labels, focus indicators, and keyboard shortcuts consistent across frameworks.
- Provide a theming guide that describes how to override CSS variables, including restrictions when Shadow DOM encapsulation is enabled.
- For frameworks with their own theming systems (e.g., Angular Material, Vue style bindings), document how to map design tokens into those systems while keeping the core CSS variables authoritative.

## Distribution Strategy
| Target | Packaging | Entry Points | Notes |
| --- | --- | --- | --- |
| Web Components | Build with Vite/Rollup bundling ES modules and type definitions. Publish as `@fivra/ds-web-components` with side-effect-free modules for tree-shaking. | `dist/web-components/index.js` | Include `defineCustomElements()` loader and CSS assets. |
| React | Provide both direct React components and wrappers around web components in `@fivra/ds-react`. Use Rollup/TSUP to emit CJS + ESM bundles with `.d.ts` files. | `dist/react/index.js` | Auto-register web components when needed, but prefer explicit `registerIcons()` APIs. |
| Angular | Ship Angular library via `ng-packagr` emitting Ivy-compatible partial compilation output. Wrap custom elements in Angular modules (`FivraIconModule`, etc.). | `dist/angular/index.mjs` | Document peer dependencies (`@angular/core`, `@angular/common`). |
| Vue | Use Vite/rollup to output Vue SFC wrappers and optionally Vue-based custom elements using `defineCustomElement`. | `dist/vue/index.mjs` | Provide plugin for global registration (`app.use(FivraDesignSystem)`). |

## Tooling Requirements
- **Shared Tooling:** TypeScript project references, ESLint, Prettier, Storybook (or Ladle) for component demos, and Style Dictionary (or Tokens Studio export) for design tokens.
- **Web Components:** Lit or vanilla TS + Rollup, open-wc testing, Playwright for visual regression.
- **React:** TSX support via TSUP/Vite, React Testing Library + Jest, Storybook stories that can mount either web components or React-specific implementations.
- **Angular:** `ng-packagr`, Jest or Karma with TestBed for unit tests, Cypress for integration when interacting with web components.
- **Vue:** Vite build, Vue Test Utils + Vitest, Cypress component testing for slots and reactivity.
- **CI/CD:** Use pnpm/yarn workspaces, Changesets for versioning, and automated semantic release pipelines that publish each package on merge.

## Guidelines to Minimize Lifecycle Complexity
- Keep business logic out of web components; expose events and let framework consumers handle complex state machines.
- Prefer stateless web components that accept fully computed data via attributes/properties; if internal state is necessary, guard updates with lightweight state containers rather than framework-specific stores.
- Use adapter utilities to translate between framework-specific props (e.g., React `className`, Angular `@Input`) and custom element attributes to avoid duplicated logic.
- Centralize DOM measurements or imperative behaviors in shared utilities invoked from framework wrappers, not directly inside render functions.
- Document a compatibility matrix for browser support, and polyfill only in consuming applications to prevent duplicate polyfills.

## Initial Component Roadmap
| Component | Recommended Implementation | Rationale | Dependencies / Shared Primitives |
| --- | --- | --- | --- |
| Icon | Web component core + React/Angular/Vue adapters | Mostly stateless, shared registry and variant normalization already exist in React; extract to framework-agnostic module. | Icon registry loader, design tokens for colors. |
| Button | Web component | High reuse, primarily stylistic; can expose slots for icon/label. | Focus ring utility, CSS variables for sizes, shared disabled-state logic. |
| Badge / Tag | Web component | Purely presentational with minimal interactivity. | Color token scale, typography tokens. |
| Avatar | Web component + adapters | Handles image fallback logic but minimal framework dependencies. | Image loader utility, skeleton primitive. |
| Tooltip | Framework-specific modules | Requires integration with portal/overlay systems and event lifecycles distinct per framework. | Positioning engine, focus trap utility. |
| Modal / Dialog | Hybrid: web component core with framework-controlled open state | Needs focus trapping and scroll lock; provide adapters for state management. | Overlay manager, accessibility utilities. |
| Form Field (Input, Select) | Framework-specific first, web component later | Must integrate with form bindings (`ngModel`, React controlled inputs, Vue v-model). | Validation messages, localization utilities. |
| Data Table | Framework-specific | Heavy state management (sorting, pagination) and virtualization needs per framework. | Data store abstraction, pagination controls. |
| Toast / Notification | Web component registry with framework service adapters | Rendered via DOM container but triggered via framework services. | Animation tokens, announcement utility. |
| Layout Grid | Web component | Mostly CSS-based; ensures consistent gutters across frameworks. | Responsive breakpoint tokens. |

This roadmap should be revisited quarterly as design priorities evolve and as the shared token infrastructure matures.
