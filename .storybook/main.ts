import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook configuration (TypeScript) for a React + Vite setup.
 * Uses Storybook 9 framework packages.
 */

const storybookDir = dirname(fileURLToPath(import.meta.url));

const resolveAliasPath = (relativePath: string) =>
  resolve(storybookDir, relativePath);

const getRefMode = () => {
  const explicitMode = process.env.STORYBOOK_REF_MODE;
  if (explicitMode === "static" || explicitMode === "dev") {
    return explicitMode;
  }

  return process.env.NODE_ENV === "production" ? "static" : "dev";
};

const refMode = getRefMode();
const isStaticRefMode = refMode === "static";

const parseEnvToggle = (value: string | undefined, defaultValue: boolean) => {
  if (value === undefined) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (["false", "0", "off", "no"].includes(normalized)) {
    return false;
  }
  if (["true", "1", "on", "yes"].includes(normalized)) {
    return true;
  }

  return defaultValue;
};

const composeAngular = parseEnvToggle(
  process.env.STORYBOOK_COMPOSE_ANGULAR,
  true,
);
const composeVue = parseEnvToggle(process.env.STORYBOOK_COMPOSE_VUE, true);

const angularDevUrl =
  process.env.STORYBOOK_ANGULAR_URL ?? "http://localhost:6007"; // Override STORYBOOK_ANGULAR_URL to point at a remote Angular Storybook.
const vueDevUrl =
  process.env.STORYBOOK_VUE_URL ?? "http://localhost:6008"; // Override STORYBOOK_VUE_URL to point at a remote Vue Storybook.
const angularStaticUrl =
  process.env.STORYBOOK_ANGULAR_STATIC_URL ?? "./angular";
const vueStaticUrl = process.env.STORYBOOK_VUE_STATIC_URL ?? "./vue";

export const refs: StorybookConfig["refs"] = {
  ...(composeAngular
    ? {
        angular: {
          title: "Angular",
          url: isStaticRefMode ? angularStaticUrl : angularDevUrl,
        },
      }
    : {}),
  ...(composeVue
    ? {
        vue: {
          title: "Vue",
          url: isStaticRefMode ? vueStaticUrl : vueDevUrl,
        },
      }
    : {}),
};

const config: StorybookConfig = {
  stories: [
    "../docs/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  refs,
  async viteFinal(config, { configType }) {
    const resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        "@components": resolveAliasPath("../src/components"),
        "@web-components": resolveAliasPath("../src/web-components"),
        "@shared": resolveAliasPath("../src/shared"),
        "@styles": resolveAliasPath("../src/styles"),
      },
    };

    // Use relative base only for production builds (Pages). Keep dev defaults.
    if (configType === "PRODUCTION") {
      return {
        ...config,
        base: "./",
        resolve,
        plugins: [
          ...(config.plugins || []),
          {
            name: "sb-ghpages-fix-absolute-vite-inject",
            transformIndexHtml(html) {
              return html.replace(
                /src="\/vite-inject-mocker-entry\.js"/g,
                'src="./vite-inject-mocker-entry.js"'
              );
            },
          },
        ],
      };
    }
    // Strengthen file watching for Windows/VM/network drives
    return {
      ...config,
      resolve,
      server: {
        ...(config.server || {}),
        watch: {
          // polling improves reliability on some environments
          usePolling: true,
          interval: 200,
        },
      },
    };
  },
};

export default config;
