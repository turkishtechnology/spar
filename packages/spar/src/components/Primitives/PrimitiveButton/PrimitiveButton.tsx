import { useRef } from 'react';
import type { PrimitiveButtonProps } from './types';
import { useAutoFocus } from '../../../hooks/useAutoFocus';
import { useMergedRef } from '../../../hooks/useMergedRef';

/**
 * @internal
 * Primitive button component that provides basic button functionality with accessibility support.
 * Can be used as a foundation for other interactive components (triggers, actions, etc.).
 * Does not enforce any ARIA attributes - consuming components should add their own as needed.
 *
 * This is a simple building block that handles:
 * - Polymorphic rendering (as prop)
 * - Ref forwarding and merging
 * - Disabled state management
 * - Auto-focus behavior
 * - Basic accessibility attributes
 *
 * Event handling (onClick, onKeyDown) is left to consuming components for clarity and flexibility.
 *
 * This is NOT part of the public API - it's an internal building block.
 */
export const PrimitiveButton = ({
  as: Element = 'button',
  children,
  disabled,
  type = 'button',
  ref,
  tabIndex,
  shouldAutoFocus = false,
  ...props
}: PrimitiveButtonProps) => {
  const isNativeButton = Element === 'button';
  const internalRef = useRef<HTMLButtonElement>(null);

  // Auto focus handling using the useAutoFocus hook
  useAutoFocus(internalRef, shouldAutoFocus && !disabled);

  // Merge refs using the useMergedRef hook
  const mergedRef = useMergedRef(internalRef, ref);

  // Handle disabled state: use native disabled for buttons, aria-disabled for others
  const disabledProps = disabled && !isNativeButton ? { 'aria-disabled': true } : {};

  // Set tabIndex
  const elementTabIndex = disabled ? -1 : (tabIndex ?? 0);

  // Build props for the element
  const elementProps: Record<string, unknown> = {
    ref: mergedRef,
    tabIndex: elementTabIndex,
    ...props,
    ...disabledProps,
  };

  // Add data attribute for autofocus if enabled
  if (shouldAutoFocus) {
    elementProps['data-autofocus'] = '';
  }

  // Add data-disabled attribute when disabled
  if (disabled) {
    elementProps['data-disabled'] = '';
  }

  // Add button-specific props when rendering as button
  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = type;
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
  } else {
    // For non-native buttons, remove button-specific props that shouldn't be on the DOM
    // (consumers might pass them, but they're invalid for div/span elements)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type: _type, disabled: _disabled, ...filteredProps } = elementProps;
    elementProps.role = elementProps.role || 'button';
    return (
      <Element {...filteredProps} role={elementProps.role}>
        {children}
      </Element>
    );
  }

  return <Element {...elementProps}>{children}</Element>;
};

PrimitiveButton.displayName = 'PrimitiveButton';
