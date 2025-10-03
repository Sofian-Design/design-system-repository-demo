import React, { forwardRef, useEffect } from 'react';

import {
  BUTTON_CLASS_NAME,
  BUTTON_ICON_CLASS,
  BUTTON_LABEL_CLASS,
  BUTTON_LEADING_ICON_CLASS,
  BUTTON_TRAILING_ICON_CLASS,
  BUTTON_SPINNER_CLASS,
  BUTTON_CARET_CLASS,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
  ensureButtonStyles,
} from './button.styles';

function cx(...values: Array<string | undefined | false | null>): string {
  return values.filter(Boolean).join(' ');
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Compact (`sm`), default (`md`), or spacious (`lg`) sizing scale. Defaults to `md`. */
  size?: ButtonSize;
  /** When `true`, the button stretches to fill the width of its container. */
  fullWidth?: boolean;
  /** Optional leading icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Optional trailing icon rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Hides the visible label for icon-only buttons. Provide an `aria-label`. */
  iconOnly?: boolean;
  /** Overrides automatic label detection when rendering a visually hidden label. */
  hasLabel?: boolean;
  /** Adds a disclosure caret to the button. */
  dropdown?: boolean;
  /** Displays a spinner and marks the button as busy. */
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    hasLabel,
    dropdown = false,
    loading = false,
    className,
    children,
    type,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  useEffect(() => {
    ensureButtonStyles();
  }, []);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      iconOnly &&
      !ariaLabel &&
      !ariaLabelledBy
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        'Button: iconOnly buttons must include an accessible name via `aria-label` or `aria-labelledby`.',
      );
    }
  }, [ariaLabel, ariaLabelledBy, iconOnly]);

  const resolvedHasLabel =
    typeof hasLabel === 'boolean' ? hasLabel : Boolean(children) && !iconOnly;
  const buttonType = type ?? 'button';

  return (
    <button
      {...rest}
      ref={ref}
      type={buttonType}
      className={cx(
        BUTTON_CLASS_NAME,
        className ?? undefined,
      )}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? 'true' : undefined}
      data-icon-only={iconOnly ? 'true' : undefined}
      data-has-label={resolvedHasLabel ? 'true' : 'false'}
      data-dropdown={dropdown ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-busy={loading || undefined}
    >
      {loading ? <span className={BUTTON_SPINNER_CLASS} aria-hidden="true" /> : null}
      {leadingIcon ? (
        <span className={cx(BUTTON_ICON_CLASS, BUTTON_LEADING_ICON_CLASS)} aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      {resolvedHasLabel ? <span className={BUTTON_LABEL_CLASS}>{children}</span> : null}
      {trailingIcon ? (
        <span className={cx(BUTTON_ICON_CLASS, BUTTON_TRAILING_ICON_CLASS)} aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
      {dropdown ? <span className={BUTTON_CARET_CLASS} aria-hidden="true" /> : null}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonVariant, ButtonSize };
