import { useMemo, useCallback, useId, ElementType } from 'react';
import { useControlledState } from '@/hooks';
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

  // State management - controlled/uncontrolled
  const [isOpen = false, setIsOpen] = useControlledState(controlledOpen, defaultOpen, onOpenChange);

  // Generate stable IDs for ARIA relationships
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = propsTriggerId ?? `${baseId}-trigger`;
  const contentId = propsContentId ?? `${baseId}-content`;

  const toggle = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
  }, [disabled, isOpen, setIsOpen]);

  const open = useCallback(() => {
    if (disabled || isOpen) return;
    setIsOpen(true);
  }, [disabled, isOpen, setIsOpen]);

  const close = useCallback(() => {
    if (disabled || !isOpen) return;
    setIsOpen(false);
  }, [disabled, isOpen, setIsOpen]);

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
