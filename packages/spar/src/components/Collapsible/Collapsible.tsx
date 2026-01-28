import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useId,
  ElementType,
} from 'react';
import type { CollapsibleProps, CollapsibleContextValue } from './types';

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible');
  }
  return context;
};

/**
 * Collapsible root component providing context and state management for show/hide content functionality.
 */
export const Collapsible = <T extends ElementType = 'div'>({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  as,
  triggerId: propsTriggerId,
  contentId: propsContentId,
  ...props
}: CollapsibleProps<T>) => {
  const Component = as || 'div';
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // Generate stable IDs for ARIA relationships
  const baseId = useId();
  const triggerId = propsTriggerId || `${baseId}-trigger`;
  const contentId = propsContentId || `${baseId}-content`;

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (disabled) return;

    const nextOpen = !isOpen;

    // Update internal state for uncontrolled usage
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    // Call callback for both controlled and uncontrolled
    onOpenChange?.(nextOpen);
  }, [disabled, isOpen, isControlled, onOpenChange]);

  const open = useCallback(() => {
    if (disabled || isOpen) return;

    // Update internal state for uncontrolled usage
    if (!isControlled) {
      setInternalOpen(true);
    }

    // Call callback for both controlled and uncontrolled
    onOpenChange?.(true);
  }, [disabled, isOpen, isControlled, onOpenChange]);

  const close = useCallback(() => {
    if (disabled || !isOpen) return;

    // Update internal state for uncontrolled usage
    if (!isControlled) {
      setInternalOpen(false);
    }

    // Call callback for both controlled and uncontrolled
    onOpenChange?.(false);
  }, [disabled, isOpen, isControlled, onOpenChange]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      disabled,
      triggerId,
      contentId,
    }),
    [isOpen, open, close, toggle, disabled, triggerId, contentId],
  );

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <Component data-state={dataState} data-disabled={disabled ? '' : undefined} {...props}>
        {children}
      </Component>
    </CollapsibleContext.Provider>
  );
};

Collapsible.displayName = 'Collapsible';
