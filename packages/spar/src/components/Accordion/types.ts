import type { ElementType } from 'react';
import type { Orientation, PolymorphicProps } from '../../types';
import type {
  CollapsibleOwnProps,
  CollapsibleTriggerRenderProps,
  CollapsibleTriggerOwnProps,
  CollapsibleTriggerProps,
  CollapsibleContentOwnProps,
  CollapsibleContentProps,
} from '../Collapsible/types';

/**
 * @deprecated Use `allowMultiple` instead. Will be removed in the next major release.
 */
export type AccordionType = 'single' | 'multiple';

/**
 * Identity of a single Accordion item. Mirrors Takeoff Core's `tk-accordion-item.itemKey`.
 */
export type AccordionItemKey = string | number;

/**
 * Currently active item identifier(s). A scalar in single mode, an array when
 * `allowMultiple` is set.
 */
export type AccordionActiveIndex = AccordionItemKey | AccordionItemKey[];

/**
 * Own props for Accordion root component.
 */
export interface AccordionOwnProps {
  /**
   * When `true`, multiple items can be expanded at once.
   * @defaultValue false
   */
  allowMultiple?: boolean;

  /**
   * Controlled active item identifier(s). Match the `itemKey` of the items
   * that should be expanded.
   */
  activeIndex?: AccordionActiveIndex;

  /**
   * Uncontrolled initial active item identifier(s). Used only on mount.
   */
  defaultActiveIndex?: AccordionActiveIndex;

  /**
   * Fired when the active set changes. The payload preserves the canonical
   * shape: scalar in single mode, array in multi mode.
   */
  onActiveIndexChange?: (next: AccordionActiveIndex) => void;

  /**
   * In single mode, when `true`, an active item cannot be collapsed by
   * clicking it again. Default is `false`, which matches Takeoff Core
   * (active items can always be collapsed). Has no effect in multi mode.
   * @defaultValue false
   */
  preventCollapse?: boolean;

  /**
   * Disables every item in the accordion.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Orientation for keyboard navigation.
   * @defaultValue 'vertical'
   */
  orientation?: Orientation;

  /**
   * @deprecated Use `allowMultiple` instead. Pass `type='multiple'` to opt
   * into multi-expand. Will be removed in the next major release.
   */
  type?: AccordionType;

  /**
   * @deprecated Use `activeIndex` instead. Will be removed in the next
   * major release.
   */
  value?: string | string[];

  /**
   * @deprecated Use `defaultActiveIndex` instead. Will be removed in the
   * next major release.
   */
  defaultValue?: string | string[];

  /**
   * @deprecated Use `onActiveIndexChange` instead. Will be removed in the
   * next major release.
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * @deprecated Single-mode items now collapse by default. Use
   * `preventCollapse` to opt out. Will be removed in the next major release.
   */
  isCollapsible?: boolean;
}

/**
 * Props for Accordion root component
 * @remarks Fully accessible, headless component
 */
export type AccordionProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  AccordionOwnProps
>;

/**
 * Own props for AccordionItem component
 */
export interface AccordionItemOwnProps extends CollapsibleOwnProps {
  /**
   * Stable identity for this item. Required (either `itemKey` or the
   * deprecated `value`).
   */
  itemKey?: AccordionItemKey;

  /**
   * @deprecated Use `itemKey` instead. Will be removed in the next major
   * release.
   */
  value?: string;
}

/**
 * Props for AccordionItem component
 * @remarks Individual item within accordion
 */
export type AccordionItemProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  AccordionItemOwnProps
>;

/**
 * Own props for AccordionHeader component
 */
export interface AccordionHeaderOwnProps {
  /**
   * Heading level (1-6) for document hierarchy
   * @defaultValue 3
   */
  level?: number;
}

/**
 * Props for AccordionHeader component
 * @remarks Semantic heading wrapper for trigger
 */
export type AccordionHeaderProps<T extends ElementType = 'h3'> = PolymorphicProps<
  'h3',
  T,
  AccordionHeaderOwnProps
>;

/**
 * Render props provided to children function for AccordionTrigger
 * @remarks Identical to CollapsibleTriggerRenderProps
 */
export type AccordionTriggerRenderProps = CollapsibleTriggerRenderProps;

/**
 * Own props for AccordionTrigger component
 * @remarks Identical to CollapsibleTriggerOwnProps
 */
export type AccordionTriggerOwnProps = CollapsibleTriggerOwnProps;

/**
 * Props for AccordionTrigger component
 * @remarks Button that toggles panel visibility
 */
export type AccordionTriggerProps<T extends ElementType = 'button'> = CollapsibleTriggerProps<T>;

/**
 * Own props for AccordionContent component
 * @remarks Identical to CollapsibleContentOwnProps
 */
export type AccordionContentOwnProps = CollapsibleContentOwnProps;

/**
 * Props for AccordionContent component
 * @remarks Collapsible panel content
 */
export type AccordionContentProps<T extends ElementType = 'div'> = CollapsibleContentProps<T>;

/**
 * @internal
 */
export interface AccordionContextValue {
  allowMultiple: boolean;
  preventCollapse: boolean;
  activeIndex: AccordionActiveIndex;
  onItemToggle: (itemKey: AccordionItemKey) => void;
  disabled: boolean;
  orientation: Orientation;
  registerItem: (itemId: string, element: HTMLElement) => void;
  unregisterItem: (itemId: string) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  getItemIndex: (itemId: string) => number;
  getItemAtIndex: (index: number) => string | undefined;
  focusItemAtIndex: (index: number) => void;
  itemCount: number;
}

/**
 * @internal
 */
export interface AccordionItemContextValue {
  itemKey: AccordionItemKey;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
