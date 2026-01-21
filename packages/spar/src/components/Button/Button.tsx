import { useState, useCallback, useMemo } from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import type { ButtonProps } from './types';

/**
 * A headless, accessible button component that provides complete keyboard support and toggle functionality.
 */
export const Button = ({
  as = 'button',
  type = 'button',
  disabled = false,
  shouldAutoFocus = false,
  isLoading = false,
  isPressed,
  onPressedChange,
  children,
  onClick,
  onKeyDown,
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
      'data-loading': isLoading ? '' : undefined,
      'data-pressed': isToggle ? String(currentPressed) : undefined,
    }),
    [isLoading, isToggle, currentPressed],
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

    return attrs;
  }, [isToggle, currentPressed, isLoading]);

  return (
    <PrimitiveButton
      as={as}
      type={type}
      disabled={disabled}
      shouldAutoFocus={shouldAutoFocus}
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...dataAttributes}
      {...ariaAttributes}
      {...htmlProps}
    >
      {children}
    </PrimitiveButton>
  );
};

Button.displayName = 'Button';
