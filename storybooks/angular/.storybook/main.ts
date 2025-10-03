import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadAngularPlugin } from "./angular-vite-plugin";
import type { StorybookConfig } from "@storybook/angular";

/**
 * Storybook configuration for the Angular workspace using the Vite builder.
 * Mirrors the React and Vue setups so aliases, addons, and production tweaks stay aligned.
 */
const storybookDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(storybookDir, "../../..");
const angularWorkspaceRoot = resolve(storybookDir, "..");

const resolveFromRoot = (relativePath: string) => resolve(repoRoot, relativePath);

const storybookConfig: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-designs"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(viteConfig, options) {
    const { configType } = options;
    const angular = await loadAngularPlugin();
    const angularPlugin = angular({
      tsconfig: resolveFromRoot("storybooks/angular/tsconfig.storybook.json"),
    });

    const angularFrameworkOptions = (
      (options?.framework?.options ??
        storybookConfig.framework?.options ??
        {}) as Record<string, unknown>
    );

    const resolveConfig = {
      ...(viteConfig.resolve ?? {}),
      alias: {
        ...(viteConfig.resolve?.alias ?? {}),
        "@components": resolveFromRoot("src/components"),
        "@web-components": resolveFromRoot("src/web-components"),
        "@shared": resolveFromRoot("src/shared"),
        "@styles": resolveFromRoot("src/styles"),
        "@internal/angular": resolveFromRoot("src/angular"),
      },
    };

    const allowList = Array.from(
      new Set([
        ...(viteConfig.server?.fs?.allow ?? []),
        resolveFromRoot("src"),
        angularWorkspaceRoot,
      ]),
    );

    const existingCors = viteConfig.server?.cors;
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
      ...(viteConfig.server ?? {}),
      headers: {
        ...(viteConfig.server?.headers ?? {}),
        "Access-Control-Allow-Origin": "http://localhost:6006",
        "Access-Control-Allow-Credentials": "true",
      },
      cors: corsConfig,
      fs: {
        ...(viteConfig.server?.fs ?? {}),
        allow: allowList,
      },
    };

    const defineConfig = {
      ...(viteConfig.define ?? {}),
      STORYBOOK_ANGULAR_OPTIONS: JSON.stringify(angularFrameworkOptions),
    };

    if (configType === "PRODUCTION") {
      return {
        ...viteConfig,
        base: "./",
        define: defineConfig,
        resolve: resolveConfig,
        server: serverConfig,
        plugins: [
          ...(viteConfig.plugins ?? []),
          angularPlugin,
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
      ...viteConfig,
      define: defineConfig,
      resolve: resolveConfig,
      server: {
        ...serverConfig,
        watch: {
          usePolling: true,
          interval: 200,
        },
      },
      plugins: [...(viteConfig.plugins ?? []), angularPlugin],
    };
  },
};

export default storybookConfig;
