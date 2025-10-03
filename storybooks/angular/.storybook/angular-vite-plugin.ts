import type { Plugin } from "vite";

type AngularPluginFactory = (options: { tsconfig: string }) => Plugin;

type MaybeAngularModule = { default?: AngularPluginFactory } | AngularPluginFactory;

const isModuleNotFound = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  return code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND";
};

const asFactory = (module: MaybeAngularModule): AngularPluginFactory => {
  if (typeof module === "function") {
    return module as AngularPluginFactory;
  }

  if (module && typeof module === "object" && typeof module.default === "function") {
    return module.default as AngularPluginFactory;
  }

  throw new Error("Angular Vite plugin module did not export a factory function.");
};

export const loadAngularPlugin = async (): Promise<AngularPluginFactory> => {
  try {
    const angularModule = (await import("@angular-devkit/build-angular/plugins/vite")) as MaybeAngularModule;
    return asFactory(angularModule);
  } catch (error) {
    if (!isModuleNotFound(error)) {
      throw error;
    }
  }

  const analogModule = (await import("@analogjs/vite-plugin-angular")) as MaybeAngularModule;
  return asFactory(analogModule);
};
