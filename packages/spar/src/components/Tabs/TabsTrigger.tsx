import React, { useCallback, useEffect, useRef } from 'react';
import { useTabsContext } from './Tabs';
import type { TabsTriggerProps } from './types';
import { useAutoFocus } from '../../hooks';

/**
 * TabsTrigger component representing a clickable tab button with full accessibility support
 */
export const TabsTrigger = ({
  value,
  disabled = false,
  shouldAutoFocus = false,
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
  const internalRef = useRef<HTMLElement>(null);
  const triggerId = `${tabsListId}-trigger-${value}`;
  const panelId = `${tabsListId}-panel-${value}`;

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
      ref: internalRef,
      id: triggerId,
      role: 'tab',
      'aria-selected': isSelected,
      'aria-controls': panelId,
      ...(Component !== 'button' && disabled ? { 'aria-disabled': true } : {}),
      'data-state': isSelected ? 'active' : 'inactive',
      'data-disabled': disabled ? '' : undefined,
      'data-orientation': orientation,
      'data-value': value,
      'data-autofocus': shouldAutoFocus ? '' : undefined,
      tabIndex: isSelected ? 0 : -1,
      onClick: handleClick,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    };
    return React.cloneElement(children, childProps as Partial<React.HTMLAttributes<HTMLElement>>);
  }

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
      {children}
    </Component>
  );
};

TabsTrigger.displayName = 'TabsTrigger';
