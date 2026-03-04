import { useCallback, ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import { useDialogContext } from './hooks';
import type { DialogTriggerProps, DialogTriggerRenderProps } from './types';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Trigger button that opens the dialog when activated.
 * Supports keyboard navigation and proper ARIA attributes.
 */
export const DialogTrigger = <T extends ElementType = 'button'>({
  as,
  disabled: disabledProp,
  ref,
  onClick,
  children,
  ...props
}: DialogTriggerProps<T>) => {
  const context = useDialogContext();
  const { isOpen, setIsOpen, triggerRef, contentId, disabled: contextDisabled } = context;

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

  const buttonProps = {
    ...(as && { as }),
    ref: mergedRef,
    disabled,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    'data-state': dataState,
    onClick: handleClick,
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

DialogTrigger.displayName = 'DialogTrigger';
