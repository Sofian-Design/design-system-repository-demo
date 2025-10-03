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
