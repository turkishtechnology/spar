import { useState, useCallback, useMemo, useRef, ElementType } from 'react';
import { useMergedRef, useAutoFocus } from '../../hooks';
import type { ButtonProps } from './types';

/**
 * A headless, accessible button component that provides complete keyboard support and toggle functionality.
 */
export const Button = <T extends ElementType = 'button'>({
  as,
  type = 'button',
  disabled = false,
  autoFocus = false,
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
}: ButtonProps<T>) => {
  const Component = as || 'button';
  // Internal state for uncontrolled toggle
  const [internalPressed, setInternalPressed] = useState<boolean>(false);

  // Determine if this is a toggle button and current pressed state
  const isToggle = isPressed !== undefined;
  const currentPressed = isToggle ? isPressed : internalPressed;

  // Interactive state
  const isInteractive = !disabled && !isLoading;

  // Refs
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);

  // Auto focus handling
  useAutoFocus(internalRef, autoFocus);

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

      // Fire click handler for both mouse and keyboard activation
      if (onClick) {
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
      'data-autofocus': autoFocus ? '' : undefined,
    }),
    [disabled, isLoading, isToggle, currentPressed, autoFocus],
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
      attrs['aria-live'] = 'polite';
    }

    // Disabled state - only add aria-disabled for non-native button elements
    // Native buttons already communicate disabled state via the disabled attribute
    if (disabled && Component !== 'button') {
      attrs['aria-disabled'] = true;
    }

    return attrs;
  }, [isToggle, currentPressed, isLoading, disabled, Component]);

  // Build props for the element
  const isNativeButton = Component === 'button';
  const elementProps: Record<string, unknown> = {
    ref: mergedRef,
    className,
    style,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...dataAttributes,
    ...ariaAttributes,
    ...htmlProps,
  };

  // Set tabIndex if not already provided
  if (!('tabIndex' in htmlProps)) {
    elementProps.tabIndex = disabled ? -1 : 0;
  }

  // Add button-specific props when rendering as button
  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = type;
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
  }

  // Add role and aria-disabled when not rendering as button (only if not already set)
  if (!isNativeButton) {
    if (!('role' in htmlProps)) {
      elementProps.role = 'button';
    }
    if (disabled && !('aria-disabled' in htmlProps)) {
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

  return <Component {...elementProps}>{children}</Component>;
};

Button.displayName = 'Button';
