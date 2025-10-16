import type React from 'react';
import type { RefObject } from 'react';
import type { Direction, Orientation } from '../../types';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'automatic' | 'manual';

/**
 * Props for Tabs root component
 */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
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
  as?: React.ElementType;
}

/**
 * Props for TabsList component
 */
export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether arrow key navigation wraps around
   * @defaultValue true
   */
  loop?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;
}

/**
 * Props for TabsTrigger component
 */
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Unique identifier for the tab
   */
  value: string;

  /**
   * Disables this specific tab
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Render as child element instead of button (for advanced composition)
   * @defaultValue false
   */
  asChild?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: React.ElementType;
}

/**
 * Props for TabsContent component
 */
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
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
  as?: React.ElementType;
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
