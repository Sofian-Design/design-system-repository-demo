import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/vue3-vite";

/**
 * Storybook configuration for the Vue workspace using the Vite renderer.
 * Mirrors the React and Angular setups so aliases, addons, and production tweaks stay aligned.
 */
const storybookDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(storybookDir, "../../..");

const resolveFromRoot = (relativePath: string) => resolve(repoRoot, relativePath);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-designs"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const resolveConfig = {
      ...(config.resolve ?? {}),
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@components": resolveFromRoot("src/components"),
        "@web-components": resolveFromRoot("src/web-components"),
        "@shared": resolveFromRoot("src/shared"),
        "@styles": resolveFromRoot("src/styles"),
      },
    };

    const existingCors = config.server?.cors;
    const corsConfig =
      typeof existingCors === "object" && existingCors !== null
        ? {
            ...existingCors,
            origin: true,
            credentials: true,
          }
        : {
            origin: true,
            credentials: true,
          };

    const serverConfig = {
      ...(config.server ?? {}),
      headers: {
        ...(config.server?.headers ?? {}),
        "Access-Control-Allow-Origin": "http://localhost:6006",
        "Access-Control-Allow-Credentials": "true",
      },
      cors: corsConfig,
    };

    if (configType === "PRODUCTION") {
      return {
        ...config,
        base: "./",
        resolve: resolveConfig,
        server: serverConfig,
        plugins: [
          ...(config.plugins ?? []),
          {
            name: "sb-ghpages-fix-absolute-vite-inject",
            transformIndexHtml(html) {
              return html.replace(
                /src="\/vite-inject-mocker-entry\.js"/g,
                'src="./vite-inject-mocker-entry.js"',
              );
            },
          },
        ],
      };
    }

    return {
      ...config,
      resolve: resolveConfig,
      server: {
        ...serverConfig,
        watch: {
          usePolling: true,
          interval: 200,
        },
      },
    };
  },
};

export default config;
