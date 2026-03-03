import React, { useRef, useEffect, useCallback, ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { TooltipTriggerProps, TooltipTriggerRenderProps } from './types';
import { useTooltipContext, useTooltipProviderContext } from './hooks';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * The trigger element that shows/hides the tooltip on hover or focus
 */
export const TooltipTrigger = <T extends ElementType = 'button'>({
  children,
  as,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ref,
  ...props
}: TooltipTriggerProps<T>) => {
  const context = useTooltipContext();
  const provider = useTooltipProviderContext();
  const showTimeoutRef = useRef<number | null>(null);

  const mergedRef = useMergedRef(context.triggerRef, ref);

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

      const delay = immediate || provider?.skipDelay ? 0 : context.delay;

      showTimeoutRef.current = window.setTimeout(() => {
        context.onOpenChange(true);
        provider?.setSkipDelay?.(true);
      }, delay);
    },
    [clearTimeouts, provider, context],
  );

  // Hide tooltip with delay
  const hideTooltip = useCallback(
    (immediate = false) => {
      clearTimeouts();

      const delay = immediate ? 0 : context.hideDelay;

      const hideTimeoutId = window.setTimeout(() => {
        context.onOpenChange(false);
        provider?.setSkipDelay?.(false);
      }, delay);

      // Store timeout ID in context ref so it can be cleared from content
      context.hideTimeoutRef.current = hideTimeoutId;
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
      onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
      if (event.defaultPrevented) return;

      if (event.key === 'Escape' && context.isOpen) {
        event.preventDefault();
        event.stopPropagation();
        hideTooltip(true);
        // Keep focus on trigger
        context.triggerRef.current?.focus();
      }
    },
    [onKeyDown, context.isOpen, context.triggerRef, hideTooltip],
  );

  // Global escape key handler for better accessibility
  useEffect(() => {
    if (!context.isOpen) return;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Check if the event originated from tooltip content
        const target = event.target as HTMLElement;
        const tooltipContent = context.contentRef.current;

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

  // Render props for children function
  const renderProps: TooltipTriggerRenderProps = {
    isOpen: context.isOpen,
    disabled: context.disabled,
    placement: context.placement,
    show: () => showTooltip(true),
    hide: () => hideTooltip(true),
  };

  const buttonProps = {
    ...(as && { as }),
    ref: mergedRef,
    id: context.triggerId,
    disabled: context.disabled,
    'aria-describedby':
      context.isOpen && !context.disabled && !context.asLabel ? context.contentId : undefined,
    'aria-labelledby':
      context.isOpen && !context.disabled && context.asLabel ? context.contentId : undefined,
    'data-state': context.isOpen ? 'open' : 'closed',
    'data-placement': context.placement,
    onPointerEnter: context.disabled ? undefined : handlePointerEnter,
    onPointerLeave: context.disabled ? undefined : handlePointerLeave,
    onFocus: context.disabled ? undefined : handleFocus,
    onBlur: context.disabled ? undefined : handleBlur,
    onKeyDown: context.disabled ? undefined : handleKeyDown,
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

TooltipTrigger.displayName = 'TooltipTrigger';
