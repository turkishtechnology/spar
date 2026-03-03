import { useId, useMemo, useRef, useState } from 'react';
import type { TooltipProps, TooltipContextValue } from './types';
import type { Side } from '../../types';
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

  const [placement, setPlacement] = useState<Side>('top');
  const [asLabel] = useState(false);

  // Floating UI refs
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef<HTMLElement | SVGSVGElement | null>(null);

  // Timeout refs for external access
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

  // Clear hide timeout function
  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

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
      asLabel,
      placement,
      setPlacement,
      disabled,
      triggerRef,
      contentRef,
      arrowRef,
      hideTimeoutRef,
      clearHideTimeout,
    }),
    [
      isOpen,
      handleOpenChange,
      effectiveDelay,
      hideDelay,
      effectiveDisableHover,
      triggerId,
      contentId,
      asLabel,
      placement,
      setPlacement,
      disabled,
      triggerRef,
      contentRef,
      arrowRef,
    ],
  );

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};

Tooltip.displayName = 'Tooltip';
