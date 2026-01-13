import type { ComponentProps, ElementType, ReactNode, SyntheticEvent, RefObject } from 'react';
import type { CheckedState, Side, Align, Direction } from '../../types';

export type DropdownMenuFocusStrategy = 'first' | 'last' | 'none';

/**
 * Props for DropdownMenu.Root component
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
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether menu is modal (focus trapped)
   * @defaultValue true
   */
  modal?: boolean;

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
 * Props for DropdownMenu.Trigger component
 */
export interface DropdownMenuTriggerProps extends ComponentProps<'button'> {
  /**
   * Polymorphic component type
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Render as child element
   * @defaultValue false
   */
  asChild?: boolean;
}

/**
 * Props for DropdownMenu.Content component
 */
export interface DropdownMenuContentProps extends ComponentProps<'div'> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

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
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Outside click handler
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Outside focus handler
   */
  onFocusOutside?: (event: FocusEvent) => void;
}

/**
 * Props for DropdownMenu.Item component
 */
export interface DropdownMenuItemProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Whether item is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Selection handler
   */
  onSelect?: (event: SyntheticEvent<HTMLElement>) => void;

  /**
   * Value for typeahead search
   */
  textValue?: string;
}

/**
 * Props for DropdownMenu.CheckboxItem component
 */
export interface DropdownMenuCheckboxItemProps extends DropdownMenuItemProps {
  /**
   * Controlled checked state
   * @defaultValue false
   */
  checked?: CheckedState;

  /**
   * Checked state change handler
   */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Props for DropdownMenu.RadioGroup component
 */
export interface DropdownMenuRadioGroupProps extends ComponentProps<'div'> {
  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Value change handler
   */
  onValueChange?: (value: string) => void;
}

/**
 * Props for DropdownMenu.RadioItem component
 */
export interface DropdownMenuRadioItemProps extends DropdownMenuItemProps {
  /**
   * Unique value for this radio item
   */
  value: string;
}

/**
 * Props for DropdownMenu.Separator component
 */
export interface DropdownMenuSeparatorProps extends ComponentProps<'div'> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for DropdownMenu.Label component
 */
export interface DropdownMenuLabelProps extends ComponentProps<'div'> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for DropdownMenu.Group component
 */
export interface DropdownMenuGroupProps extends ComponentProps<'div'> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for DropdownMenu.Sub component
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
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Props for DropdownMenu.SubTrigger component
 */
export interface DropdownMenuSubTriggerProps extends DropdownMenuItemProps {}

/**
 * Props for DropdownMenu.SubContent component
 */
export interface DropdownMenuSubContentProps extends DropdownMenuContentProps {}

/**
 * Internal context value for DropdownMenu
 */
export interface DropdownMenuContextValue {
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
}

/**
 * Context value for DropdownMenu.RadioGroup
 */
export interface DropdownMenuRadioGroupContextValue {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
}

/**
 * Context value for DropdownMenu.Sub
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
}
