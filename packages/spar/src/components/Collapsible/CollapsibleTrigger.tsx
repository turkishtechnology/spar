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
  const { isOpen, toggle, disabled, triggerId, contentId } = useCollapsibleContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    toggle();
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
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

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';

  // Build props with conditional logic for button vs non-button elements
  const isButton = Component === 'button';
  const triggerProps = {
    id: triggerId,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    'data-state': dataState,
    'data-disabled': disabled ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...props,
    // Button-specific props
    ...(isButton && { type: 'button' as const, disabled }),
    // Non-button props for accessibility
    ...(!isButton && {
      role: 'button',
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
    }),
  };

  return <Component {...triggerProps}>{children}</Component>;
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
