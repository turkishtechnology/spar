import { useCallback, useEffect, useRef, useState } from 'react';
import { useMergedRef } from '@/hooks';
import { useTabsContext } from './Tabs';
import type { TabsTriggerProps, TabsTriggerRenderProps } from './types';
import { Button } from '../Button';

/**
 * TabsTrigger component representing a clickable tab button with full accessibility support.
 * Supports render props pattern for complete rendering control.
 */
export const TabsTrigger = ({
  value,
  disabled = false,
  autoFocus = false,
  as = 'button',
  children,
  onClick,
  onFocus,
  onBlur,
  ref,
  ...props
}: TabsTriggerProps) => {
  const { selectedValue, onValueChange, orientation, registerTab, unregisterTab, tabsListId } =
    useTabsContext();
  const internalRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);
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
    <Button
      as={as}
      ref={mergedRef}
      id={triggerId}
      disabled={disabled}
      autoFocus={autoFocus}
      role='tab'
      aria-selected={isSelected}
      aria-controls={panelId}
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={orientation}
      data-value={value}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

TabsTrigger.displayName = 'TabsTrigger';
