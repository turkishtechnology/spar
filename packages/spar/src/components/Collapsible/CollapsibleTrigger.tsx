import React from 'react';
import { useCollapsibleContext } from './Collapsible';
import type { CollapsibleTriggerProps, CollapsibleTriggerRenderProps } from './types';
import { Button } from '../Button';

/**
 * Collapsible trigger component that toggles the visibility of collapsible content.
 */
export const CollapsibleTrigger = ({
  as = 'button',
  children,
  onClick,
  ...props
}: CollapsibleTriggerProps) => {
  const { isOpen, open, close, toggle, disabled, triggerId, contentId } = useCollapsibleContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    toggle();
    onClick?.(event);
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
    <Button
      as={as}
      id={triggerId}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-state={dataState}
      onClick={handleClick}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
