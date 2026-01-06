import type {
  ElementType,
  ReactNode,
  Ref,
  RefObject,
  HTMLAttributes,
  ButtonHTMLAttributes,
  SVGAttributes,
} from 'react';
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
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
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
  as?: ElementType;

  /**
   * Select component children
   */
  children: ReactNode;
}

/**
 * Props for SelectTrigger component
 * @remarks Button that toggles the dropdown
 */
export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Forward ref support
   */
  ref?: Ref<HTMLButtonElement>;

  /**
   * Trigger content
   */
  children: ReactNode;
}

/**
 * Props for SelectValue component
 * @remarks Displays the selected value or placeholder
 */
export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Text shown when no value selected
   */
  placeholder?: ReactNode;

  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: ElementType;

  /**
   * Optional children (usually not needed)
   */
  children?: ReactNode;
}

/**
 * Props for SelectIcon component
 * @remarks Optional visual indicator (chevron, arrow)
 */
export interface SelectIconProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: ElementType;

  /**
   * Icon content
   */
  children?: ReactNode;
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
  children: ReactNode;
}

/**
 * Props for SelectContent component
 * @remarks The dropdown container that appears when open
 */
export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
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
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * Whether to shift the content to stay in view
   * @defaultValue true
   */
  shift?: boolean;

  /**
   * Padding from boundary edges (in pixels)
   * @defaultValue 8
   */
  collisionPadding?: number;

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
  arrowRef?: RefObject<HTMLElement | SVGSVGElement>;

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
  as?: ElementType;

  /**
   * Forward ref support
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Content children
   */
  children: ReactNode;
}

/**
 * Props for SelectViewport component
 * @remarks Scrollable container for select items
 */
export interface SelectViewportProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Viewport children
   */
  children: ReactNode;
}

/**
 * Props for SelectItem component
 * @remarks Individual selectable option
 */
export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
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
  as?: ElementType;

  /**
   * Forward ref support
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Item content
   */
  children: ReactNode;
}

/**
 * Props for SelectItemText component
 * @remarks The text content of an item
 */
export interface SelectItemTextProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: ElementType;

  /**
   * Item text content
   */
  children: ReactNode;
}

/**
 * Props for SelectItemIndicator component
 * @remarks Visual indicator for selected state (checkmark, etc)
 */
export interface SelectItemIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Force mount for animation
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Polymorphic component type
   * @defaultValue 'span'
   */
  as?: ElementType;

  /**
   * Indicator content
   */
  children?: ReactNode;
}

/**
 * Props for SelectGroup component
 * @remarks Groups related items together
 */
export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Group children
   */
  children: ReactNode;
}

/**
 * Props for SelectLabel component
 * @remarks Label for a group of items
 */
export interface SelectLabelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Label content
   */
  children: ReactNode;
}

/**
 * Props for SelectSeparator component
 * @remarks Visual separator between items or groups
 */
export interface SelectSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Optional children
   */
  children?: ReactNode;
}

/**
 * Props for SelectArrow component
 * @remarks Optional arrow pointing to trigger
 */
export interface SelectArrowProps extends SVGAttributes<SVGSVGElement> {
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
  as?: ElementType;

  /**
   * Forward ref support
   */
  ref?: Ref<SVGSVGElement>;

  /**
   * Optional children (custom arrow shape)
   */
  children?: ReactNode;
}

// Internal context types

export interface SelectItemData {
  value: string;
  textValue: string;
  disabled: boolean;
  ref: RefObject<HTMLElement | null>;
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
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  valueNodeRef: RefObject<HTMLElement | null>;

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
