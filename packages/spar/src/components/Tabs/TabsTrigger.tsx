import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import { useTabsContext } from './Tabs';
import type { TabsTriggerProps, TabsTriggerRenderProps } from './types';

/**
 * TabsTrigger component representing a clickable tab button with full accessibility support.
 * Supports render props pattern for complete rendering control.
 */
export const TabsTrigger = ({
  value,
  disabled = false,
  shouldAutoFocus = false,
  as = 'button',
  children,
  onClick,
  onFocus,
  onBlur,
  ...props
}: TabsTriggerProps) => {
  const { selectedValue, onValueChange, orientation, registerTab, unregisterTab, tabsListId } =
    useTabsContext();
  const internalRef = useRef<HTMLButtonElement>(null);
  const triggerId = `${tabsListId}-trigger-${value}`;
  const panelId = `${tabsListId}-panel-${value}`;
  const [isFocused, setIsFocused] = useState(false);

  const isSelected = selectedValue === value;

  useEffect(() => {
    const element = internalRef.current;
    if (element) {
      registerTab(value, element);
      return () => unregisterTab(value);
    }
    return undefined;
  }, [value, registerTab, unregisterTab]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onValueChange(value);
      }
      onClick?.(event);
    },
    [disabled, onValueChange, value, onClick],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  // Function to select this tab programmatically
  const selectTab = useCallback(() => {
    if (!disabled) {
      onValueChange(value);
    }
  }, [disabled, onValueChange, value]);

  // Render props for children function
  const renderProps: TabsTriggerRenderProps = {
    isSelected,
    select: selectTab,
    disabled,
    isFocused,
    orientation,
  };

  return (
    <PrimitiveButton
      as={as}
      type='button'
      disabled={disabled}
      shouldAutoFocus={shouldAutoFocus}
      ref={internalRef}
      id={triggerId}
      role='tab'
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={orientation}
      data-value={value}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

TabsTrigger.displayName = 'TabsTrigger';
