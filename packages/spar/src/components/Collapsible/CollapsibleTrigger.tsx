import React, { useCallback, ElementType } from 'react';
import { useCollapsibleContext } from './hooks';
import type { CollapsibleTriggerProps, CollapsibleTriggerRenderProps } from './types';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Collapsible trigger component that toggles the visibility of collapsible content.
 */
export const CollapsibleTrigger = <T extends ElementType = 'button'>({
  as,
  disabled: disabledProp,
  children,
  onClick,
  ...props
}: CollapsibleTriggerProps<T>) => {
  const {
    isOpen,
    open,
    close,
    toggle,
    disabled: contextDisabled,
    triggerId,
    contentId,
  } = useCollapsibleContext();

  // Use prop if explicitly provided, otherwise use context
  const disabled = disabledProp ?? contextDisabled;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      toggle();
      onClick?.(event);
    },
    [disabled, toggle, onClick],
  );

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

  const buttonProps = {
    ...(as && { as }),
    id: triggerId,
    disabled,
    'aria-expanded': isOpen,
    'aria-controls': contentId,
    'data-state': dataState,
    onClick: handleClick,
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
