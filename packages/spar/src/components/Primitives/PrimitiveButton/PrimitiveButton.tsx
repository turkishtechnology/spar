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

  // Set tabIndex
  const elementTabIndex = disabled ? -1 : (tabIndex ?? 0);

  // Common props for all elements
  const baseProps = {
    ref: mergedRef,
    tabIndex: elementTabIndex,
    ...(shouldAutoFocus && { 'data-autofocus': '' }),
    ...(disabled && { 'data-disabled': '' }),
  };

  // Handle native button elements
  if (isNativeButton) {
    return (
      <Element {...baseProps} {...props} type={type} disabled={disabled}>
        {children}
      </Element>
    );
  }

  // Handle non-button elements (div, span, etc.)
  // Props might contain button-specific attributes, we just pass them through
  // and let the browser ignore invalid attributes for non-button elements
  return (
    <Element
      {...baseProps}
      {...props}
      role={props.role || 'button'}
      aria-disabled={disabled || undefined}
    >
      {children}
    </Element>
  );
};

PrimitiveButton.displayName = 'PrimitiveButton';
