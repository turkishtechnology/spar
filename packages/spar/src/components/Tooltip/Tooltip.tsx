import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { TooltipProps, TooltipContextValue } from './types';
import { useTooltipProviderContext, TooltipContext } from './hooks';

/**
 * Root component that manages tooltip state and provides context to child components
 */
export const Tooltip = ({
  id: providedId,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delay,
  hideDelay = 0,
  disabled = false,
}: TooltipProps) => {
  const provider = useTooltipProviderContext();
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  // Controlled vs uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  // Floating UI refs
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef<Element | null>(null);

  // Private hide timer — not exposed via context
  const hideTimeoutRef = useRef<number | null>(null);

  // Get delay values from provider or props
  const effectiveDelay = delay ?? provider?.delayDuration ?? 700;
  const effectiveDisableHover = provider?.disableHoverableContent ?? false;

  // Handle open change
  const handleOpenChange = (open: boolean) => {
    if (disabled) return;

    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setUncontrolledOpen(open);
    }
  };

  const cancelHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const startHideTimer = useCallback(
    (delayMs: number, callback: () => void) => {
      cancelHideTimer();
      hideTimeoutRef.current = window.setTimeout(() => {
        hideTimeoutRef.current = null;
        callback();
      }, delayMs);
    },
    [cancelHideTimer],
  );

  // Context value
  const contextValue: TooltipContextValue = useMemo(
    () => ({
      isOpen,
      onOpenChange: handleOpenChange,
      delay: effectiveDelay,
      hideDelay,
      disableHoverableContent: effectiveDisableHover,
      triggerId,
      contentId,
      disabled,
      triggerRef,
      contentRef,
      arrowRef,
      startHideTimer,
      cancelHideTimer,
    }),
    [
      isOpen,
      handleOpenChange,
      effectiveDelay,
      hideDelay,
      effectiveDisableHover,
      triggerId,
      contentId,
      disabled,
      triggerRef,
      contentRef,
      arrowRef,
      startHideTimer,
      cancelHideTimer,
    ],
  );

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};

Tooltip.displayName = 'Tooltip';
