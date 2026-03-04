import type { ElementType, ReactNode } from 'react';
import type { PolymorphicProps } from '../../types';
import type { ButtonOwnProps } from '../Button/types';

/**
 * Render props provided to children function for CollapsibleTrigger
 */
export interface CollapsibleTriggerRenderProps {
  /**
   * Whether the collapsible is currently open
   */
  isOpen: boolean;
  /**
   * Whether the collapsible is disabled
   */
  disabled: boolean;
  /**
   * Function to open the collapsible
   */
  open: () => void;
  /**
   * Function to close the collapsible
   */
  close: () => void;
  /**
   * Function to toggle the open state
   */
  toggle: () => void;
}

/**
 * Own props for Collapsible root component
 */
export interface CollapsibleOwnProps {
  /**
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-trigger` and `${id}-content`.
   */
  id?: string;

  /**
   * Unique identifier for the trigger element.
   * If not provided, one will be derived from the base ID.
   */
  triggerId?: string;

  /**
   * Unique identifier for the content element.
   * If not provided, one will be derived from the base ID.
   */
  contentId?: string;

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when open state changes
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the collapsible is disabled
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Props for Collapsible root component
 * @remarks Fully accessible, headless component
 */
export type CollapsibleProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  CollapsibleOwnProps
>;

/**
 * Own props for CollapsibleTrigger component
 */
export interface CollapsibleTriggerOwnProps extends ButtonOwnProps {
  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: CollapsibleTriggerRenderProps) => ReactNode);
}

/**
 * Props for CollapsibleTrigger component
 * @remarks Button element that toggles visibility
 */
export type CollapsibleTriggerProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  CollapsibleTriggerOwnProps
>;

/**
 * Own props for CollapsibleContent component
 */
export interface CollapsibleContentOwnProps {
  /**
   * Force content to remain mounted when closed
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Callback fired when content is found via browser search
   * @param event - The beforematch event
   */
  onBeforeMatch?: (event: Event) => void;
}

/**
 * Props for CollapsibleContent component
 * @remarks Panel containing the collapsible content
 */
export type CollapsibleContentProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  CollapsibleContentOwnProps
>;

/**
 * Context value shared between Collapsible components
 * @internal
 */
export interface CollapsibleContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}
