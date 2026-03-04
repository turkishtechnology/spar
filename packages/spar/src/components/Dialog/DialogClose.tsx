import { ElementType } from 'react';
import { useDialogContext } from './hooks';
import { useCloseButton } from '@/hooks';
import type { DialogCloseProps } from './types';
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
  const { isOpen, setIsOpen } = useDialogContext();
  const { handleClick, renderProps } = useCloseButton({
    isOpen,
    close: () => setIsOpen(false),
    onClick,
  });

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
