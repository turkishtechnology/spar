import React, { useRef, useEffect, useCallback } from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import { useMergedRef } from '../../hooks';
import type { TooltipTriggerProps, TooltipTriggerRenderProps } from './types';
import { useTooltip } from './useTooltip';
import { useTooltipProvider } from './useTooltipProvider';

/**
 * The trigger element that shows/hides the tooltip on hover or focus
 */
export const TooltipTrigger = ({
  children,
  as = 'button',
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ref,
  ...props
}: TooltipTriggerProps) => {
  const context = useTooltip();
  const provider = useTooltipProvider();
  const showTimeoutRef = useRef<number | null>(null);

  // Clear timeouts
  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    context.clearHideTimeout();
  }, [context]);

  // Show tooltip with delay
  const showTooltip = useCallback(
    (immediate = false) => {
      clearTimeouts();

      const delay = immediate || provider?.isOpenDelayed ? 0 : context.delay;

      showTimeoutRef.current = globalThis.setTimeout(() => {
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

      const hideTimeoutId = globalThis.setTimeout(() => {
        context.onOpenChange(false);
        provider?.setIsOpenDelayed?.(false);
      }, delay);

      // Store timeout ID in context ref so it can be cleared from content
      context.hideTimeoutRef.current = hideTimeoutId;
    },
    [clearTimeouts, context, provider],
  );

  // Event handlers
  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      showTooltip();
      onPointerEnter?.(event);
    },
    [showTooltip, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      hideTooltip();
      onPointerLeave?.(event);
    },
    [hideTooltip, onPointerLeave],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      showTooltip(true); // Immediate on focus
      onFocus?.(event);
    },
    [showTooltip, onFocus],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      hideTooltip(true); // Immediate on blur
      onBlur?.(event);
    },
    [hideTooltip, onBlur],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Escape' && context.isOpen) {
        event.preventDefault();
        event.stopPropagation();
        hideTooltip(true);
        // Keep focus on trigger
        context.triggerRef.current?.focus();
      }
      onKeyDown?.(event);
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
  }, [clearTimeouts]);

  // Merge trigger ref from context with user ref
  const mergedRef = useMergedRef(context.triggerRef, ref);

  // Render props for children function
  const renderProps: TooltipTriggerRenderProps = {
    isOpen: context.isOpen,
    disabled: context.disabled,
    placement: context.placement,
    show: () => showTooltip(true),
    hide: () => hideTooltip(true),
  };

  return (
    <PrimitiveButton
      as={as}
      type='button'
      disabled={context.disabled}
      ref={mergedRef}
      id={context.triggerId}
      aria-describedby={
        context.isOpen && !context.disabled && !context.asLabel ? context.contentId : undefined
      }
      aria-labelledby={
        context.isOpen && !context.disabled && context.asLabel ? context.contentId : undefined
      }
      data-state={context.isOpen ? 'open' : 'closed'}
      data-placement={context.placement}
      onPointerEnter={context.disabled ? undefined : handlePointerEnter}
      onPointerLeave={context.disabled ? undefined : handlePointerLeave}
      onFocus={context.disabled ? undefined : handleFocus}
      onBlur={context.disabled ? undefined : handleBlur}
      onKeyDown={context.disabled ? undefined : handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

TooltipTrigger.displayName = 'TooltipTrigger';
