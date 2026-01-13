import { useCallback } from 'react';
import { useMergedRef } from '@/hooks';
import { useDialogContext } from './DialogRoot';
import type { DialogTriggerProps } from './types';

/**
 * Trigger button that opens the dialog when activated.
 * Supports keyboard navigation and proper ARIA attributes.
 */
export const DialogTrigger = ({
  as: Element = 'button',
  disabled: disabledProp,
  ref,
  onClick,
  onKeyDown,
  children,
  ...props
}: DialogTriggerProps) => {
  const context = useDialogContext();
  const { isOpen, setIsOpen, triggerRef, disabled: contextDisabled } = context;

  // Merge external ref with internal ref
  const mergedRef = useMergedRef(triggerRef, ref);

  // Use prop if explicitly provided, otherwise use context
  const disabled = disabledProp ?? contextDisabled;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      setIsOpen(!isOpen);
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    },
    [disabled, isOpen, setIsOpen, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      // Handle Enter and Space keys for button activation
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      }

      onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
    },
    [disabled, isOpen, setIsOpen, onKeyDown],
  );

  const dataState = isOpen ? 'open' : 'closed';

  // Build props with conditional logic for button vs non-button elements
  const isButton = Element === 'button';
  const triggerProps = {
    ref: mergedRef,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    'data-state': dataState,
    'data-disabled': disabled ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...props,
    // Button-specific props
    ...(isButton && { type: 'button' as const, disabled }),
    // Non-button props for accessibility
    ...(!isButton && {
      role: 'button',
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
    }),
  };

  return <Element {...triggerProps}>{children}</Element>;
};

DialogTrigger.displayName = 'DialogTrigger';
