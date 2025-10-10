import { cloneElement, isValidElement } from 'react';
import { PopoverAnchorProps } from './types';
import { usePopoverContext } from './hooks/usePopoverContext';

/**
 * Anchor component for custom positioning reference
 */
export const PopoverAnchor = ({ asChild = false, children, ref, ...props }: PopoverAnchorProps) => {
  const { anchorRef } = usePopoverContext();

  const anchorProps = {
    ref: (element: HTMLDivElement | null) => {
      if (anchorRef && 'current' in anchorRef) {
        anchorRef.current = element;
      }
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    'data-popover-anchor': '',
    ...props,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, anchorProps);
  }

  return <div {...anchorProps}>{children}</div>;
};

PopoverAnchor.displayName = 'PopoverAnchor';
