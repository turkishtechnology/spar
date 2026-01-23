import { useCallback } from 'react';
import { useMergedRef } from '@/hooks';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import { useDialogContext } from './DialogRoot';
import type { DialogTriggerProps, DialogTriggerRenderProps } from './types';

/**
 * Trigger button that opens the dialog when activated.
 * Supports keyboard navigation and proper ARIA attributes.
 */
export const DialogTrigger = ({
  as = 'button',
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

  // Render props for children function
  const renderProps: DialogTriggerRenderProps = {
    isOpen,
    disabled,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  };

  const dataState = isOpen ? 'open' : 'closed';

  return (
    <PrimitiveButton
      as={as}
      type='button'
      disabled={disabled}
      ref={mergedRef}
      aria-haspopup='dialog'
      aria-expanded={isOpen}
      data-state={dataState}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

DialogTrigger.displayName = 'DialogTrigger';
