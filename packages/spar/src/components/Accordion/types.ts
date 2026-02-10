import type { ElementType, ReactNode } from 'react';
import type { Orientation, PolymorphicProps } from '../../types';

export type AccordionType = 'single' | 'multiple';

/**
 * Own props for Accordion root component
 */
export interface AccordionOwnProps {
  /**
   * Single panel or multiple panels can be expanded
   * @defaultValue 'single'
   */
  type?: AccordionType;

  /**
   * Whether panels can be collapsed (only for single type)
   * @defaultValue false
   */
  isCollapsible?: boolean;

  /**
   * Controlled state - single value or array for multiple
   */
  value?: string | string[];

  /**
   * Uncontrolled initial state
   */
  defaultValue?: string | string[];

  /**
   * Callback when state changes
   * @param value - The new accordion value (string for single, string[] for multiple)
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * Disables all accordion items
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Orientation for keyboard navigation
   * @defaultValue 'vertical'
   */
  orientation?: Orientation;
}

/**
 * Props for Accordion root component
 * @remarks Fully accessible, headless component
 */
export type AccordionProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  AccordionOwnProps
>;

/**
 * Own props for AccordionItem component
 */
export interface AccordionItemOwnProps {
  /**
   * Unique identifier for the item
   */
  value: string;

  /**
   * Disables this specific item
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Props for AccordionItem component
 * @remarks Individual item within accordion
 */
export type AccordionItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  AccordionItemOwnProps
>;

/**
 * Own props for AccordionHeader component
 */
export interface AccordionHeaderOwnProps {
  /**
   * Heading level (1-6) for document hierarchy
   * @defaultValue 3
   */
  level?: number;
}

/**
 * Props for AccordionHeader component
 * @remarks Semantic heading wrapper for trigger
 */
export type AccordionHeaderProps<T extends ElementType = 'h3'> = PolymorphicProps<
  'h3',
  T,
  AccordionHeaderOwnProps
>;

/**
 * Render props provided to children function for AccordionTrigger
 */
export interface AccordionTriggerRenderProps {
  /**
   * Whether the accordion item is currently open/expanded
   */
  isOpen: boolean;
  /**
   * Whether the accordion item is disabled
   */
  disabled: boolean;
  /**
   * Function to open the accordion item
   */
  open: () => void;
  /**
   * Function to close the accordion item
   */
  close: () => void;
  /**
   * Function to toggle the open state
   */
  toggle: () => void;
}

/**
 * Own props for AccordionTrigger component
 */
export interface AccordionTriggerOwnProps {
  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: AccordionTriggerRenderProps) => ReactNode);
}

/**
 * Props for AccordionTrigger component
 * @remarks Button that toggles panel visibility
 */
export type AccordionTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  AccordionTriggerOwnProps
>;

/**
 * Own props for AccordionContent component
 */
export interface AccordionContentOwnProps {
  /**
   * Force content to remain mounted when collapsed
   * @defaultValue false
   */
  forceMount?: boolean;
}

/**
 * Props for AccordionContent component
 * @remarks Collapsible panel content
 */
export type AccordionContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  AccordionContentOwnProps
>;

// Internal context types

/**
 * @internal
 */
export interface AccordionContextValue {
  type: AccordionType;
  isCollapsible: boolean;
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  disabled: boolean;
  orientation: Orientation;
  registerItem: (itemValue: string) => void;
  unregisterItem: (itemValue: string) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  getItemIndex: (itemValue: string) => number;
  getItemAtIndex: (index: number) => string | undefined;
  itemCount: number;
}

/**
 * @internal
 */
export interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
