import React, { useRef, useEffect } from 'react';
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
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: TooltipTriggerProps) => {
  const context = useTooltip();
  const provider = useTooltipProvider();
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Touch detection
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  // Clear timeouts
  const clearTimeouts = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Show tooltip with delay
  const showTooltip = (immediate = false) => {
    clearTimeouts();

    const delay = immediate || provider?.isOpenDelayed ? 0 : context.delay;

    showTimeoutRef.current = window.setTimeout(() => {
      context.onOpenChange(true);
      provider?.setIsOpenDelayed?.(true);
    }, delay);
  };

  // Hide tooltip with delay
  const hideTooltip = (immediate = false) => {
    clearTimeouts();

    const delay = immediate ? 0 : context.hideDelay;

    hideTimeoutRef.current = window.setTimeout(() => {
      context.onOpenChange(false);
      provider?.setIsOpenDelayed?.(false);
    }, delay);
  };

  // Event handlers
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!isTouch) {
      showTooltip();
    }
    onMouseEnter?.(event as React.MouseEvent<HTMLButtonElement>);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    if (!isTouch) {
      hideTooltip();
    }
    onMouseLeave?.(event as React.MouseEvent<HTMLButtonElement>);
  };

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    showTooltip(true); // Immediate on focus
    onFocus?.(event as React.FocusEvent<HTMLButtonElement>);
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    hideTooltip(true); // Immediate on blur
    onBlur?.(event as React.FocusEvent<HTMLButtonElement>);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && context.isOpen) {
      event.preventDefault();
      event.stopPropagation();
      hideTooltip(true);
      // Keep focus on trigger
      context.triggerRef.current?.focus();
    }
    onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
  };

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
    onMouseEnter: context.isDisabled ? undefined : handleMouseEnter,
    onMouseLeave: context.isDisabled ? undefined : handleMouseLeave,
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
