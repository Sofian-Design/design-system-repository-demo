/**
 * Storybook configuration (ESM) for a React + Vite setup.
 * Uses Storybook 8 framework packages.
 */

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    // Ensure assets use relative URLs so Storybook works under GitHub Pages subpaths.
    return { ...config, base: "./" };
  },
};

export default config;
