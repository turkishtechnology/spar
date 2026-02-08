import { useCallback, ElementType } from 'react';
import { useDialogContext } from './hooks';
import type { DialogCloseProps, DialogCloseRenderProps } from './types';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Close button component that closes the dialog when activated.
 * Supports keyboard navigation and proper event handling.
 */
export const DialogClose = <T extends ElementType = 'button'>({
  as,
  ref,
  onClick,
  children,
  ...props
}: DialogCloseProps<T>) => {
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

  const buttonProps = {
    ...(as && { as }),
    ...(ref && { ref }),
    onClick: handleClick,
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

DialogClose.displayName = 'DialogClose';
