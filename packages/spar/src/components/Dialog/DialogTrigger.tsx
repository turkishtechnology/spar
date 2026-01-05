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
  disabled = false,
  ref,
  onClick,
  onKeyDown,
  children,
  ...props
}: DialogTriggerProps) => {
  const context = useDialogContext();
  const { isOpen, setIsOpen, triggerRef } = context;

  // Merge external ref with internal ref
  const mergedRef = useMergedRef(triggerRef, ref);

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

  return (
    <Element
      ref={mergedRef}
      type={Element === 'button' ? 'button' : undefined}
      disabled={disabled}
      aria-haspopup='dialog'
      aria-expanded={isOpen}
      data-state={dataState}
      data-disabled={disabled ? '' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Element>
  );
};

DialogTrigger.displayName = 'DialogTrigger';
