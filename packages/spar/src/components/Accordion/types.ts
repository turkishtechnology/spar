import type { ComponentProps, ElementType, ReactNode } from 'react';
import type { Orientation } from '../../types';

export type AccordionType = 'single' | 'multiple';

/**
 * Props for Accordion root component
 * @remarks Fully accessible, headless component
 */
export interface AccordionProps extends ComponentProps<'div'> {
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

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for AccordionItem component
 * @remarks Individual item within accordion
 */
export interface AccordionItemProps extends ComponentProps<'div'> {
  /**
   * Unique identifier for the item
   */
  value: string;

  /**
   * Disables this specific item
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for AccordionHeader component
 * @remarks Semantic heading wrapper for trigger
 */
export interface AccordionHeaderProps extends ComponentProps<'h3'> {
  /**
   * Heading level (1-6) for document hierarchy
   * @defaultValue 3
   */
  level?: number;

  /**
   * Polymorphic component type (heading element)
   * @defaultValue 'h3'
   */
  as?: ElementType;
}

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
 * Props for AccordionTrigger component
 * @remarks Button that toggles panel visibility
 */
export interface AccordionTriggerProps extends Omit<ComponentProps<'button'>, 'children'> {
  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: AccordionTriggerRenderProps) => ReactNode);
}

/**
 * Props for AccordionContent component
 * @remarks Collapsible panel content
 */
export interface AccordionContentProps extends ComponentProps<'div'> {
  /**
   * Force content to remain mounted when collapsed
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

// Internal context types
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
