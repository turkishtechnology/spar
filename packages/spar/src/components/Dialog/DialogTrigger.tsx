import { useCallback } from 'react';
import { useMergedRef } from '@/hooks';
import { useDialogContext } from './DialogRoot';
import type { DialogTriggerProps, DialogTriggerRenderProps } from './types';
import { Button } from '../Button';

/**
 * Trigger button that opens the dialog when activated.
 * Supports keyboard navigation and proper ARIA attributes.
 */
export const DialogTrigger = ({
  as = 'button',
  disabled: disabledProp,
  ref,
  onClick,
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
    <Button
      as={as}
      ref={mergedRef}
      disabled={disabled}
      aria-haspopup='dialog'
      aria-expanded={isOpen}
      data-state={dataState}
      onClick={handleClick}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

DialogTrigger.displayName = 'DialogTrigger';
