const DEFAULT_COLOR_SPACE = 'srgb';

export const COLOR_MIX_SUPPORTS_DECLARATION =
  'color: color-mix(in srgb, #000 0%, #fff 100%)';

interface ColorMixOptions {
  layerColor: string;
  layerPercentage: string;
  accentColor: string;
  colorSpace?: string;
  weightTarget?: 'layer' | 'accent';
}

export function colorMix({
  layerColor,
  layerPercentage,
  accentColor,
  colorSpace = DEFAULT_COLOR_SPACE,
  weightTarget = 'layer',
}: ColorMixOptions): string {
  const operands =
    weightTarget === 'accent'
      ? `${layerColor}, ${accentColor} ${layerPercentage}`
      : `${layerColor} ${layerPercentage}, ${accentColor}`;

  return `color-mix(in ${colorSpace}, ${operands})`;
}

export const BUTTON_CLASS_NAME = 'fivra-button';
export const BUTTON_ICON_CLASS = `${BUTTON_CLASS_NAME}__icon`;
export const BUTTON_LABEL_CLASS = `${BUTTON_CLASS_NAME}__label`;
export const BUTTON_LEADING_ICON_CLASS = `${BUTTON_ICON_CLASS}--leading`;
export const BUTTON_TRAILING_ICON_CLASS = `${BUTTON_ICON_CLASS}--trailing`;
export const BUTTON_SPINNER_CLASS = `${BUTTON_CLASS_NAME}__spinner`;
export const BUTTON_CARET_CLASS = `${BUTTON_CLASS_NAME}__caret`;

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'tertiary'];
export const BUTTON_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_BUTTON_SIZE: ButtonSize = 'md';

const BASE_CLASS = `.${BUTTON_CLASS_NAME}`;
const ICON_CLASS = `.${BUTTON_ICON_CLASS}`;
const LABEL_CLASS = `.${BUTTON_LABEL_CLASS}`;
const SPINNER_CLASS = `.${BUTTON_SPINNER_CLASS}`;
const CARET_CLASS = `.${BUTTON_CARET_CLASS}`;

export const buttonClassStyles = `
${BASE_CLASS} {
  --fivra-button-font-family: var(--body1FontFamily, 'Google Sans', sans-serif);
  --fivra-button-font-weight: 600;
  --fivra-button-radius: var(--radiusS);
  --fivra-button-transition: background-color 160ms ease, color 160ms ease,
    box-shadow 160ms ease, border-color 160ms ease, opacity 160ms ease;
  --fivra-button-gap: calc(8 * 1px);
  --fivra-button-padding-y: calc(8 * 1px);
  --fivra-button-padding-x: calc(16 * 1px);
  --fivra-button-font-size: 0.95rem;
  --fivra-button-line-height: 1.2;
  --fivra-button-height: calc(32 * 1px);
  --fivra-button-icon-size: var(--iconsizesM);
  --fivra-button-spinner-size: calc(16 * 1px);
  --fivra-button-surface: var(--backgroundPrimaryInteractive);
  --fivra-button-accent: var(--backgroundPrimaryInteractive);
  --fivra-button-hover-fallback: var(--stateBrandHover);
  --fivra-button-active-fallback: var(--stateBrandPress);
  --fivra-button-hover-color: var(--fivra-button-hover-fallback);
  --fivra-button-active-color: var(--fivra-button-active-fallback);
  --fivra-button-hover-halo-fallback: var(--stateBrandHover);
  --fivra-button-active-halo-fallback: var(--stateBrandPress);
  --fivra-button-focus-halo-fallback: var(--stateBrandFocus);
  --fivra-button-hover-halo: var(--fivra-button-hover-halo-fallback);
  --fivra-button-active-halo: var(--fivra-button-active-halo-fallback);
  --fivra-button-focus-halo: var(--fivra-button-focus-halo-fallback);
  --fivra-button-border: var(--borderPrimaryInteractive);
  --fivra-button-text: var(--backgroundNeutral0);
  --fivra-button-disabled-bg: var(--backgroundPrimaryDisabled);
  --fivra-button-disabled-border: var(--borderPrimaryDisabled);
  --fivra-button-disabled-text: var(--textPrimaryDisabled);
  --fivra-button-focus-ring-width: calc(var(--spacingXs) * 1px);
  --fivra-button-focus-ring-color: var(--stateBrandFocus);
  --fivra-button-shadow: calc(var(--shadowsMX) * 1px) calc(var(--shadowsMY) * 1px)
    calc(var(--shadowsMBlur) * 1px) calc(var(--shadowsMSpread) * 1px) var(--shadowsMColor);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--fivra-button-gap);
  padding: var(--fivra-button-padding-y) var(--fivra-button-padding-x);
  min-height: var(--fivra-button-height);
  min-width: var(--fivra-button-height);
  border-radius: calc(var(--fivra-button-radius) * 1px);
  border-width: calc(var(--borderwidthS) * 1px);
  border-style: solid;
  border-color: var(--fivra-button-border);
  background-color: var(--fivra-button-surface);
  color: var(--fivra-button-text);
  font-family: var(--fivra-button-font-family);
  font-weight: var(--fivra-button-font-weight);
  font-size: var(--fivra-button-font-size);
  line-height: var(--fivra-button-line-height);
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: var(--fivra-button-transition);
  position: relative;
  user-select: none;
  appearance: none;
  // box-shadow: var(--fivra-button-shadow);
}

${BASE_CLASS}[data-full-width='true'] {
  width: 100%;
}

${BASE_CLASS}[data-size='sm'] {
  --fivra-button-padding-y: calc(4 * 1px);
  --fivra-button-padding-x: calc(12 * 1px);
  --fivra-button-height: calc(24 * 1px);
  --fivra-button-radius: var(--radiusXs);
  --fivra-button-gap: calc(4 * 1px);
  --fivra-button-icon-size: var(--iconsizesS);
  --fivra-button-spinner-size: calc(14 * 1px);
  --fivra-button-font-size: 0.85rem;
}

${BASE_CLASS}[data-size='lg'] {
  --fivra-button-padding-y: calc(12 * 1px);
  --fivra-button-padding-x: calc(24 * 1px);
  --fivra-button-height: calc(40 * 1px);
  --fivra-button-radius: var(--radiusM);
  --fivra-button-gap: calc(12 * 1px);
  --fivra-button-icon-size: var(--iconsizesXl);
  --fivra-button-spinner-size: calc(20 * 1px);
  --fivra-button-font-size: 1rem;
}

${BASE_CLASS}[data-variant='secondary'] {
  --fivra-button-surface: var(--backgroundNeutral0);
  --fivra-button-accent: var(--textPrimaryInteractive);
  --fivra-button-hover-fallback: var(--backgroundPrimarySelected);
  --fivra-button-active-fallback: var(--stateBrandPress);
  --fivra-button-hover-halo-fallback: var(--backgroundPrimarySelected);
  --fivra-button-active-halo-fallback: var(--stateBrandPress);
  --fivra-button-focus-halo-fallback: var(--stateBrandFocus);
  --fivra-button-border: var(--borderPrimaryInteractive);
  --fivra-button-text: var(--textPrimaryInteractive);
  --fivra-button-disabled-bg: var(--backgroundSecondaryDisabled);
  --fivra-button-disabled-border: var(--borderPrimaryDisabled);
  --fivra-button-disabled-text: var(--textPrimaryDisabled);
}

${BASE_CLASS}[data-variant='tertiary'] {
  --fivra-button-surface: transparent;
  --fivra-button-accent: var(--textPrimaryInteractive);
  --fivra-button-hover-fallback: var(--backgroundPrimarySelected);
  --fivra-button-active-fallback: var(--stateBrandPress);
  --fivra-button-hover-halo-fallback: var(--backgroundPrimarySelected);
  --fivra-button-active-halo-fallback: var(--stateBrandPress);
  --fivra-button-focus-halo-fallback: var(--stateBrandFocus);
  --fivra-button-border: transparent;
  --fivra-button-text: var(--textPrimaryInteractive);
  --fivra-button-disabled-bg: transparent;
  --fivra-button-disabled-border: transparent;
  --fivra-button-disabled-text: var(--textPrimaryDisabled);
}

@supports (${COLOR_MIX_SUPPORTS_DECLARATION}) {
  ${BASE_CLASS} {
    --fivra-button-focus-ring-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandFocusPercent)',
      accentColor: 'var(--fivra-button-accent)',
    })};
    --fivra-button-hover-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandHoverPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'layer',
    })};
    --fivra-button-active-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandActivePercent)',
      accentColor: 'var(--fivra-button-accent)',
    })};
    --fivra-button-hover-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandHoverPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-active-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandActivePercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-focus-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandFocusPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
  }

  ${BASE_CLASS}[data-variant='secondary'] {
    --fivra-button-focus-ring-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandFocusPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-hover-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandHoverPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-active-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandActivePercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-hover-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandHoverPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-active-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandActivePercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-focus-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandFocusPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
  }

  ${BASE_CLASS}[data-variant='tertiary'] {
    --fivra-button-focus-ring-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandFocusPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-hover-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandHoverPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-active-color: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandActivePercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-hover-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandHoverPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-active-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandActivePercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
    --fivra-button-focus-halo: ${colorMix({
      layerColor: 'var(--stateLayerBrightenBase)',
      layerPercentage: 'var(--intensityBrandFocusPercent)',
      accentColor: 'var(--fivra-button-accent)',
      weightTarget: 'accent',
    })};
  }

  ${BASE_CLASS}:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-hover-color);
    box-shadow: var(--fivra-button-shadow), 0 0 0 4px var(--fivra-button-hover-halo);
  }

  ${BASE_CLASS}:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-active-color);
    box-shadow: var(--fivra-button-shadow), 0 0 0 6px var(--fivra-button-active-halo);
    transform: translateY(1px);
  }
}

@supports not (${COLOR_MIX_SUPPORTS_DECLARATION}) {
  ${BASE_CLASS}:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-hover-fallback);
    box-shadow: var(--fivra-button-shadow),
      0 0 0 4px var(--fivra-button-hover-halo-fallback);
  }

  ${BASE_CLASS}:active:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--fivra-button-active-fallback);
    box-shadow: var(--fivra-button-shadow),
      0 0 0 6px var(--fivra-button-active-halo-fallback);
    transform: translateY(1px);
  }

}

${BASE_CLASS}:focus-visible {
  outline: none;
  box-shadow: var(--fivra-button-shadow), 0 0 0 6px var(--fivra-button-focus-halo),
    0 0 0 var(--fivra-button-focus-ring-width) var(--fivra-button-focus-ring-color);
}

${BASE_CLASS}:disabled,
${BASE_CLASS}[aria-disabled='true'] {
  cursor: not-allowed;
  box-shadow: none;
  background-color: var(--fivra-button-disabled-bg);
  border-color: var(--fivra-button-disabled-border);
  color: var(--fivra-button-disabled-text);
}

${BASE_CLASS}[data-loading='true'] {
  cursor: progress;
  background-color: var(--fivra-button-surface);
  border-color: var(--fivra-button-border);
  color: var(--fivra-button-text);
  box-shadow: var(--fivra-button-shadow);
}

${BASE_CLASS}[data-loading='true']:disabled,
${BASE_CLASS}[data-loading='true'][aria-disabled='true'] {
  background-color: var(--fivra-button-surface);
  border-color: var(--fivra-button-border);
  color: var(--fivra-button-text);
  box-shadow: var(--fivra-button-shadow);
}

${BASE_CLASS}[data-icon-only='true'] {
  --fivra-button-gap: 0;
  --fivra-button-padding-x: 0;
  width: var(--fivra-button-height);
  padding-left: 0;
  padding-right: 0;
  border-radius: calc(var(--radiusMax) * 1px);
}

${BASE_CLASS}[data-has-label='false'] ${LABEL_CLASS} {
  display: none;
}

${BASE_CLASS}[data-dropdown='true'] ${CARET_CLASS} {
  display: inline-flex;
}

${BASE_CLASS}[data-loading='true'] ${ICON_CLASS},
${BASE_CLASS}[data-loading='true'] ${LABEL_CLASS},
${BASE_CLASS}[data-loading='true'] ${CARET_CLASS} {
  opacity: 0;
}

${BASE_CLASS}[data-loading='true'] ${SPINNER_CLASS} {
  display: inline-flex;
}

${ICON_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--fivra-button-icon-size);
  height: var(--fivra-button-icon-size);
  flex-shrink: 0;
  line-height: 1;
}

${ICON_CLASS} svg,
${ICON_CLASS} > * {
  width: 100%;
  height: 100%;
}

${ICON_CLASS}[data-empty='true'] {
  display: none !important;
}

${LABEL_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

${SPINNER_CLASS} {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

${SPINNER_CLASS}::before {
  content: '';
  width: var(--fivra-button-spinner-size);
  height: var(--fivra-button-spinner-size);
  border-radius: 999px;
  border: calc(var(--borderwidthS) * 1px) solid var(--borderPrimaryDisabled);
  border-top-color: var(--fivra-button-text);
  animation: fivra-button-spin 0.8s linear infinite;
}

${CARET_CLASS} {
  display: none;
  align-items: center;
  justify-content: center;
  width: var(--fivra-button-icon-size);
  height: var(--fivra-button-icon-size);
  flex-shrink: 0;
}

${CARET_CLASS}::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: calc(var(--fivra-button-icon-size) / 3) solid transparent;
  border-right: calc(var(--fivra-button-icon-size) / 3) solid transparent;
  border-top: calc(var(--fivra-button-icon-size) / 3) solid currentColor;
}

@keyframes fivra-button-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

export const buttonHostStyles = `
:host {
  display: inline-block;
}

:host([hidden]) {
  display: none !important;
}

:host([full-width]) {
  width: 100%;
}
`;

let hasInjectedStyles = false;

export function ensureButtonStyles(): void {
  if (hasInjectedStyles || typeof document === 'undefined') {
    return;
  }

  if (document.querySelector(`style[data-fivra-button-styles="true"]`)) {
    hasInjectedStyles = true;
    return;
  }

  const style = document.createElement('style');
  style.dataset.fivraButtonStyles = 'true';
  style.textContent = `${buttonHostStyles}${buttonClassStyles}`;
  document.head.appendChild(style);
  hasInjectedStyles = true;
}
