import type { ElementType, ReactNode, RefObject } from 'react';
import type { Side, Align, PolymorphicProps } from '../../types';
import type { LabelProps } from '../Label/types';
import type { ButtonOwnProps } from '../Button/types';

export type SelectFocusStrategy = 'first' | 'last' | 'selected' | 'none';

/**
 * Own props for Select root component
 */
export interface SelectOwnProps {
  /**
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-trigger` and `${id}-content`.
   */
  id?: string;

  /**
   * Enables multi-select mode: `value` becomes an array, selecting an item
   * toggles it, and the listbox stays open on selection (see `closeOnSelect`).
   * @defaultValue false
   */
  multiple?: boolean;

  /**
   * Whether selecting an item closes the listbox and returns focus to the
   * trigger.
   * @defaultValue `!multiple`
   */
  closeOnSelect?: boolean;

  /**
   * Controlled selected value. A string in single mode, a string array when
   * `multiple` is set (scalars are coerced per mode).
   */
  value?: string | string[];

  /**
   * Uncontrolled initial value
   */
  defaultValue?: string | string[];

  /**
   * Callback when selection changes
   * @param value - The new selected value (array in `multiple` mode)
   */
  onChange?: (value: string | string[]) => void;

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
   * Select validation state. When inside a Field, inherited from Field.
   */
  invalid?: boolean;

  /**
   * Disables the entire select. When inside a Field, inherited from Field.
   */
  disabled?: boolean;

  /**
   * Makes the select required for forms. When inside a Field, inherited from Field.
   */
  required?: boolean;

  /**
   * Select read-only state. When inside a Field, inherited from Field.
   * A read-only select can be opened and inspected but its value cannot change.
   */
  readOnly?: boolean;

  /**
   * Form field name
   */
  name?: string;

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
   * The currently selected value (first selected in `multiple` mode)
   */
  value: string | undefined;
  /**
   * The label of the currently selected item (in `multiple` mode, all
   * selected labels joined with ', ')
   */
  label: string | undefined;
  /**
   * Every selected value; `[value]` or `[]` in single mode
   */
  values: string[];
  /**
   * Labels of every selected item, in selection order
   */
  labels: string[];
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
   * Text shown when no value is selected
   */
  placeholder?: ReactNode;

  /**
   * Children content or render function.
   * When omitted, the trigger displays the selected item's label or the placeholder.
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
   * Text label for this item. Shown in the trigger when this item is selected,
   * and used as the search key for keyboard typeahead.
   *
   * Should be set whenever `children` is not plain text (e.g. contains icons or
   * other elements) so the trigger can display a clean string representation.
   */
  label?: string;

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
 * Props for SelectArrow component
 * @remarks Optional arrow pointing to trigger. Headless: user provides all visuals.
 */
export type SelectArrowProps<T extends ElementType = 'svg'> = PolymorphicProps<'svg', T>;

/**
 * Registered item data, exposed through `useSelectContext().items`.
 */
export interface SelectItemData {
  value: string;
  label: string;
  disabled: boolean;
  ref: RefObject<HTMLElement | null>;
  mounted: boolean;
}

/**
 * Context returned by the public `useSelectContext()` hook. Deliberately kept
 * out of the stripped-from-declarations set — marking it internal would break
 * the hook's emitted return type for consumers.
 */
export interface SelectContextValue {
  // State
  open: boolean;
  value: string | string[] | undefined;
  multiple: boolean;
  closeOnSelect: boolean;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
  autoFocus: boolean;

  // Actions
  /** Item-scoped: pass the item's own value; the root replaces (single) or toggles (multiple). */
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;

  // Refs
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  arrowRef: RefObject<Element | null>;

  // IDs
  triggerId: string;
  contentId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;

  /** True when the Select is nested inside a Field. Drives aria-describedby emission. */
  hasField: boolean;

  // Collections
  items: Map<string, SelectItemData>;
  registerItem: (value: string, data: SelectItemData) => void;
  unregisterItem: (value: string) => void;

  // Focus strategy (consumed by SelectContent)
  focusStrategy: SelectFocusStrategy;
  setFocusStrategy: (strategy: SelectFocusStrategy) => void;
}

/**
 * @internal
 */
export interface SelectCollectionContextValue {
  highlightItem: (id: string | null) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  isItemHighlighted: (id: string) => boolean;
  highlightedId: string | null;
}

/**
 * @internal
 */
export interface SelectItemContextValue {
  value: string;
  isSelected: boolean;
  disabled: boolean;
  isHighlighted: boolean;
  label: string;
  onSelect: () => void;
}

/**
 * @internal
 */
export interface SelectGroupContextValue {
  labelId: string;
}
