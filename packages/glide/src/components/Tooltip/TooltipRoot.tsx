import { useId, useMemo, useRef, useState } from 'react';
import type { TooltipRootProps, TooltipContextValue, Side } from './types';
import { TooltipContext } from './TooltipContext';
import { useTooltipProvider } from './useTooltipProvider';

/**
 * Root component that manages tooltip state and provides context to child components
 */
export const TooltipRoot = ({
  children,
  isOpen: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delay,
  hideDelay = 0,
  isDisabled = false,
}: TooltipRootProps) => {
  const provider = useTooltipProvider();
  const triggerId = useId();
  const contentId = useId();

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

  // Get delay values from provider or props
  const effectiveDelay = delay ?? provider?.delayDuration ?? 700;
  const effectiveHideDelay = hideDelay;
  const effectiveSkipDelay = provider?.skipDelayDuration ?? 300;
  const effectiveDisableHover = provider?.disableHoverableContent ?? false;

  // Handle open change
  const handleOpenChange = (open: boolean) => {
    if (isDisabled) return;

    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setUncontrolledOpen(open);
    }
  };

  // Context value
  const contextValue: TooltipContextValue = useMemo(
    () => ({
      isOpen,
      onOpenChange: handleOpenChange,
      delay: effectiveDelay,
      hideDelay: effectiveHideDelay,
      skipDelayDuration: effectiveSkipDelay,
      disableHoverableContent: effectiveDisableHover,
      triggerId,
      contentId,
      asLabel,
      placement,
      setPlacement,
      isDisabled,
      triggerRef,
      contentRef,
      arrowRef,
    }),
    [
      isOpen,
      handleOpenChange,
      effectiveDelay,
      effectiveHideDelay,
      effectiveSkipDelay,
      effectiveDisableHover,
      triggerId,
      contentId,
      asLabel,
      placement,
      setPlacement,
      isDisabled,
      triggerRef,
      contentRef,
      arrowRef,
    ],
  );

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};

TooltipRoot.displayName = 'TooltipRoot';
