import type { ElementType, ReactNode, RefObject } from 'react';
import type { Direction, Orientation, PolymorphicProps } from '../../types';
import type { ButtonOwnProps } from '../Button/types';

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
   * @param value - The new selected tab value
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
 * @remarks Fully accessible, headless tabbed interface
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
 * @remarks Container for tab trigger buttons with keyboard navigation
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
 * Own props for TabsTrigger component
 */
export interface TabsTriggerOwnProps extends ButtonOwnProps {
  /**
   * Unique identifier for the tab
   */
  value: string;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: TabsTriggerRenderProps) => ReactNode);
}

/**
 * Props for TabsTrigger component
 * @remarks Interactive tab button that selects a panel
 */
export type TabsTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  TabsTriggerOwnProps
>;

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
 * @remarks Panel content displayed when its matching tab is selected
 */
export type TabsContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  TabsContentOwnProps
>;

/**
 * Context value provided by Tabs root component
 * @internal
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
