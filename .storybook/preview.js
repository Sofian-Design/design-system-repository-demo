/**
 * Global Storybook parameters and decorators for React stories.
 */

/** @type { import('@storybook/react').Preview } */
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  options: {
    storySort: {
      order: [
        'Docs',
        ['Welcome', '*'],
        'Components',
        'Gallery',
        '*',
      ],
    },
  },
};
