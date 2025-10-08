import React, { useRef, useEffect, useCallback } from 'react';
import type { TooltipTriggerProps } from './types';
import { useTooltip } from './useTooltip';
import { useTooltipProvider } from './useTooltipProvider';

/**
 * The trigger element that shows/hides the tooltip on hover or focus
 */
export const TooltipTrigger = ({
  children,
  asChild = false,
  as: Component = 'button',
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: TooltipTriggerProps) => {
  const context = useTooltip();
  const provider = useTooltipProvider();
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Clear timeouts
  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Show tooltip with delay
  const showTooltip = useCallback(
    (immediate = false) => {
      clearTimeouts();

      const delay = immediate || provider?.isOpenDelayed ? 0 : context.delay;

      showTimeoutRef.current = window.setTimeout(() => {
        context.onOpenChange(true);
        provider?.setIsOpenDelayed?.(true);
      }, delay);
    },
    [clearTimeouts, provider, context],
  );

  // Hide tooltip with delay
  const hideTooltip = useCallback(
    (immediate = false) => {
      clearTimeouts();

      const delay = immediate ? 0 : context.hideDelay;

      hideTimeoutRef.current = window.setTimeout(() => {
        context.onOpenChange(false);
        provider?.setIsOpenDelayed?.(false);
      }, delay);
    },
    [clearTimeouts, context, provider],
  );

  // Event handlers
  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      showTooltip();
      onPointerEnter?.(event as React.PointerEvent<HTMLButtonElement>);
    },
    [showTooltip, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      hideTooltip();
      onPointerLeave?.(event as React.PointerEvent<HTMLButtonElement>);
    },
    [hideTooltip, onPointerLeave],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      showTooltip(true); // Immediate on focus
      onFocus?.(event as React.FocusEvent<HTMLButtonElement>);
    },
    [showTooltip, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      hideTooltip(true); // Immediate on blur
      onBlur?.(event as React.FocusEvent<HTMLButtonElement>);
    },
    [hideTooltip, onBlur],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape' && context.isOpen) {
        event.preventDefault();
        event.stopPropagation();
        hideTooltip(true);
        // Keep focus on trigger
        context.triggerRef.current?.focus();
      }
      onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
    },
    [context.isOpen, context.triggerRef, hideTooltip, onKeyDown],
  );

  // Global escape key handler for better accessibility
  useEffect(() => {
    if (!context.isOpen) return;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Check if the event originated from tooltip content
        const target = event.target as HTMLElement;
        const tooltipContent = document.getElementById(context.contentId);

        // If the event came from tooltip content, let the content handle it
        if (tooltipContent && (target === tooltipContent || tooltipContent.contains(target))) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        context.onOpenChange(false);
        // Refocus trigger
        context.triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [context.isOpen, context]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, []);

  // Ref callback to merge refs
  const refCallback = (node: HTMLElement | null) => {
    context.triggerRef.current = node;
  };

  // Props to spread to trigger element
  const triggerProps = {
    ...props,
    ref: refCallback,
    id: context.triggerId,
    ...(context.isOpen &&
      !context.isDisabled &&
      !context.asLabel && { 'aria-describedby': context.contentId }),
    ...(context.isOpen &&
      !context.isDisabled &&
      context.asLabel && { 'aria-labelledby': context.contentId }),
    'data-state': context.isOpen ? 'open' : 'closed',
    'data-placement': context.placement,
    'data-disabled': context.isDisabled ? 'true' : 'false',
    onPointerEnter: context.isDisabled ? undefined : handlePointerEnter,
    onPointerLeave: context.isDisabled ? undefined : handlePointerLeave,
    onFocus: context.isDisabled ? undefined : handleFocus,
    onBlur: context.isDisabled ? undefined : handleBlur,
    onKeyDown: context.isDisabled ? undefined : handleKeyDown,
  };

  if (asChild) {
    // Clone the child and add our props
    return React.cloneElement(children, triggerProps);
  }

  return React.createElement(Component, triggerProps, children);
};

TooltipTrigger.displayName = 'TooltipTrigger';
