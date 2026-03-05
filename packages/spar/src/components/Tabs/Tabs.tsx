import { useMemo, useCallback, useRef, useId, type ElementType } from 'react';
import { useControlledState } from '@/hooks';
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
  dir = 'ltr',
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

  // Store references to tab elements for focus management
  const tabRefs = useRef<Map<string, HTMLElement>>(new Map());

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
      tabRefs.current.set(value, element);

      // Only auto-select for uncontrolled mode
      const shouldAutoSelectFirstTab =
        !isControlled && !selectedValue && !defaultValue && !hasAutoSelectedRef.current;

      if (shouldAutoSelectFirstTab) {
        hasAutoSelectedRef.current = true;
        setSelectedValue(value);
      }
    },
    [isControlled, selectedValue, defaultValue, setSelectedValue],
  );

  const unregisterTab = useCallback((value: string): void => {
    tabRefs.current.delete(value);
  }, []);

  const getTabIndex = useCallback((value: string): number => {
    const registeredTabValues = Array.from(tabRefs.current.keys());
    return registeredTabValues.indexOf(value);
  }, []);

  const focusTab = useCallback((value: string): void => {
    const targetTabElement = tabRefs.current.get(value);
    targetTabElement?.focus();
  }, []);

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
      dir,
      activationMode,

      // IDs for ARIA
      baseId,

      // Tab management
      tabRefs,
      registerTab,
      unregisterTab,
      getTabIndex,
      focusTab,
    }),
    [
      selectedValue,
      handleValueChange,
      orientation,
      dir,
      activationMode,
      baseId,
      registerTab,
      unregisterTab,
      getTabIndex,
      focusTab,
    ],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <Component ref={ref} data-orientation={orientation} data-dir={dir} {...props}>
        {children}
      </Component>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';
