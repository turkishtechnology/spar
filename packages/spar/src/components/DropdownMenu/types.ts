import type { ElementType, ReactNode, SyntheticEvent, RefObject } from 'react';
import type { Side, Align, PolymorphicProps } from '../../types';
import type { ButtonOwnProps } from '../Button/types';

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
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-trigger` and `${id}-content`.
   */
  id?: string;

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
   * Whether to close the menu after an item is selected
   * @defaultValue true
   */
  closeOnSelect?: boolean;

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * Own props for DropdownMenuTrigger component
 */
export interface DropdownMenuTriggerOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function for render props pattern
   */
  children?: ReactNode | ((state: DropdownMenuTriggerRenderProps) => ReactNode);
}

/**
 * Props for DropdownMenuTrigger component
 * @remarks Button that toggles menu visibility
 */
export type DropdownMenuTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  DropdownMenuTriggerOwnProps
>;

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
 * Props for DropdownMenuViewport component
 * @remarks Scrollable region wrapping the menu items. Headless and purely
 * presentational: apply a `max-height` and `overflow` (e.g. `overflow-y: auto`)
 * via styling to enable scrolling. Keeping the highlighted item in view during
 * keyboard navigation and typeahead is handled by `DropdownMenuContent`.
 */
export type DropdownMenuViewportProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

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
 * Props for DropdownMenuSeparator component
 * @remarks Visual divider between menu item groups
 */
export type DropdownMenuSeparatorProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Props for DropdownMenuLabel component
 * @remarks Non-interactive label for a menu group
 */
export type DropdownMenuLabelProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Props for DropdownMenuGroup component
 * @remarks Semantic grouping container for related items
 */
export type DropdownMenuGroupProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Props for DropdownMenuArrow component
 * @remarks Purely decorative arrow element. Headless: user provides all visuals.
 */
export type DropdownMenuArrowProps<T extends ElementType = 'svg'> = PolymorphicProps<'svg', T>;

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
  closeOnSelect: boolean;
  focusStrategy: DropdownMenuFocusStrategy;
  setFocusStrategy: (strategy: DropdownMenuFocusStrategy) => void;
  triggerRef: RefObject<HTMLElement | null>;
  arrowRef: RefObject<Element | null>;
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
}

/**
 * @internal
 */
export interface DropdownMenuCollectionItem {
  id: string;
  ref: RefObject<HTMLElement | null>;
  disabled: boolean;
  textValue: string;
}

/**
 * Context value for DropdownMenuCollection
 * @internal
 */
export interface DropdownMenuCollectionContextValue {
  registerItem: (item: DropdownMenuCollectionItem) => void;
  unregisterItem: (id: string) => void;
  highlightItem: (id: string | null) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  isItemHighlighted: (id: string) => boolean;
  highlightedId: string | null;
  closeOnSelect: boolean;
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
}
