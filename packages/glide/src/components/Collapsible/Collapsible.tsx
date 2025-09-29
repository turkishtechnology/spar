import React, { createContext, useContext, useMemo, useState, useCallback, useId } from 'react';
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
export const Collapsible = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  isDisabled = false,
  children,
  ...props
}: CollapsibleProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // Generate stable IDs for ARIA relationships
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (isDisabled) return;

    const nextOpen = !isOpen;

    // Update internal state for uncontrolled usage
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    // Call callback for both controlled and uncontrolled
    onOpenChange?.(nextOpen);
  }, [isDisabled, isOpen, isControlled, onOpenChange]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isOpen,
      toggle,
      isDisabled,
      triggerId,
      contentId,
    }),
    [isOpen, toggle, isDisabled, triggerId, contentId],
  );

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div data-state={dataState} data-disabled={isDisabled ? '' : undefined} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

Collapsible.displayName = 'Collapsible';
