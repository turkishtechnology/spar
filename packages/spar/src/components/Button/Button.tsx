import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ButtonProps } from './types';

/**
 * A headless, accessible button component that provides complete keyboard support and toggle functionality.
 */
export const Button = ({
  as: Element = 'button',
  type = 'button',
  disabled = false,
  shouldAutoFocus = false,
  isLoading = false,
  isPressed,
  onPressedChange,
  children,
  onClick,
  onKeyDown,
  className,
  style,
  ref,
  ...htmlProps
}: ButtonProps) => {
  // Internal state for uncontrolled toggle
  const [internalPressed, setInternalPressed] = useState<boolean>(false);

  // Determine if this is a toggle button and current pressed state
  const isToggle = isPressed !== undefined;
  const currentPressed = isToggle ? isPressed : internalPressed;

  // Interactive state
  const isInteractive = !disabled && !isLoading;

  // Auto focus handling - SSR safe with stable dependency array
  useEffect(() => {
    // Only run on client-side after mount
    if (typeof window === 'undefined') return;

    if (shouldAutoFocus && ref && typeof ref === 'object' && ref.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        ref.current?.focus();
      });
    }
  }, [shouldAutoFocus]);

  // Unified activation handler for click and keyboard
  const handleActivation = useCallback(
    (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      if (!isInteractive) return;

      // Toggle logic
      if (isToggle) {
        const newPressed = !currentPressed;
        if (onPressedChange) {
          onPressedChange(newPressed);
        } else {
          setInternalPressed(newPressed);
        }
      }

      // Fire click handler - only for mouse events
      if (onClick && event.type === 'click') {
        onClick(event as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [isInteractive, isToggle, currentPressed, onPressedChange, onClick],
  );

  // Click handler
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      handleActivation(event);
    },
    [handleActivation],
  );

  // Keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleActivation(event);
      }

      if (onKeyDown) {
        onKeyDown(event as React.KeyboardEvent<HTMLButtonElement>);
      }
    },
    [handleActivation, onKeyDown],
  );

  // Memoize data attributes to prevent object recreation
  const dataAttributes = useMemo(
    () => ({
      'data-disabled': disabled ? '' : undefined,
      'data-loading': isLoading ? '' : undefined,
      'data-pressed': isToggle ? String(currentPressed) : undefined,
      'data-autofocus': shouldAutoFocus ? '' : undefined,
    }),
    [disabled, isLoading, isToggle, currentPressed, shouldAutoFocus],
  );

  // Determine ARIA attributes
  const ariaAttributes = useMemo(() => {
    const attrs: Record<string, boolean | string> = {};

    // Only add aria-pressed for toggle buttons
    if (isToggle && currentPressed !== undefined) {
      attrs['aria-pressed'] = currentPressed;
    }

    // Loading state
    if (isLoading) {
      attrs['aria-busy'] = true;
    }

    // Disabled state - only add aria-disabled for non-native button elements
    // Native buttons already communicate disabled state via the disabled attribute
    if (disabled && Element !== 'button') {
      attrs['aria-disabled'] = true;
    }

    return attrs;
  }, [isToggle, currentPressed, isLoading, disabled, Element]);

  // Build props for the element
  const isNativeButton = Element === 'button';
  const elementProps: Record<string, unknown> = {
    ref,
    className,
    style,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: isNativeButton ? (disabled ? -1 : 0) : disabled ? -1 : 0,
    ...dataAttributes,
    ...ariaAttributes,
    ...htmlProps,
  };

  // Add button-specific props when rendering as button
  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = type;
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
  }

  // Add role and aria-disabled when not rendering as button
  if (!isNativeButton) {
    elementProps.role = 'button';
    if (disabled) {
      elementProps['aria-disabled'] = true;
    }
    // Remove native disabled and type if present, using Record<string, unknown>
    if ('disabled' in elementProps) {
      delete elementProps['disabled'];
    }
    if ('type' in elementProps) {
      delete elementProps['type'];
    }
  }

  return <Element {...elementProps}>{children}</Element>;
};

Button.displayName = 'Button';
