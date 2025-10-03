import "zone.js";
import "../../../src/styles/index.css";
import type { Preview } from "@storybook/angular";
import {
  applyDesignTokenTheme,
  clearDesignTokenTheme,
  designTokenManifest,
  getDefaultDesignTokenTheme,
} from "@styles/themes";

const DESIGN_TOKEN_LOG_PREFIX = "[Storybook][Design Tokens]";
const SAMPLE_THEME_VARIABLES = [
  "--radiusMax",
  "--spacingS",
  "--backgroundPrimaryInteractive",
] as const;

const shouldLogDesignTokenStatus = () =>
  typeof window !== "undefined" &&
  (typeof process === "undefined" || process.env?.NODE_ENV !== "production");

const logDesignTokenStatus = (slug: string) => {
  if (!shouldLogDesignTokenStatus() || typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;
  const computedStyles = window.getComputedStyle(root);
  const missingVariables = SAMPLE_THEME_VARIABLES.filter((variable) => {
    const value = computedStyles.getPropertyValue(variable).trim();
    return value.length === 0;
  });

  if (missingVariables.length > 0) {
    console.warn(
      `${DESIGN_TOKEN_LOG_PREFIX} Missing CSS custom properties for the "${slug}" theme.`,
      { missingVariables },
    );
    return;
  }

  const sampleValues = SAMPLE_THEME_VARIABLES.reduce<Record<string, string>>((values, variable) => {
    values[variable] = computedStyles.getPropertyValue(variable).trim();
    return values;
  }, {});

  console.info(
    `${DESIGN_TOKEN_LOG_PREFIX} Applied the "${slug}" theme with resolved variables.`,
    sampleValues,
  );
};

const defaultTheme = getDefaultDesignTokenTheme();

type ThemeSlug = (typeof designTokenManifest.themes)[number]["slug"];
type StoryFn = () => unknown;
type StoryContext = { globals: Record<string, unknown> };

const withDesignTokenTheme = (story: StoryFn, context: StoryContext) => {
  const slug = (context.globals.theme as ThemeSlug | undefined) ?? defaultTheme.slug;

  if (typeof document !== "undefined") {
    clearDesignTokenTheme(document);
    const theme = applyDesignTokenTheme(document, slug);
    logDesignTokenStatus(theme.slug);
  }

  return story();
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Select the design token theme applied to stories.",
      defaultValue: defaultTheme.slug,
      toolbar: {
        icon: "paintbrush",
        dynamicTitle: true,
        items: designTokenManifest.themes.map((theme) => ({
          value: theme.slug,
          title: theme.name,
        })),
      },
    },
  },
  decorators: [withDesignTokenTheme as unknown as any],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Docs", ["Welcome", "*"], "Components", "Gallery", "*"],
      },
    },
  },
};

export default preview;
