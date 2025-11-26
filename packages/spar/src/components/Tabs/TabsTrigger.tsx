import React, { useCallback, useEffect, useRef } from 'react';
import { useTabsContext } from './Tabs';
import type { TabsTriggerProps } from './types';

/**
 * TabsTrigger component representing a clickable tab button with full accessibility support
 */
export const TabsTrigger = ({
  value,
  disabled = false,
  asChild = false,
  as: Component = 'button',
  children,
  onClick,
  onFocus,
  onBlur,
  ...props
}: TabsTriggerProps) => {
  const { selectedValue, onValueChange, orientation, registerTab, unregisterTab, tabsListId } =
    useTabsContext();
  const triggerRef = useRef<HTMLElement>(null);
  const triggerId = `${tabsListId}-trigger-${value}`;
  const panelId = `${tabsListId}-panel-${value}`;

  const isSelected = selectedValue === value;

  useEffect(() => {
    const element = triggerRef.current;
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
      onFocus?.(event as React.FocusEvent<HTMLButtonElement>);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(event as React.FocusEvent<HTMLButtonElement>);
    },
    [onBlur],
  );

  if (asChild && React.isValidElement(children)) {
    const childProps = {
      ref: triggerRef,
      id: triggerId,
      role: 'tab',
      'aria-selected': isSelected,
      'aria-controls': panelId,
      'aria-disabled': disabled,
      'data-state': isSelected ? 'active' : 'inactive',
      'data-disabled': disabled ? '' : undefined,
      'data-orientation': orientation,
      'data-value': value,
      tabIndex: isSelected ? 0 : -1,
      onClick: handleClick,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    } as React.HTMLAttributes<HTMLElement>;

    return React.cloneElement(children, childProps);
  }

  return (
    <Component
      ref={triggerRef}
      id={triggerId}
      role='tab'
      type={Component === 'button' ? 'button' : undefined}
      aria-selected={isSelected}
      aria-controls={panelId}
      aria-disabled={disabled}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={orientation}
      data-value={value}
      tabIndex={isSelected ? 0 : -1}
      disabled={Component === 'button' ? disabled : undefined}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </Component>
  );
};

TabsTrigger.displayName = 'TabsTrigger';
