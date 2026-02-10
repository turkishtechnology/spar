import type { ComponentProps, ElementType, ReactNode, SyntheticEvent, RefObject } from 'react';
import type { CheckedState, Side, Align, Direction, PolymorphicProps } from '../../types';
import type { ButtonProps } from '../Button/types';

export type DropdownMenuFocusStrategy = 'first' | 'last' | 'none';

/**
 * Render props provided to DropdownMenuTrigger children function
 */
export interface DropdownMenuTriggerRenderProps {
  /**
   * Whether the dropdown menu is currently open
   */
  isOpen: boolean;
  /**
   * Whether the trigger is disabled
   */
  disabled: boolean;
  /**
   * Function to open the dropdown menu
   */
  open: () => void;
  /**
   * Function to close the dropdown menu
   */
  close: () => void;
  /**
   * Function to toggle the dropdown menu open/closed state
   */
  toggle: () => void;
}

/**
 * Props for DropdownMenu component
 * @remarks Root component managing menu state and context
 */
export interface DropdownMenuProps {
  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Uncontrolled default open state
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether menu is modal (focus trapped)
   * @defaultValue true
   */
  modal?: boolean;

  /**
   * Disables all dropdown menu triggers (prevents opening)
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Reading direction for positioning
   * @defaultValue 'ltr'
   */
  dir?: Direction;

  /**
   * Selection close policy
   * @defaultValue 'auto'
   */
  closeOnSelect?: boolean | 'auto';

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for DropdownMenuTrigger component
 * @remarks Button that toggles menu visibility
 */
export interface DropdownMenuTriggerProps extends Omit<ButtonProps, 'children'> {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: DropdownMenuTriggerRenderProps) => ReactNode);
}

/**
 * Own props for DropdownMenuContent component
 */
export interface DropdownMenuContentOwnProps {
  /**
   * Preferred placement side
   * @defaultValue 'bottom'
   */
  side?: Side;

  /**
   * Alignment on placement side
   * @defaultValue 'start'
   */
  align?: Align;

  /**
   * Offset from trigger (in pixels)
   * @defaultValue 8
   */
  sideOffset?: number;

  /**
   * Alignment offset (in pixels)
   * @defaultValue 0
   */
  alignOffset?: number;

  /**
   * Automatically adjust position to avoid collisions
   * @defaultValue true
   */
  avoidCollisions?: boolean;

  /**
   * Boundary element for collision detection
   * @defaultValue clippingAncestors
   */
  collisionBoundary?: Element | Element[] | null;

  /**
   * Padding from boundary edges (in pixels)
   * @defaultValue 8
   */
  collisionPadding?: number;

  /**
   * Allow focus to loop through items
   * @defaultValue false
   */
  loop?: boolean;

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
   * Outside focus handler
   * @param event - The focus event (call preventDefault to prevent close)
   */
  onFocusOutside?: (event: FocusEvent) => void;
}

/**
 * Props for DropdownMenuContent component
 * @remarks Floating content panel with positioning and keyboard navigation
 */
export type DropdownMenuContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuContentOwnProps
>;

/**
 * Own props for DropdownMenuItem component
 */
export interface DropdownMenuItemOwnProps {
  /**
   * Whether item is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Selection handler
   * @param event - The selection event (call preventDefault to prevent menu close)
   */
  onSelect?: (event: SyntheticEvent<HTMLElement>) => void;

  /**
   * Value for typeahead search
   */
  textValue?: string;
}

/**
 * Props for DropdownMenuItem component
 * @remarks Actionable item within the menu
 */
export type DropdownMenuItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuItemOwnProps
>;

/**
 * Own props for DropdownMenuCheckboxItem component
 */
export interface DropdownMenuCheckboxItemOwnProps extends DropdownMenuItemOwnProps {
  /**
   * Controlled checked state
   * @defaultValue false
   */
  checked?: CheckedState;

  /**
   * Checked state change handler
   * @param checked - The new checked state
   */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Props for DropdownMenuCheckboxItem component
 * @remarks Toggleable checkbox item within the menu
 */
export type DropdownMenuCheckboxItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuCheckboxItemOwnProps
>;

/**
 * Props for DropdownMenuRadioGroup component
 * @remarks Groups radio items with mutual exclusion
 */
export interface DropdownMenuRadioGroupProps extends ComponentProps<'div'> {
  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Value change handler
   * @param value - The new selected value
   */
  onValueChange?: (value: string) => void;
}

/**
 * Own props for DropdownMenuRadioItem component
 */
export interface DropdownMenuRadioItemOwnProps extends DropdownMenuItemOwnProps {
  /**
   * Unique value for this radio item
   */
  value: string;
}

/**
 * Props for DropdownMenuRadioItem component
 * @remarks Radio-style item within a radio group
 */
export type DropdownMenuRadioItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuRadioItemOwnProps
>;

/**
 * Own props for DropdownMenuSeparator component
 */
export interface DropdownMenuSeparatorOwnProps {}

/**
 * Props for DropdownMenuSeparator component
 * @remarks Visual divider between menu item groups
 */
export type DropdownMenuSeparatorProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuSeparatorOwnProps
>;

/**
 * Own props for DropdownMenuLabel component
 */
export interface DropdownMenuLabelOwnProps {}

/**
 * Props for DropdownMenuLabel component
 * @remarks Non-interactive label for a menu group
 */
export type DropdownMenuLabelProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuLabelOwnProps
>;

/**
 * Own props for DropdownMenuGroup component
 */
export interface DropdownMenuGroupOwnProps {}

/**
 * Props for DropdownMenuGroup component
 * @remarks Semantic grouping container for related items
 */
export type DropdownMenuGroupProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuGroupOwnProps
>;

/**
 * Props for DropdownMenuSub component
 * @remarks Nested sub-menu root managing submenu state
 */
export interface DropdownMenuSubProps {
  /**
   * Controlled submenu open state
   */
  open?: boolean;

  /**
   * Default submenu open state
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Submenu open change handler
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Own props for DropdownMenuSubTrigger component
 */
export interface DropdownMenuSubTriggerOwnProps extends DropdownMenuItemOwnProps {}

/**
 * Props for DropdownMenuSubTrigger component
 * @remarks Item that opens a sub-menu on hover or keyboard
 */
export type DropdownMenuSubTriggerProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuSubTriggerOwnProps
>;

/**
 * Own props for DropdownMenuSubContent component
 */
export interface DropdownMenuSubContentOwnProps extends DropdownMenuContentOwnProps {}

/**
 * Props for DropdownMenuSubContent component
 * @remarks Content panel for a nested sub-menu
 */
export type DropdownMenuSubContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  DropdownMenuSubContentOwnProps
>;

/**
 * Internal context value for DropdownMenu
 * @internal
 */
export interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  modal: boolean;
  disabled: boolean;
  dir: Direction;
  closeOnSelect: boolean | 'auto';
  focusStrategy: DropdownMenuFocusStrategy;
  setFocusStrategy: (strategy: DropdownMenuFocusStrategy) => void;
  triggerRef: RefObject<HTMLElement | null>;
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
}

/**
 * Context value for DropdownMenuRadioGroup
 * @internal
 */
export interface DropdownMenuRadioGroupContextValue {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
}

/**
 * Context value for DropdownMenuSub
 * @internal
 */
export interface DropdownMenuSubContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  modal: boolean;
  dir: Direction;
  closeOnSelect: boolean | 'auto';
  focusStrategy: DropdownMenuFocusStrategy;
  setFocusStrategy: (strategy: DropdownMenuFocusStrategy) => void;
  triggerRef: RefObject<HTMLElement | null>;
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
  closeRootMenu: (options?: { focusTrigger?: boolean }) => void;
}

/**
 * Collection item registered in menu content
 */
export interface MenuCollectionItem {
  id: string;
  ref: RefObject<HTMLElement | null>;
  disabled: boolean;
  textValue: string;
  type: 'item' | 'checkbox' | 'radio' | 'subtrigger';
}

/**
 * Context value for DropdownMenuCollection
 * @internal
 */
export interface DropdownMenuCollectionContextValue {
  registerItem: (item: MenuCollectionItem) => void;
  unregisterItem: (id: string) => void;
  highlightItem: (id: string | null) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  isItemHighlighted: (id: string) => boolean;
  highlightedId: string | null;
  closeOnSelect: boolean | 'auto';
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
  loop: boolean;
  dir: Direction;
}
