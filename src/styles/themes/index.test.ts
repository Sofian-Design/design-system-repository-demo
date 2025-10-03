import { describe, expect, it } from 'vitest';

import {
  FIVRA_THEME_ATTRIBUTE,
  applyDesignTokenTheme,
  clearDesignTokenTheme,
  designTokenManifest,
  designTokenThemes,
  getDefaultDesignTokenTheme,
  getDesignTokenThemeBySlug,
} from './index';

describe('design token themes', () => {
  it('exposes generated theme metadata', () => {
    expect(designTokenManifest.themeAttribute).toBe(FIVRA_THEME_ATTRIBUTE);
    expect(designTokenThemes.length).toBeGreaterThan(0);
    expect(getDefaultDesignTokenTheme().isDefault).toBe(true);
    expect(designTokenThemes.map((theme) => theme.slug)).toMatchInlineSnapshot(`
      [
        "engage",
        "legacy",
      ]
    `);
  });

  it('applies and clears theme attributes without throwing', () => {
    const legacyTheme = designTokenThemes.find((theme) => !theme.isDefault);
    expect(legacyTheme).toBeTruthy();

    const target = document.createElement('div');

    const applied = applyDesignTokenTheme(target, legacyTheme!.slug);
    expect(applied.slug).toBe(legacyTheme!.slug);
    expect(target.getAttribute(FIVRA_THEME_ATTRIBUTE)).toBe(legacyTheme!.slug);

    clearDesignTokenTheme(target);
    expect(target.hasAttribute(FIVRA_THEME_ATTRIBUTE)).toBe(false);
    expect(getDesignTokenThemeBySlug(legacyTheme!.slug)).toBe(legacyTheme);
  });
});
