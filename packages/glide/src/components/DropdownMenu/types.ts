import type { ElementType, ReactNode, HTMLAttributes, Ref, SyntheticEvent, RefObject } from 'react';

export type Orientation = 'vertical' | 'horizontal';

export type Side = 'top' | 'right' | 'bottom' | 'left';

export type Align = 'start' | 'center' | 'end';

export type CheckedState = boolean | 'indeterminate';

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
  dir?: 'ltr' | 'rtl';

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
export interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLElement> {
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

  /**
   * Whether trigger is disabled
   */
  disabled?: boolean;

  /**
   * Ref forwarded to trigger element
   */
  ref?: Ref<HTMLElement | null>;
}

/**
 * Props for DropdownMenu.Content component
 */
export interface DropdownMenuContentProps extends HTMLAttributes<HTMLElement> {
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
   * Offset from trigger
   * @defaultValue 0
   */
  sideOffset?: number;

  /**
   * Alignment offset
   * @defaultValue 0
   */
  alignOffset?: number;

  /**
   * Automatically adjust position
   * @defaultValue true
   */
  avoidCollisions?: boolean;

  /**
   * Boundary for collision detection
   */
  collisionBoundary?: Element | null;

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

  /**
   * Ref forwarded to content element
   */
  ref?: Ref<HTMLElement | null>;
}

/**
 * Props for DropdownMenu.Item component
 */
export interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
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

  /**
   * Ref forwarded to item element
   */
  ref?: Ref<HTMLElement | null>;
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
export interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLElement> {
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
export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Ref forwarded to separator element
   */
  ref?: Ref<HTMLElement | null>;
}

/**
 * Props for DropdownMenu.Label component
 */
export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Ref forwarded to label element
   */
  ref?: Ref<HTMLElement | null>;
}

/**
 * Props for DropdownMenu.Group component
 */
export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLElement> {
  /**
   * Polymorphic component type
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Ref forwarded to group element
   */
  ref?: Ref<HTMLElement | null>;
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
  dir: 'ltr' | 'rtl';
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
  dir: 'ltr' | 'rtl';
  closeOnSelect: boolean | 'auto';
  focusStrategy: DropdownMenuFocusStrategy;
  setFocusStrategy: (strategy: DropdownMenuFocusStrategy) => void;
  triggerRef: RefObject<HTMLElement | null>;
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
}
