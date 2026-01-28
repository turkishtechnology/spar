import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useId,
  type ElementType,
} from 'react';
import { useControlledState } from '../../hooks/useControlledState';
import type { TabsProps, TabsContextValue } from './types';

// ============================================================================
// Context
// ============================================================================

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Hook to access Tabs context. Must be used within a Tabs component.
 *
 * @returns TabsContextValue containing state and methods for tab management
 * @throws Error if used outside of Tabs context
 */
export const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs');
  }
  return context;
};

// ============================================================================
// Component
// ============================================================================

/**
 * Tabs root component providing context and state management for tab navigation.
 * Supports controlled/uncontrolled patterns with full keyboard navigation.
 */
export const Tabs = <T extends ElementType = 'div'>({
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
  // ============================================================================
  // State Management
  // ============================================================================

  // Check if component is in controlled mode
  const isControlled = controlledValue !== undefined;

  // Generate unique IDs for ARIA relationships
  const tabsListId = useId();

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

  // ============================================================================
  // Tab Registration Callbacks
  // ============================================================================

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

  // ============================================================================
  // Focus Management Callbacks
  // ============================================================================

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

  // ============================================================================
  // Context Value
  // ============================================================================

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
      loop: true, // Default value, overridden by TabsList if needed

      // IDs for ARIA
      tabsListId,

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
      tabsListId,
      registerTab,
      unregisterTab,
      getTabIndex,
      focusTab,
    ],
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <TabsContext.Provider value={contextValue}>
      <Component ref={ref} data-orientation={orientation} data-dir={dir} {...props}>
        {children}
      </Component>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';
