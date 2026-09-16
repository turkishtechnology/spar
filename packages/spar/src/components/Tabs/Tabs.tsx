import { useMemo, useCallback, useId, type ElementType } from 'react';
import { useControlledState, useItemRegistry } from '@/hooks';
import { TabsContext } from './hooks';
import type { TabsProps, TabsContextValue } from './types';

/**
 * Tabs root component providing context and state management for tab navigation.
 * Supports controlled/uncontrolled patterns with full keyboard navigation.
 */
export const Tabs = <T extends ElementType = 'div'>({
  id: providedId,
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  as,
  children,
  ref,
  ...props
}: TabsProps<T>) => {
  const Component = as || 'div';

  // Generate unique IDs for ARIA relationships
  const generatedId = useId();
  const baseId = providedId ?? generatedId;

  // Item registry for tab element references and ordered tracking
  const {
    items: tabItems,
    registerItem,
    unregisterItem,
    getItemIds,
    getItemIndex,
  } = useItemRegistry<HTMLElement>();

  // Manage controlled/uncontrolled state
  const [selectedValue, setSelectedValue] = useControlledState(
    controlledValue,
    defaultValue,
    onValueChange,
  );

  // Without a `value` or `defaultValue` the first tab (in DOM order) is
  // selected. It is derived rather than stored, so it is never reported
  // through onValueChange and cannot go stale when that tab unmounts.
  const currentValue = selectedValue ?? getItemIds()[0];

  const focusTab = useCallback(
    (value: string): void => {
      tabItems.get(value)?.focus();
    },
    [tabItems],
  );

  // Re-activating the selected tab (click, Enter/Space, or navigation landing
  // on it) is not a change, so onValueChange only fires for a new value.
  const handleValueChange = useCallback(
    (value: string): void => {
      if (value === currentValue) return;
      setSelectedValue(value);
    },
    [currentValue, setSelectedValue],
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<TabsContextValue>(
    () => ({
      // State
      selectedValue: currentValue,
      onValueChange: handleValueChange,

      // Configuration
      orientation,
      activationMode,

      // IDs for ARIA
      baseId,

      // Tab management
      tabItems,
      registerTab: registerItem,
      unregisterTab: unregisterItem,
      getTabIndex: getItemIndex,
      focusTab,
    }),
    [
      currentValue,
      handleValueChange,
      orientation,
      activationMode,
      baseId,
      tabItems,
      registerItem,
      unregisterItem,
      getItemIndex,
      focusTab,
    ],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <Component ref={ref} data-orientation={orientation} {...props}>
        {children}
      </Component>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';
