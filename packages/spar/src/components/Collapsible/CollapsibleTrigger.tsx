import React from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import { useCollapsibleContext } from './Collapsible';
import type { CollapsibleTriggerProps, CollapsibleTriggerRenderProps } from './types';

/**
 * Collapsible trigger component that toggles the visibility of collapsible content.
 */
export const CollapsibleTrigger = ({
  as = 'button',
  children,
  onClick,
  onKeyDown,
  ...props
}: CollapsibleTriggerProps) => {
  const { isOpen, open, close, toggle, disabled, triggerId, contentId } = useCollapsibleContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    toggle();
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      onKeyDown?.(event);
      return;
    }

    // Handle Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent space from scrolling page
      toggle();
    }

    onKeyDown?.(event);
  };

  // Render props for children function
  const renderProps: CollapsibleTriggerRenderProps = {
    isOpen,
    disabled,
    open,
    close,
    toggle,
  };

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';

  return (
    <PrimitiveButton
      as={as}
      type='button'
      disabled={disabled}
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-state={dataState}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
