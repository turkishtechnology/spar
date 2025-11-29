import { useCallback } from 'react';
import { useDialogContext } from './DialogRoot';
import type { DialogCloseProps } from './types';

/**
 * Close button component that closes the dialog when activated.
 * Supports keyboard navigation and proper event handling.
 */
export const DialogClose = ({
  as: Component = 'button',
  ref,
  onClick,
  onKeyDown,
  children,
  ...props
}: DialogCloseProps) => {
  const context = useDialogContext();
  const { setIsOpen } = context;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(false);
      onClick?.(event);
    },
    [setIsOpen, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Enter and Space keys for button activation
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(false);
      }

      onKeyDown?.(event);
    },
    [setIsOpen, onKeyDown],
  );

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? 'button' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Component>
  );
};

DialogClose.displayName = 'DialogClose';
