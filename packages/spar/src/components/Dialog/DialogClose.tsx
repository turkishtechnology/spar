import { useCallback } from 'react';
import { useDialogContext } from './DialogRoot';
import type { DialogCloseProps, DialogCloseRenderProps } from './types';
import { Button } from '../Button';

/**
 * Close button component that closes the dialog when activated.
 * Supports keyboard navigation and proper event handling.
 */
export const DialogClose = ({
  as = 'button',
  ref,
  onClick,
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

  // Render props for children function
  const renderProps: DialogCloseRenderProps = {
    isOpen,
    close: () => setIsOpen(false),
  };

  return (
    <Button as={as} ref={ref} onClick={handleClick} {...props}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

DialogClose.displayName = 'DialogClose';
