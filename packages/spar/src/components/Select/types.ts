import type React from 'react';
import type { Placement, Strategy, Middleware, VirtualElement } from '@floating-ui/react-dom';
import type { Direction } from '../../types';

// Re-export Floating UI types for public API
export type { Placement, Strategy, Middleware, VirtualElement };

export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

/**
 * Props for Select root component
 * @remarks Fully accessible, headless select component
 */
export interface SelectRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Uncontrolled initial value
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Uncontrolled initial open state
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Disables the entire select
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Makes the select required for forms
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Form field name
   */
  name?: string;

  /**
   * Reading direction
   * @defaultValue 'ltr'
   */
  dir?: Direction;

  /**
   * Polymorphic component type
   */
  as?: React.ElementType;

  /**
   * Select component children
   */
  children: React.ReactNode;
}

/**
 * Props for SelectTrigger component
 * @remarks Button that toggles the dropdown
 */
export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: React.ElementType;

  /**
   * Forward ref support
   */
  ref?: React.Ref<HTMLButtonElement>;

  /**
   * Trigger content
   */
  children: React.ReactNode;
}

/**
 * Props for SelectValue component
 * @remarks Displays the selected value or placeholder
 */
export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Text shown when no value selected
   */
  placeholder?: React.ReactNode;

  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: React.ElementType;

  /**
   * Optional children (usually not needed)
   */
  children?: React.ReactNode;
}

/**
 * Props for SelectIcon component
 * @remarks Optional visual indicator (chevron, arrow)
 */
export interface SelectIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: React.ElementType;

  /**
   * Icon content
   */
  children?: React.ReactNode;
}

/**
 * Props for SelectPortal component
 * @remarks Portal container for dropdown rendering
 */
export interface SelectPortalProps {
  /**
   * Portal target element
   * @defaultValue document.body
   */
  container?: HTMLElement | null;

  /**
   * Force mount for animation control
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Portal content
   */
  children: React.ReactNode;
}

/**
 * Props for SelectContent component
 * @remarks The dropdown container that appears when open
 */
export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Placement of the floating content relative to the trigger
   * @defaultValue 'bottom-start'
   */
  placement?: Placement;

  /**
   * Positioning strategy (absolute or fixed)
   * @defaultValue 'absolute'
   */
  strategy?: Strategy;

  /**
   * Custom middleware array for advanced positioning control
   */
  middleware?: Middleware[];

  /**
   * Distance from trigger in pixels
   * @defaultValue 5
   */
  offset?: number;

  /**
   * Whether to shift the content to stay in view
   * @defaultValue true
   */
  shift?: boolean;

  /**
   * Padding for shift calculations
   * @defaultValue 5
   */
  shiftPadding?: number;

  /**
   * Whether to flip to opposite side when no space
   * @defaultValue true
   */
  flip?: boolean;

  /**
   * Whether to hide when trigger is fully scrolled out of view
   * @defaultValue false
   */
  hide?: boolean;

  /**
   * Whether to constrain size to available space
   * @defaultValue true
   */
  size?: boolean;

  /**
   * Arrow element ref for arrow positioning
   */
  arrowRef?: React.RefObject<HTMLElement | SVGSVGElement>;

  /**
   * Escape key handler
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Outside click handler
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Focus handler on close
   */
  onCloseAutoFocus?: (event: FocusEvent) => void;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Forward ref support
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Content children
   */
  children: React.ReactNode;
}

/**
 * Props for SelectViewport component
 * @remarks Scrollable container for select items
 */
export interface SelectViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Viewport children
   */
  children: React.ReactNode;
}

/**
 * Props for SelectItem component
 * @remarks Individual selectable option
 */
export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Option value
   */
  value: string;

  /**
   * Disables the option
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Text for type-ahead (auto-detected if not provided)
   */
  textValue?: string;

  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Forward ref support
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Item content
   */
  children: React.ReactNode;
}

/**
 * Props for SelectItemText component
 * @remarks The text content of an item
 */
export interface SelectItemTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: React.ElementType;

  /**
   * Item text content
   */
  children: React.ReactNode;
}

/**
 * Props for SelectItemIndicator component
 * @remarks Visual indicator for selected state (checkmark, etc)
 */
export interface SelectItemIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Force mount for animation
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: React.ElementType;

  /**
   * Indicator content
   */
  children?: React.ReactNode;
}

/**
 * Props for SelectGroup component
 * @remarks Groups related items together
 */
export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Group children
   */
  children: React.ReactNode;
}

/**
 * Props for SelectLabel component
 * @remarks Label for a group of items
 */
export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Label content
   */
  children: React.ReactNode;
}

/**
 * Props for SelectSeparator component
 * @remarks Visual separator between items or groups
 */
export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Optional children
   */
  children?: React.ReactNode;
}

/**
 * Props for SelectArrow component
 * @remarks Optional arrow pointing to trigger
 */
export interface SelectArrowProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Arrow width
   * @defaultValue 10
   */
  width?: number;

  /**
   * Arrow height
   * @defaultValue 5
   */
  height?: number;

  /**
   * Polymorphic component type
   * @defaultValue 'svg'
   */
  as?: React.ElementType;

  /**
   * Forward ref support
   */
  ref?: React.Ref<SVGSVGElement>;

  /**
   * Optional children (custom arrow shape)
   */
  children?: React.ReactNode;
}

// Internal context types

export interface SelectItemData {
  value: string;
  textValue: string;
  disabled: boolean;
  ref: React.RefObject<HTMLElement | null>;
}

export interface SelectContextValue {
  // State
  open: boolean;
  value: string | undefined;
  disabled: boolean;
  required: boolean;
  dir: Direction;

  // Actions
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;

  // Refs
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  valueNodeRef: React.RefObject<HTMLElement | null>;

  // IDs
  triggerId: string;
  contentId: string;
  valueId: string;

  // Collections
  items: Map<string, SelectItemData>;
  registerItem: (value: string, data: SelectItemData) => void;
  unregisterItem: (value: string) => void;

  // Focus management
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;

  // Type-ahead
  searchString: string;
  setSearchString: (search: string) => void;
}

export interface SelectItemContextValue {
  value: string;
  isSelected: boolean;
  disabled: boolean;
  isHighlighted: boolean;
  textValue: string;
  onSelect: () => void;
  registerItemText: (textValue: string) => void;
}

export interface SelectGroupContextValue {
  labelId: string;
}
