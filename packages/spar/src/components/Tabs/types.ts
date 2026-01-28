import type { ElementType, RefObject } from 'react';
import type { Direction, Orientation, PolymorphicProps } from '../../types';
import type { ButtonProps } from '../Button/types';

export type TabsActivationMode = 'automatic' | 'manual';

/**
 * Own props for Tabs root component
 */
export interface TabsOwnProps {
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
}

/**
 * Props for Tabs root component
 */
export type TabsProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T, TabsOwnProps>;

/**
 * Own props for TabsList component
 */
export interface TabsListOwnProps {
  /**
   * Whether arrow key navigation wraps around
   * @defaultValue true
   */
  loop?: boolean;
}

/**
 * Props for TabsList component
 */
export type TabsListProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  TabsListOwnProps
>;

/**
 * Render props provided to children function for TabsTrigger
 */
export interface TabsTriggerRenderProps {
  /**
   * Whether this tab is currently selected
   */
  isSelected: boolean;
  /**
   * Function to select this tab programmatically
   */
  select: () => void;
  /**
   * Whether this tab is disabled
   */
  disabled: boolean;
  /**
   * Whether this tab is currently focused
   */
  isFocused: boolean;
  /**
   * The tab's orientation
   */
  orientation: Orientation;
}

/**
 * Props for TabsTrigger component
 */
export interface TabsTriggerProps extends Omit<ButtonProps, 'children'> {
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
   * Children content or render function
   */
  children?: React.ReactNode | ((state: TabsTriggerRenderProps) => React.ReactNode);
}

/**
 * Own props for TabsContent component
 */
export interface TabsContentOwnProps {
  /**
   * Unique identifier matching a TabsTrigger value
   */
  value: string;

  /**
   * Force content to remain mounted when not active
   * @defaultValue false
   */
  forceMount?: boolean;
}

/**
 * Props for TabsContent component
 */
export type TabsContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  TabsContentOwnProps
>;

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
