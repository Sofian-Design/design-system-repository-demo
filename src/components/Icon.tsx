import React, { forwardRef, isValidElement } from 'react';
import { icons as generatedIcons } from '../icons.generated';

export type IconPaths = { paths: string[]; viewBox?: string };
export type IconSvg = { svg: string; viewBox?: string };
export type IconElement = React.ReactElement<React.SVGProps<SVGSVGElement>>;
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type IconSource = IconComponent | IconElement | string | IconPaths | IconSvg;
export type IconVariants = { outline?: IconSource; solid?: IconSource };
export type IconsMap = Record<string, IconSource | IconVariants>;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke' | 'strokeWidth'> {
  name: string;
  icons?: IconsMap;
  variant?: 'outline' | 'solid';
  size?: number | string;
  color?: string;
  title?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  viewBox?: string;
}

function isComponent(x: unknown): x is IconComponent {
  return typeof x === 'function';
}

function isSvgMarkup(str: string): boolean {
  return typeof str === 'string' && /<\s*svg[\s>]/i.test(str);
}

function toPx(v?: number | string): string | undefined {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}px` : String(v);
}

function pickVariantEntry(entry: unknown, variant: 'outline' | 'solid') {
  if (
    entry &&
    typeof entry === 'object' &&
    !isValidElement(entry as any) &&
    !isComponent(entry) &&
    (Object.prototype.hasOwnProperty.call(entry, 'outline') ||
      Object.prototype.hasOwnProperty.call(entry, 'solid'))
  ) {
    return (entry as IconVariants)[variant] ?? (entry as IconVariants).outline ?? (entry as IconVariants).solid;
  }
  return entry as IconSource;
}

const DEFAULT_VIEWBOX = '0 0 24 24';

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
  const {
    name,
    icons = (generatedIcons as unknown) as IconsMap,
    variant = 'outline',
    size = '1em',
    color = 'currentColor',
    title,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    viewBox: viewBoxProp,
    ...svgProps
  } = props;

  const entry = icons ? (icons as any)[name] : undefined;
  const source = pickVariantEntry(entry, variant) as IconSource | undefined;

  if (!source) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] Unknown icon: "${name}"`);
    }
    return null;
  }

  const commonAriaProps: React.HTMLAttributes<HTMLElement> = {
    role: (svgProps as any).role ?? (ariaLabel || title ? 'img' : 'presentation'),
    'aria-label': ariaLabel,
    'aria-hidden': (ariaHidden as any) ?? !(ariaLabel || title),
    // @ts-expect-error: focusable is valid on SVG in browsers
    focusable: (svgProps as any).focusable ?? false,
  };

  const computedSize = toPx(size);

  // Default to filled shapes for both variants to preserve
  // flattened outlines exported from design tools.
  const defaultFill = (svgProps as any).fill ?? 'currentColor';

  const baseSvgProps: React.SVGProps<SVGSVGElement> = {
    width: (svgProps as any).width ?? computedSize,
    height: (svgProps as any).height ?? computedSize,
    color,
    fill: defaultFill,
    viewBox: (viewBoxProp as any) ?? (svgProps as any).viewBox ?? DEFAULT_VIEWBOX,
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    style,
    ref: ref as any,
    ...(commonAriaProps as any),
  };

  // 1) React component
  if (isComponent(source)) {
    const Cmp = source as IconComponent;
    return <Cmp {...(baseSvgProps as any)} />;
  }

  // 2) React element
  if (isValidElement(source)) {
    return React.cloneElement(source as IconElement, {
      ...(baseSvgProps as any),
      ...(source as IconElement).props,
      ref,
    });
  }

  // 3) String: either full <svg>...</svg> or a path data string
  if (typeof source === 'string') {
    if (isSvgMarkup(source)) {
      const wrapperStyle: React.CSSProperties = {
        display: 'inline-block',
        lineHeight: 0,
        width: baseSvgProps.width as any,
        height: baseSvgProps.height as any,
        color: baseSvgProps.color as any,
        ...(baseSvgProps.style || {}),
      };
      return (
        <span
          {...(commonAriaProps as any)}
          className={className}
          style={wrapperStyle}
          title={title}
          ref={ref as any}
          dangerouslySetInnerHTML={{ __html: source }}
        />
      );
    }

    // Assume it's a path data string
    return (
      <svg {...(baseSvgProps as any)} title={title}>
        <path d={source} />
      </svg>
    );
  }

  // 4) Object forms
  if (source && typeof source === 'object') {
    const s = source as IconPaths | IconSvg;
    if (typeof (s as IconSvg).svg === 'string') {
      const wrapperStyle: React.CSSProperties = {
        display: 'inline-block',
        lineHeight: 0,
        width: baseSvgProps.width as any,
        height: baseSvgProps.height as any,
        color: baseSvgProps.color as any,
        ...(baseSvgProps.style || {}),
      };
      return (
        <span
          {...(commonAriaProps as any)}
          className={className}
          style={wrapperStyle}
          title={title}
          ref={ref as any}
          dangerouslySetInnerHTML={{ __html: (s as IconSvg).svg }}
        />
      );
    }

    if (Array.isArray((s as IconPaths).paths)) {
      const vb = (s as IconPaths).viewBox ?? baseSvgProps.viewBox;
      return (
        <svg {...(baseSvgProps as any)} viewBox={vb} title={title}>
          {(s as IconPaths).paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[Icon] Unsupported icon source for "${name}"`, source);
  }
  return null;
});

export default Icon;
