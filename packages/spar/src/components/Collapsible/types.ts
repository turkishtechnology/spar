import type { ComponentProps, ElementType } from 'react';

/**
 * Props for Collapsible root component
 * @remarks Fully accessible, headless component
 */
export interface CollapsibleProps extends ComponentProps<'div'> {
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
}

/**
 * Props for CollapsibleTrigger component
 * @remarks Button element that toggles visibility
 */
export interface CollapsibleTriggerProps extends ComponentProps<'button'> {
  /**
   * Element type for polymorphic rendering
   * @defaultValue 'button'
   */
  as?: ElementType;
}

/**
 * Props for CollapsibleContent component
 * @remarks Panel containing the collapsible content
 */
export interface CollapsibleContentProps extends ComponentProps<'div'> {
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
