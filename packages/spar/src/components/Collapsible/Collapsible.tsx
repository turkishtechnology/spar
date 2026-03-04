import { useMemo, useState, useCallback, useId, ElementType } from 'react';
import { CollapsibleContext } from './hooks';
import type { CollapsibleProps } from './types';

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
  id: providedId,
  triggerId: propsTriggerId,
  contentId: propsContentId,
  ref,
  ...props
}: CollapsibleProps<T>) => {
  const Component = as || 'div';
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // Generate stable IDs for ARIA relationships
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = propsTriggerId ?? `${baseId}-trigger`;
  const contentId = propsContentId ?? `${baseId}-content`;

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
      <Component
        ref={ref}
        data-state={dataState}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {children}
      </Component>
    </CollapsibleContext.Provider>
  );
};

Collapsible.displayName = 'Collapsible';
