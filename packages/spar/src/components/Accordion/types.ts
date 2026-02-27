import type { ElementType } from 'react';
import type { Orientation, PolymorphicProps } from '../../types';
import type {
  CollapsibleOwnProps,
  CollapsibleTriggerRenderProps,
  CollapsibleTriggerOwnProps,
  CollapsibleTriggerProps,
  CollapsibleContentOwnProps,
  CollapsibleContentProps,
} from '../Collapsible/types';

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
export interface AccordionItemOwnProps extends CollapsibleOwnProps {
  /**
   * Unique identifier for the item
   */
  value: string;
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
 * @remarks Identical to CollapsibleTriggerRenderProps
 */
export type AccordionTriggerRenderProps = CollapsibleTriggerRenderProps;

/**
 * Own props for AccordionTrigger component
 * @remarks Identical to CollapsibleTriggerOwnProps
 */
export type AccordionTriggerOwnProps = CollapsibleTriggerOwnProps;

/**
 * Props for AccordionTrigger component
 * @remarks Button that toggles panel visibility
 */
export type AccordionTriggerProps<T extends ElementType = 'button'> = CollapsibleTriggerProps<T>;

/**
 * Own props for AccordionContent component
 * @remarks Identical to CollapsibleContentOwnProps
 */
export type AccordionContentOwnProps = CollapsibleContentOwnProps;

/**
 * Props for AccordionContent component
 * @remarks Collapsible panel content
 */
export type AccordionContentProps<T extends ElementType = 'div'> = CollapsibleContentProps<T>;

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
