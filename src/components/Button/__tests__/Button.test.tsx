import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button, BUTTON_ICON_CLASS } from '@components/Button';
import {
  COLOR_MIX_SUPPORTS_DECLARATION,
  ensureButtonStyles,
} from '../button.styles';

describe('Button', () => {
  it('renders the provided label and defaults to type="button"', () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole('button', { name: 'Save changes' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).not.toHaveAttribute('data-full-width');
  });

  it('supports variant, size, and fullWidth props', () => {
    render(
      <Button variant="tertiary" size="lg" fullWidth>
        Explore
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Explore' });

    expect(button).toHaveAttribute('data-variant', 'tertiary');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveAttribute('data-full-width', 'true');
  });

  it('renders leading and trailing icons with aria-hidden wrappers', () => {
    render(
      <Button
        leadingIcon={<span data-testid="leading-icon" />}
        trailingIcon={<span data-testid="trailing-icon" />}
      >
        Download
      </Button>,
    );

    const wrappers = screen
      .getAllByTestId(/icon$/i)
      .map((icon) => icon.parentElement as HTMLElement | null);

    wrappers.forEach((wrapper) => {
      expect(wrapper).toBeInstanceOf(HTMLElement);
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect((wrapper as HTMLElement).className).toContain(BUTTON_ICON_CLASS);
    });
  });

  it('forwards click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports iconOnly, dropdown, and loading props', () => {
    render(
      <Button
        iconOnly
        dropdown
        loading
        aria-label="Open menu"
        leadingIcon={<span data-testid="menu-icon" />}
      />,
    );

    const button = screen.getByRole('button', { name: 'Open menu' });

    expect(button).toHaveAttribute('data-icon-only', 'true');
    expect(button).toHaveAttribute('data-has-label', 'false');
    expect(button).toHaveAttribute('data-dropdown', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('.fivra-button__spinner')).toBeInTheDocument();
  });

  it('injects brand-focused overlay mixes for primary variants', () => {
    ensureButtonStyles();

    const style = document.querySelector<HTMLStyleElement>(
      'style[data-fivra-button-styles="true"]',
    );

    expect(style).toBeInstanceOf(HTMLStyleElement);
    const textContent = style?.textContent ?? '';

    expect(textContent).toContain(COLOR_MIX_SUPPORTS_DECLARATION);
    expect(textContent).toContain(
      "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandHoverPercent), var(--fivra-button-accent));",
    );
    expect(textContent).toContain(
      "--fivra-button-active-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandActivePercent), var(--fivra-button-accent));",
    );
    expect(textContent).toContain(
      "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase) var(--intensityBrandFocusPercent), var(--fivra-button-accent));",
    );
    expect(textContent).toContain(
      "--fivra-button-hover-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandHoverPercent));",
    );
    expect(textContent).toContain(
      "--fivra-button-active-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandActivePercent));",
    );
    expect(textContent).toContain(
      "--fivra-button-focus-halo: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandFocusPercent));",
    );
  });

  it('reweights neutral overlays around the accent for outline and ghost variants', () => {
    ensureButtonStyles();

    const style = document.querySelector<HTMLStyleElement>(
      'style[data-fivra-button-styles="true"]',
    );

    expect(style).toBeInstanceOf(HTMLStyleElement);
    const textContent = style?.textContent ?? '';

    expect(textContent).toContain(
      ".fivra-button[data-variant='secondary'] {",
    );
    expect(textContent).toContain(
      "--fivra-button-hover-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandHoverPercent));",
    );
    expect(textContent).toContain(
      "--fivra-button-active-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandActivePercent));",
    );
    expect(textContent).toContain(
      "--fivra-button-focus-ring-color: color-mix(in srgb, var(--stateLayerBrightenBase), var(--fivra-button-accent) var(--intensityBrandFocusPercent));",
    );
    expect(textContent).toContain(
      ".fivra-button[data-variant='tertiary'] {",
    );
  });

});
