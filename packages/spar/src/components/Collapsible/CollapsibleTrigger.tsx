import React from 'react';
import { useCollapsibleContext } from './Collapsible';
import type { CollapsibleTriggerProps } from './types';

/**
 * Collapsible trigger component that toggles the visibility of collapsible content.
 */
export const CollapsibleTrigger = ({
  as: Component = 'button',
  children,
  onClick,
  onKeyDown,
  ...props
}: CollapsibleTriggerProps) => {
  const { isOpen, toggle, isDisabled, triggerId, contentId } = useCollapsibleContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) return;
    toggle();
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isDisabled) {
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

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';

  // Common props for all component types
  const commonProps = {
    id: triggerId,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    'data-state': dataState,
    'data-disabled': isDisabled ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...props,
  };

  // Handle disabled state based on component type
  if (Component === 'button') {
    // Use native disabled attribute for semantic button elements
    return (
      <Component type='button' disabled={isDisabled} {...commonProps}>
        {children}
      </Component>
    );
  } else {
    // Use aria-disabled and tabIndex for non-semantic elements
    return (
      <Component
        role='button'
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        {...commonProps}
      >
        {children}
      </Component>
    );
  }
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
