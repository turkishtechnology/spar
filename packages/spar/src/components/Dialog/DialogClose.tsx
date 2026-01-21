import { useCallback } from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import { useDialogContext } from './DialogRoot';
import type { DialogCloseProps, DialogCloseRenderProps } from './types';

/**
 * Close button component that closes the dialog when activated.
 * Supports keyboard navigation and proper event handling.
 */
export const DialogClose = ({
  as = 'button',
  ref,
  onClick,
  onKeyDown,
  children,
  ...props
}: DialogCloseProps) => {
  const context = useDialogContext();
  const { isOpen, setIsOpen } = context;

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

  // Render props for children function
  const renderProps: DialogCloseRenderProps = {
    isOpen,
    close: () => setIsOpen(false),
  };

  return (
    <PrimitiveButton
      as={as}
      type='button'
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

DialogClose.displayName = 'DialogClose';
