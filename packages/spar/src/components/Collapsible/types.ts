import type { ElementType, ReactNode, HTMLAttributes } from 'react';

/**
 * Props for Collapsible root component
 * @remarks Fully accessible, headless component
 */
export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Element type for polymorphic rendering
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Unique identifier for the trigger element.
   * IF not provided, one will be generated automatically.
   */
  triggerId?: string;

  /**
   * Unique identifier for the content element.
   * If not provided, one will be generated automatically.
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
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the collapsible is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Child components
   */
  children: ReactNode;
}

/**
 * Props for CollapsibleTrigger component
 * @remarks Button element that toggles visibility
 */
export interface CollapsibleTriggerProps extends HTMLAttributes<HTMLElement> {
  /**
   * Element type for polymorphic rendering
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Trigger content
   */
  children?: ReactNode;
}

/**
 * Props for CollapsibleContent component
 * @remarks Panel containing the collapsible content
 */
export interface CollapsibleContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * Element type for polymorphic rendering
   * @defaultValue 'div'
   */
  as?: ElementType;

  /**
   * Force content to remain mounted when closed
   * @defaultValue false
   */
  forceMount?: boolean;

  /**
   * Content to be shown/hidden
   */
  children?: ReactNode;

  /**
   * Callback fired when content is found via browser search
   */
  onBeforeMatch?: (event: Event) => void;
}

/**
 * Context value shared between Collapsible components
 * @internal
 */
export interface CollapsibleContextValue {
  /**
   * Current open state
   */
  isOpen: boolean;

  /**
   * Toggle function to change open state
   */
  toggle: () => void;

  /**
   * Whether the collapsible is disabled
   */
  disabled: boolean;

  /**
   * ID of the trigger element
   */
  triggerId: string;

  /**
   * ID of the content element
   */
  contentId: string;
}
