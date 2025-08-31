# Figma Icon Exporter (Demo)
Ideal setup to handle assets export from Figma 

- Figma Icon Exporter **[Documentation](https://sofian-design.github.io/fivra/)**
- Figma **[Plugin](https://www.figma.com/community/plugin/1533548616572213704/figma-icon-exporter)**
- Get **[Pro License](https://figma-icon-exporter.lemonsqueezy.com/buy/d7258c83-561d-496b-a1cc-33bd5ddb0b22)**

## React Icon Component

The repository includes a flexible React `Icon` component that renders icons from a map you provide. It supports React component icons, raw SVG strings, path data strings, and simple objects.

File: `src/components/Icon.tsx:1`

Example usage:

```tsx
import React from 'react';
import Icon from './src/components/Icon';

// Build a map from your `src/icons` directory
// Values can be:
// - React components (e.g. from SVGR)
// - Strings with SVG path data ("M0 0 ...")
// - Objects like { paths: ["M..."], viewBox: "0 0 24 24" }

const icons = {
  // Using variants (outline/solid)
  search: {
    // SearchOutline and SearchSolid are React components that render <svg>
    // e.g. created with SVGR from src/icons/outline/search.svg, src/icons/solid/search.svg
    // SearchOutline,
    // SearchSolid,
  },
  // Using a single path string
  circle: "M12 2a10 10 0 110 20 10 10 0 010-20z",
  // Using multiple paths
  square: { paths: ["M4 4h16v16H4z"], viewBox: "0 0 24 24" },
};

export default function Example() {
  return (
    <div>
      <Icon name="circle" icons={icons} size={24} color="#1e40af" variant="solid" />
      {/* <Icon name="search" icons={icons} variant="outline" size={24} /> */}
    </div>
  );
}
```

Notes:
- The component defaults to `size="1em"` and `color="currentColor"`.
- When `variant="outline"`, it uses `stroke: currentColor; fill: none` by default.
- When `variant="solid"`, it uses `fill: currentColor` by default.
- If you pass raw `<svg>` markup as a string, it is injected via `dangerouslySetInnerHTML` and sized via the wrapper element.

### Auto-generated icons map

- Script: `scripts/generate-icons-map.mjs:1`
- Generates: `src/icons.generated.ts:1`
- Source folders: `src/icons/outline` and `src/icons/solid`

Run generation:

```
npm run generate:icons
```

The `Icon` component imports the generated map by default. You can still pass a custom `icons` map prop to override or extend it.
