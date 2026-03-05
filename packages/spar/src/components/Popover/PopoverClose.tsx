import { ElementType } from 'react';
import type { PopoverCloseProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';
import { useCloseButton } from '@/hooks';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Close button component that automatically closes the popover
 */
export const PopoverClose = <T extends ElementType = 'button'>({
  as,
  children,
  onClick,
  ref,
  ...props
}: PopoverCloseProps<T>) => {
  const { closePopover, state } = usePopoverContext();
  const { handleClick, renderProps } = useCloseButton({
    isOpen: state.isOpen,
    close: closePopover,
    onClick,
  });

  const buttonProps = {
    ...(as && { as }),
    ...(ref && { ref }),
    onClick: handleClick,
    'data-popover-close': '',
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

PopoverClose.displayName = 'PopoverClose';
