import {
  designTokenManifest,
  type DesignTokenTheme,
  type DesignTokenThemeName,
  type DesignTokenThemeSlug,
} from './tokens.generated';

export type { DesignTokenTheme, DesignTokenThemeName, DesignTokenThemeSlug };

export const FIVRA_THEME_ATTRIBUTE = designTokenManifest.themeAttribute;

const themesBySlug = new Map<DesignTokenThemeSlug, DesignTokenTheme>(
  designTokenManifest.themes.map((theme) => [theme.slug, theme]),
);

const themesByName = new Map<DesignTokenThemeName, DesignTokenTheme>(
  designTokenManifest.themes.map((theme) => [theme.name, theme]),
);

const defaultTheme =
  designTokenManifest.themes.find((theme) => theme.isDefault) ?? designTokenManifest.themes[0];

export const designTokenThemes = [...designTokenManifest.themes];

export const getDesignTokenThemeBySlug = (slug: DesignTokenThemeSlug) => themesBySlug.get(slug) ?? null;

export const getDesignTokenThemeByName = (name: DesignTokenThemeName) => themesByName.get(name) ?? null;

export const getDefaultDesignTokenTheme = () => defaultTheme;

export type DesignTokenThemeTarget = Element | Document | ShadowRoot;

const isShadowRoot = (value: unknown): value is ShadowRoot =>
  typeof ShadowRoot !== 'undefined' && value instanceof ShadowRoot;

const resolveTargetElement = (target: DesignTokenThemeTarget): Element => {
  if ('documentElement' in target) {
    return target.documentElement;
  }

  if (isShadowRoot(target)) {
    return target.host;
  }

  return target;
};

export const applyDesignTokenTheme = (
  target: DesignTokenThemeTarget,
  slug: DesignTokenThemeSlug = defaultTheme.slug,
) => {
  const theme = getDesignTokenThemeBySlug(slug);
  if (!theme) {
    throw new Error(`Unknown design token theme slug: ${slug}`);
  }

  const element = resolveTargetElement(target);
  element.setAttribute(FIVRA_THEME_ATTRIBUTE, theme.slug);
  return theme;
};

export const clearDesignTokenTheme = (target: DesignTokenThemeTarget) => {
  const element = resolveTargetElement(target);
  element.removeAttribute(FIVRA_THEME_ATTRIBUTE);
};

export const getDesignTokenThemeFor = (target: DesignTokenThemeTarget) => {
  const element = resolveTargetElement(target);
  const slug = element.getAttribute(FIVRA_THEME_ATTRIBUTE);

  if (!slug) {
    return defaultTheme;
  }

  const theme = themesBySlug.get(slug as DesignTokenThemeSlug);
  return theme ?? defaultTheme;
};

export { designTokenManifest };
