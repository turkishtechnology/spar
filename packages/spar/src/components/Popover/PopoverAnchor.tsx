import { useMergedRef } from '@/hooks';
import { PopoverAnchorProps, PopoverAnchorRenderProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Anchor component for custom positioning reference
 */
export const PopoverAnchor = ({ children, ref, ...props }: PopoverAnchorProps) => {
  const { anchorRef, state } = usePopoverContext();

  const mergedRef = useMergedRef(anchorRef as React.RefObject<HTMLDivElement | null>, ref);

  // Render props for children function
  const renderProps: PopoverAnchorRenderProps = {
    isOpen: state.isOpen,
  };

  return (
    <div ref={mergedRef} data-popover-anchor='' {...props}>
      {typeof children === 'function' ? children(renderProps) : children}
    </div>
  );
};

PopoverAnchor.displayName = 'PopoverAnchor';
