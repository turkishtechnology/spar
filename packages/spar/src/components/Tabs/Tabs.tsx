import { useMemo, useCallback, useRef, useId, type ElementType } from 'react';
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

  // Check if component is in controlled mode
  const isControlled = controlledValue !== undefined;

  // Generate unique IDs for ARIA relationships
  const generatedId = useId();
  const baseId = providedId ?? generatedId;

  // Item registry for tab element references and ordered tracking
  const {
    items: tabItems,
    registerItem,
    unregisterItem,
    getItemIndex,
  } = useItemRegistry<HTMLElement>();

  // Track if auto-selection has occurred to prevent multiple selections
  const hasAutoSelectedRef = useRef(false);

  // Manage controlled/uncontrolled state
  const [selectedValue, setSelectedValue] = useControlledState(
    controlledValue,
    defaultValue,
    onValueChange,
  );

  const registerTab = useCallback(
    (value: string, element: HTMLElement): void => {
      registerItem(value, element);

      // Only auto-select for uncontrolled mode
      const shouldAutoSelectFirstTab =
        !isControlled && !selectedValue && !defaultValue && !hasAutoSelectedRef.current;

      if (shouldAutoSelectFirstTab) {
        hasAutoSelectedRef.current = true;
        setSelectedValue(value);
      }
    },
    [isControlled, selectedValue, defaultValue, setSelectedValue, registerItem],
  );

  const unregisterTab = useCallback(
    (value: string): void => {
      unregisterItem(value);
    },
    [unregisterItem],
  );

  const getTabIndex = useCallback(
    (value: string): number => {
      return getItemIndex(value);
    },
    [getItemIndex],
  );

  const focusTab = useCallback(
    (value: string): void => {
      tabItems.get(value)?.focus();
    },
    [tabItems],
  );

  const handleValueChange = useCallback(
    (value: string): void => {
      setSelectedValue(value);
    },
    [setSelectedValue],
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<TabsContextValue>(
    () => ({
      // State
      selectedValue,
      onValueChange: handleValueChange,

      // Configuration
      orientation,
      activationMode,

      // IDs for ARIA
      baseId,

      // Tab management
      tabItems,
      registerTab,
      unregisterTab,
      getTabIndex,
      focusTab,
    }),
    [
      selectedValue,
      handleValueChange,
      orientation,
      activationMode,
      baseId,
      tabItems,
      registerTab,
      unregisterTab,
      getTabIndex,
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
