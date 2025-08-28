import { forwardRef } from 'react';
import type { ButtonProps } from './types';

/**
 * TK Headless Button Component
 *
 * A fully accessible button component following WAI-ARIA button design patterns.
 * Provides keyboard navigation, proper ARIA attributes, and supports both
 * button and non-button elements with button behavior.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      isIconOnly = false,
      isFullWidth = false,
      loadingText,
      shortcut,
      as: Component = 'button',
      children,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    // ARIA attributes
    const ariaProps: React.AriaAttributes = {
      'aria-disabled': isDisabled || undefined,
      'aria-busy': isLoading || undefined,
      'aria-label': isIconOnly ? ariaLabel : undefined,
    };

    return (
      <Component
        ref={ref}
        type={Component === 'button' ? rest.type || 'button' : undefined}
        tabIndex={isDisabled ? -1 : rest.tabIndex}
        disabled={Component === 'button' ? isDisabled : undefined}
        role={Component !== 'button' ? 'button' : undefined}
        data-tk-button
        data-variant={variant}
        data-size={size}
        data-loading={isLoading || undefined}
        data-disabled={isDisabled || undefined}
        data-icon-only={isIconOnly || undefined}
        data-full-width={isFullWidth || undefined}
        {...ariaProps}
        {...rest}
        onClick={isDisabled || isLoading ? undefined : rest.onClick}
        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (isDisabled || isLoading) return;
          if (rest.onKeyDown) rest.onKeyDown(event);

          // Space/Enter activation for non-button elements
          if (Component !== 'button' && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            if (rest.onClick) {
              const syntheticEvent = {
                ...event,
                currentTarget: event.currentTarget,
                target: event.target,
              } as unknown as React.MouseEvent<HTMLButtonElement>;
              rest.onClick(syntheticEvent);
            }
          }
        }}
      >
        {isLoading ? (
          <span aria-live='polite' aria-busy='true'>
            {loadingText || 'Loading...'}
          </span>
        ) : (
          children
        )}
        {shortcut && <kbd aria-hidden='true'>{shortcut}</kbd>}
      </Component>
    );
  },
);

Button.displayName = 'Button';
