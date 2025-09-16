import type React from 'react';

export type AccordionType = 'single' | 'multiple';
export type AccordionOrientation = 'vertical' | 'horizontal';

/**
 * Props for Accordion root component
 * @remarks Fully accessible, headless component
 */
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
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
  isDisabled?: boolean;

  /**
   * Orientation for keyboard navigation
   * @defaultValue 'vertical'
   */
  orientation?: AccordionOrientation;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * AccordionItem components
   */
  children: React.ReactNode;
}

/**
 * Props for AccordionItem component
 * @remarks Individual item within accordion
 */
export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique identifier for the item
   */
  value: string;

  /**
   * Disables this specific item
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * AccordionHeader and AccordionContent components
   */
  children: React.ReactNode;
}

/**
 * Props for AccordionHeader component
 * @remarks Semantic heading wrapper for trigger
 */
export interface AccordionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level (1-6) for document hierarchy
   * @defaultValue 3
   */
  level?: number;

  /**
   * Polymorphic component type (heading element)
   * @defaultValue 'h3'
   */
  as?: React.ElementType;

  /**
   * AccordionTrigger component
   */
  children: React.ReactNode;
}

/**
 * Props for AccordionTrigger component
 * @remarks Button that toggles panel visibility
 */
export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: React.ElementType;

  /**
   * Trigger content (heading text)
   */
  children: React.ReactNode;
}

/**
 * Props for AccordionContent component
 * @remarks Collapsible panel content
 */
export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Force content to remain mounted when collapsed
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Panel content
   */
  children: React.ReactNode;
}

// Internal context types
export interface AccordionContextValue {
  type: AccordionType;
  isCollapsible: boolean;
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  isDisabled: boolean;
  orientation: AccordionOrientation;
  registeredItems: Set<string>;
  registerItem: (itemValue: string) => void;
  unregisterItem: (itemValue: string) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  getItemIndex: (itemValue: string) => number;
  getItemAtIndex: (index: number) => string | undefined;
  getTotalItems: () => number;
}

export interface AccordionItemContextValue {
  value: string;
  isExpanded: boolean;
  isDisabled: boolean;
  triggerId: string;
  contentId: string;
  onToggle: () => void;
}
