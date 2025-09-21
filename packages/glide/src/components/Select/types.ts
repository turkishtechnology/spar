import type { ReactNode, ComponentPropsWithoutRef, Ref, RefObject, Dispatch } from 'react';

/**
 * Direction type for text and navigation
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Orientation type for UI components
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Advisory positioning preferences (no internal measuring)
 */
export interface SelectPositioningOptions {
  /** Preferred side relative to trigger @defaultValue 'bottom' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment on chosen side @defaultValue 'start' */
  align?: 'start' | 'center' | 'end';
  /** Allow overlap instead of displacement */
  overlap?: boolean;
  /** Consumer collision padding suggestion */
  collisionPadding?: number;
}

/**
 * Scroll alignment strategy for highlighted item
 * @defaultValue 'nearest'
 */
export type SelectScrollAlignment = ScrollIntoViewOptions['block'];

/**
 * Focus strategy for Select
 */
export type SelectFocusStrategy = 'active-descendant' | 'roving-tabindex';

/**
 * Props for SelectRoot component
 * @remarks Fully accessible, headless select component
 */
export interface SelectRootProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the root element
   */
  ref?: Ref<HTMLDivElement>;
  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Uncontrolled initial value
   */
  defaultValue?: string;

  /**
   * Callback fired when value changes
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
   * Callback fired when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Disabled state - properly announced to screen readers
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Required field for form validation
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Hidden input name for form submission
   */
  name?: string;

  /**
   * Base ID for generating stable sub-IDs
   */
  id?: string;

  /**
   * Whether keyboard navigation wraps at bounds
   * @defaultValue true
   */
  loop?: boolean;

  /**
   * Typeahead debounce duration in milliseconds
   * @defaultValue 350
   */
  typeaheadDebounce?: number;

  /**
   * Auto-focus trigger on mount
   * @defaultValue false
   */
  autoFocus?: boolean;

  /**
   * Text direction for navigation & typeahead
   * @defaultValue 'ltr'
   */
  dir?: Direction;

  /**
   * Whether selection follows keyboard highlight
   * @defaultValue false
   */
  selectionFollowsFocus?: boolean;

  /**
   * Advisory positioning metadata
   */
  positioning?: SelectPositioningOptions;

  /**
   * Focus management strategy
   * @defaultValue 'active-descendant'
   */
  focusStrategy?: SelectFocusStrategy;

  /**
   * Scroll alignment for highlighted items
   * @defaultValue 'nearest'
   */
  scrollAlignment?: SelectScrollAlignment;

  /**
   * Callback fired when highlight changes
   */
  onHighlightChange?: (value: string | null) => void;

  /**
   * Custom typeahead filter function
   */
  filter?: (optionText: string, typed: string) => boolean;

  /**
   * Additional disabled item values
   */
  disabledValues?: string[];

  /**
   * Multi-select mode (reserved for future)
   * @defaultValue false
   */
  multi?: boolean;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectTrigger component
 */
export interface SelectTriggerProps extends ComponentPropsWithoutRef<'button'> {
  /**
   * Optional ref for the trigger element
   */
  ref?: Ref<HTMLButtonElement>;

  /**
   * Local disabled override
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Keep focus on trigger when opening
   * @defaultValue false
   */
  preventFocusOnOpen?: boolean;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectValue component
 */
export interface SelectValueProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Optional ref for the value element
   */
  ref?: Ref<HTMLSpanElement>;

  /**
   * Placeholder text when no selection
   */
  placeholder?: string;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectContent component
 */
export interface SelectContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the content element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Collision padding advisory
   * @defaultValue 8
   */
  collisionPadding?: number;

  /**
   * Insert focus guards for portal
   * @defaultValue true
   */
  inertFocusGuards?: boolean;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectViewport component
 */
export interface SelectViewportProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the viewport element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Overscan hint for virtualization
   * @defaultValue 2
   */
  overscan?: number;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectGroup component
 */
export interface SelectGroupProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the group element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Accessible label id
   */
  labelId?: string;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectLabel component
 */
export interface SelectLabelProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the label element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectSeparator component
 */
export interface SelectSeparatorProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the separator element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectItem component
 */
export interface SelectItemProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the item element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Unique option value (required)
   */
  value: string;

  /**
   * Disabled state
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Explicit typeahead text (falls back to text content)
   */
  textValue?: string;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectItemText component
 */
export interface SelectItemTextProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Optional ref for the text element
   */
  ref?: Ref<HTMLSpanElement>;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectItemIndicator component
 */
export interface SelectItemIndicatorProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Optional ref for the indicator element
   */
  ref?: Ref<HTMLSpanElement>;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectScrollButton components
 */
export interface SelectScrollButtonProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional ref for the scroll button element
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectIcon component
 */
export interface SelectIconProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * Optional ref for the icon element
   */
  ref?: Ref<HTMLSpanElement>;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for SelectPortal component
 */
export interface SelectPortalProps {
  /**
   * Target container for portal
   * @defaultValue document.body
   */
  container?: HTMLElement | null;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Imperative handle exposed via ref on SelectRoot
 */
export interface SelectImperativeHandle {
  /** Open the select dropdown */
  open: () => void;
  /** Close the select dropdown */
  close: () => void;
  /** Toggle open/closed state */
  toggle: () => void;
  /** Focus the trigger element */
  focus: () => void;
  /** Highlight a specific item or clear highlight */
  highlight: (value: string | null) => void;
  /** Select a specific item value */
  select: (value: string) => void;
}

/**
 * Internal item registration data
 */
export interface SelectItemRegistration {
  value: string;
  disabled: boolean;
  getText: () => string;
  ref: RefObject<HTMLElement>;
}

/**
 * Internal state snapshot
 */
export interface SelectStateSnapshot {
  open: boolean;
  value: string | undefined;
  highlight: string | null;
  items: SelectItemRegistration[];
  disabledValues: Set<string>;
  typeahead: string;
}

/**
 * Reducer actions for state management
 */
export type SelectAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'REGISTER_ITEM'; item: SelectItemRegistration }
  | { type: 'UNREGISTER_ITEM'; value: string }
  | { type: 'HIGHLIGHT'; value: string | null }
  | { type: 'SELECT'; value: string }
  | { type: 'TYPEAHEAD_APPEND'; char: string }
  | { type: 'TYPEAHEAD_CLEAR' }
  | { type: 'UPDATE_DISABLED_SET'; values: Set<string> };

/**
 * Internal context value for Select components
 */
export interface SelectInternalContextValue {
  state: SelectStateSnapshot;
  dispatch: Dispatch<SelectAction>;
  /** Mutable props mirror for stable callbacks */
  propsRef: RefObject<{
    value?: string;
    onValueChange?: (v: string) => void;
    open?: boolean;
    onOpenChange?: (o: boolean) => void;
    selectionFollowsFocus?: boolean;
    loop: boolean;
    filter: (optionText: string, typed: string) => boolean;
    typeaheadDebounce: number;
    scrollAlignment: SelectScrollAlignment;
    onHighlightChange?: (v: string | null) => void;
    disabledValues: string[];
  }>;
  baseId: string;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  viewportRef: RefObject<HTMLElement | null>;
  highlightRef: RefObject<string | null>;
  typeaheadTimeoutRef: RefObject<number | null>;
  registerItem: (item: SelectItemRegistration) => void;
  unregisterItem: (value: string) => void;
  isItemDisabled: (value: string) => boolean;
  getItemData: (value: string) => SelectItemRegistration | undefined;
  positioning?: SelectPositioningOptions;
  rootDisabled?: boolean;
}

// Alias for root component naming parity
export type SelectProps = SelectRootProps;
