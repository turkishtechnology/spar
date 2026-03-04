import type { ElementType, ReactNode, RefObject } from 'react';
import type { Side, Align, Direction, PolymorphicProps } from '../../types';
import type { LabelProps } from '../Label/types';
import type { ButtonOwnProps } from '../Button/types';

/**
 * Own props for Select root component
 */
export interface SelectOwnProps {
  /**
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-trigger`, `${id}-content`, `${id}-value`.
   */
  id?: string;

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
   * @param value - The new selected value
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
   * @param open - The new open state
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
   * Whether to focus the trigger on mount
   * @defaultValue false
   */
  autoFocus?: boolean;
}

/**
 * Props for Select root component
 * @remarks Fully accessible, headless select component
 */
export type SelectProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T, SelectOwnProps>;

/**
 * Render props provided to children function for SelectTrigger
 */
export interface SelectTriggerRenderProps {
  /**
   * Whether the dropdown is currently open
   */
  isOpen: boolean;
  /**
   * The currently selected value
   */
  value: string | undefined;
  /**
   * Whether the select is disabled
   */
  disabled: boolean;
  /**
   * Function to open the dropdown
   */
  open: () => void;
  /**
   * Function to close the dropdown
   */
  close: () => void;
  /**
   * Function to toggle the dropdown open/closed state
   */
  toggle: () => void;
}

/**
 * Own props for SelectTrigger component
 */
export interface SelectTriggerOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: SelectTriggerRenderProps) => ReactNode);
}

/**
 * Props for SelectTrigger component
 * @remarks Button that toggles the dropdown
 */
export type SelectTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  SelectTriggerOwnProps
>;

/**
 * Own props for SelectValue component
 */
export interface SelectValueOwnProps {
  /**
   * Text shown when no value selected
   */
  placeholder?: ReactNode;
}

/**
 * Props for SelectValue component
 * @remarks Displays the selected value or placeholder
 */
export type SelectValueProps<T extends ElementType = 'span'> = PolymorphicProps<
  'span',
  T,
  SelectValueOwnProps
>;

/**
 * Props for SelectIcon component
 * @remarks Optional visual indicator (chevron, arrow)
 */
export type SelectIconProps<T extends ElementType = 'span'> = PolymorphicProps<'span', T>;

/**
 * Own props for SelectContent component
 */
export interface SelectContentOwnProps {
  /**
   * Preferred side for positioning relative to trigger
   * @defaultValue 'bottom'
   */
  side?: Side;

  /**
   * Alignment relative to trigger
   * @defaultValue 'start'
   */
  align?: Align;

  /**
   * Distance from trigger in pixels
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * Offset along alignment axis in pixels
   * @defaultValue 0
   */
  alignOffset?: number;

  /**
   * Whether to adjust position to avoid viewport collisions
   * @defaultValue true
   */
  avoidCollisions?: boolean;

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
   * Whether to shift the content to stay in view
   * @defaultValue true
   */
  shift?: boolean;

  /**
   * Whether to constrain size to available space
   * @defaultValue true
   */
  size?: boolean;

  /**
   * Whether to hide when trigger is fully scrolled out of view
   * @defaultValue false
   */
  hide?: boolean;

  /**
   * Arrow element ref for arrow positioning
   */
  arrowRef?: RefObject<HTMLElement | SVGSVGElement>;

  /**
   * Portal container element. Content is portaled to document.body by default.
   * @defaultValue document.body
   */
  container?: HTMLElement | null;

  /**
   * Escape key handler
   * @param event - The keyboard event (call preventDefault to prevent close)
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Outside click handler
   * @param event - The pointer event (call preventDefault to prevent close)
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Focus handler on close
   * @param event - The focus event (call preventDefault to prevent focus restore)
   */
  onCloseAutoFocus?: (event: FocusEvent) => void;
}

/**
 * Props for SelectContent component
 * @remarks The dropdown container that appears when open
 */
export type SelectContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  SelectContentOwnProps
>;

/**
 * Props for SelectViewport component
 * @remarks Scrollable container for select items
 */
export type SelectViewportProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Render props provided to children function for SelectItem
 */
export interface SelectItemRenderProps {
  /**
   * Whether this item is currently selected
   */
  isSelected: boolean;
  /**
   * Whether this item is currently highlighted
   */
  isHighlighted: boolean;
  /**
   * Function to select this item
   */
  select: () => void;
  /**
   * Whether this item is disabled
   */
  disabled: boolean;
}

/**
 * Own props for SelectItem component
 */
export interface SelectItemOwnProps {
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
   * Children content or render function
   */
  children?: ReactNode | ((state: SelectItemRenderProps) => ReactNode);
}

/**
 * Props for SelectItem component
 * @remarks Individual selectable option
 */
export type SelectItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  SelectItemOwnProps
>;

/**
 * Props for SelectItemText component
 * @remarks The text content of an item
 */
export type SelectItemTextProps<T extends ElementType = 'span'> = PolymorphicProps<'span', T>;

/**
 * Own props for SelectItemIndicator component
 */
export interface SelectItemIndicatorOwnProps {
  /**
   * Force mount for animation
   * @defaultValue false
   */
  forceMount?: boolean;
}

/**
 * Props for SelectItemIndicator component
 * @remarks Visual indicator for selected state (checkmark, etc)
 */
export type SelectItemIndicatorProps<T extends ElementType = 'span'> = PolymorphicProps<
  'span',
  T,
  SelectItemIndicatorOwnProps
>;

/**
 * Props for SelectGroup component
 * @remarks Groups related items together
 */
export type SelectGroupProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Props for SelectLabel component
 * @remarks Label for a group of items
 */
export type SelectLabelProps<T extends ElementType = 'label'> = LabelProps<T>;

/**
 * Props for SelectSeparator component
 * @remarks Visual separator between items or groups
 */
export type SelectSeparatorProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Own props for SelectArrow component
 */
export interface SelectArrowOwnProps {
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
}

/**
 * Props for SelectArrow component
 * @remarks Optional arrow pointing to trigger
 */
export type SelectArrowProps<T extends ElementType = 'svg'> = PolymorphicProps<
  'svg',
  T,
  SelectArrowOwnProps
>;

/**
 * @internal
 */
export interface SelectItemData {
  value: string;
  textValue: string;
  disabled: boolean;
  ref: RefObject<HTMLElement | null>;
}

/**
 * @internal
 */
export interface SelectContextValue {
  // State
  open: boolean;
  value: string | undefined;
  disabled: boolean;
  required: boolean;
  dir: Direction;
  autoFocus: boolean;

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

/**
 * @internal
 */
export interface SelectItemContextValue {
  value: string;
  isSelected: boolean;
  disabled: boolean;
  isHighlighted: boolean;
  textValue: string;
  onSelect: () => void;
  registerItemText: (textValue: string) => void;
}

/**
 * @internal
 */
export interface SelectGroupContextValue {
  labelId: string;
}
