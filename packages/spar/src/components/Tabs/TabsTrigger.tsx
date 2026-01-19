import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTabsContext } from './Tabs';
import type { TabsTriggerProps, TabsTriggerRenderProps } from './types';
import { useAutoFocus } from '../../hooks';

/**
 * TabsTrigger component representing a clickable tab button with full accessibility support.
 * Supports render props pattern for complete rendering control.
 */
export const TabsTrigger = ({
  value,
  disabled = false,
  shouldAutoFocus = false,
  as: Component = 'button',
  children,
  onClick,
  onFocus,
  onBlur,
  ...props
}: TabsTriggerProps) => {
  const { selectedValue, onValueChange, orientation, registerTab, unregisterTab, tabsListId } =
    useTabsContext();
  const internalRef = useRef<HTMLElement>(null);
  const triggerId = `${tabsListId}-trigger-${value}`;
  const panelId = `${tabsListId}-panel-${value}`;
  const [isFocused, setIsFocused] = useState(false);

  const isSelected = selectedValue === value;

  // Auto focus on mount
  useAutoFocus(internalRef, shouldAutoFocus);

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
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    },
    [disabled, onValueChange, value, onClick],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);
      onFocus?.(event as React.FocusEvent<HTMLButtonElement>);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      onBlur?.(event as React.FocusEvent<HTMLButtonElement>);
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
    <Component
      ref={internalRef}
      id={triggerId}
      role='tab'
      type={Component === 'button' ? 'button' : undefined}
      aria-selected={isSelected}
      aria-controls={panelId}
      {...(Component !== 'button' && disabled ? { 'aria-disabled': true } : {})}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={orientation}
      data-value={value}
      data-autofocus={shouldAutoFocus ? '' : undefined}
      tabIndex={isSelected ? 0 : -1}
      disabled={Component === 'button' ? disabled : undefined}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
};

TabsTrigger.displayName = 'TabsTrigger';
