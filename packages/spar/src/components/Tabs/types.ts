import type { ComponentProps, ElementType, RefObject } from 'react';
import type { Direction, Orientation } from '../../types';

export type TabsActivationMode = 'automatic' | 'manual';

/**
 * Props for Tabs root component
 */
export interface TabsProps extends ComponentProps<'div'> {
  /**
   * Controlled selected tab value
   */
  value?: string;

  /**
   * Uncontrolled initial tab selection
   * @defaultValue First tab value
   */
  defaultValue?: string;

  /**
   * Callback when tab selection changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Tabs orientation affecting keyboard navigation
   * @defaultValue 'horizontal'
   */
  orientation?: Orientation;

  /**
   * Text direction for arrow key navigation
   * @defaultValue 'ltr'
   */
  dir?: Direction;

  /**
   * Whether tabs activate on focus or require explicit activation
   * @defaultValue 'automatic'
   */
  activationMode?: TabsActivationMode;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for TabsList component
 */
export interface TabsListProps extends ComponentProps<'div'> {
  /**
   * Whether arrow key navigation wraps around
   * @defaultValue true
   */
  loop?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for TabsTrigger component
 */
export interface TabsTriggerProps extends ComponentProps<'button'> {
  /**
   * Unique identifier for the tab
   */
  value: string;

  /**
   * Whether to focus this tab trigger on mount
   * @defaultValue false
   */
  shouldAutoFocus?: boolean;

  /**
   * Render as child element instead of button (for advanced composition)
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: ElementType;
}

/**
 * Props for TabsContent component
 */
export interface TabsContentProps extends ComponentProps<'div'> {
  /**
   * Unique identifier matching a TabsTrigger value
   */
  value: string;

  /**
   * Force content to remain mounted when not active
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Context value provided by Tabs root component
 */
export interface TabsContextValue {
  selectedValue: string | undefined;
  onValueChange: (value: string) => void;
  orientation: Orientation;
  dir: Direction;
  activationMode: TabsActivationMode;
  loop: boolean;
  tabsListId: string;
  tabRefs: RefObject<Map<string, HTMLElement>>;
  registerTab: (value: string, element: HTMLElement) => void;
  unregisterTab: (value: string) => void;
  getTabIndex: (value: string) => number;
  focusTab: (value: string) => void;
}
