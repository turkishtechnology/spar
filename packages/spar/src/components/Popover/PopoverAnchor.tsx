import { type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import { PopoverAnchorProps, PopoverAnchorRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Anchor component for custom positioning reference
 */
export const PopoverAnchor = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: PopoverAnchorProps<T>) => {
  const Component = as || 'div';
  const { anchorRef, state } = usePopoverContext();

  const mergedRef = useMergedRef(anchorRef as React.RefObject<HTMLDivElement | null>, ref);

  // Render props for children function
  const renderProps: PopoverAnchorRenderProps = {
    isOpen: state.isOpen,
  };

  return (
    <Component ref={mergedRef} data-popover-anchor='' {...props}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
};

PopoverAnchor.displayName = 'PopoverAnchor';
