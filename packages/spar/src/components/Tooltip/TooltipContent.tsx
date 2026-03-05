import React, { useEffect, useCallback, useState, type ElementType, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  useMergedRef,
  useFloating,
  type UseFloatingOptions,
  type UseFloatingReturn,
} from '@/hooks';
import { useTooltipContext, TooltipContentContext } from './hooks';
import type { TooltipContentProps } from './types';
import type { Side, Align } from '../../types';

/**
 * The content that displays in the tooltip popup
 */
export const TooltipContent = <T extends ElementType = 'div'>({
  children,
  className,
  style,
  as,
  side = 'top',
  align = 'center',
  container,
  onEscapeKeyDown,
  ref,
  ...props
}: TooltipContentProps<T>) => {
  const Component = as || 'div';
  const context = useTooltipContext();

  // SSR safety - only render portal after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Floating UI positioning
  const floatingOptions: UseFloatingOptions = {
    side,
    align,
    arrowRef: context.arrowRef.current,
  };

  const {
    floatingStyles,
    arrowStyles,
    refs,
    placement: actualPlacement,
  }: UseFloatingReturn = useFloating(floatingOptions);

  // Extract placement information for data attributes
  const [currentSide, currentAlign] = useMemo(() => {
    const parts = actualPlacement.split('-');
    const placementSide = parts[0] as Side;
    const placementAlign = parts[1] ? (parts[1] as Align) : 'center';
    return [placementSide, placementAlign];
  }, [actualPlacement]);

  // Merge internal refs with external ref
  const mergedRef = useMergedRef(context.contentRef, ref);

  const floatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      mergedRef(node);
      refs.setFloating(node);
    },
    [mergedRef, refs],
  );

  // Set reference element
  useEffect(() => {
    refs.setReference(context.triggerRef.current);
  }, [refs, context.triggerRef]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onEscapeKeyDown?.(event.nativeEvent);
        context.onOpenChange(false);
        // Refocus the trigger after closing
        const trigger = document.getElementById(context.triggerId);
        trigger?.focus();
      }
    },
    [onEscapeKeyDown, context],
  );

  // Handle native escape key events (for testing and edge cases)
  useEffect(() => {
    if (!context.isOpen) return;

    const handleNativeKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const target = event.target as HTMLElement;
        const contentElement = context.contentRef.current;

        // Only handle if the event originated from this tooltip content
        if (contentElement && (target === contentElement || contentElement.contains(target))) {
          event.preventDefault();
          event.stopPropagation();
          onEscapeKeyDown?.(event);
          context.onOpenChange(false);
          // Refocus the trigger after closing
          const trigger = document.getElementById(context.triggerId);
          trigger?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleNativeKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleNativeKeyDown, true);
    };
  }, [context.isOpen, context.contentId, context.triggerId, onEscapeKeyDown, context]);

  // Handle mouse enter/leave for hoverable content
  const handleMouseEnter = useCallback(() => {
    // Cancel any pending hide timeout when hovering over content (WCAG 1.4.13)
    // Only if hoverable content is not disabled
    if (!context.disableHoverableContent) {
      context.cancelHideTimer();
    }
  }, [context]);

  const handleMouseLeave = useCallback(() => {
    if (!context.disableHoverableContent) {
      context.onOpenChange(false);
    }
  }, [context]);

  const contentContextValue = useMemo(
    () => ({ arrowStyles, side: currentSide }),
    [arrowStyles, currentSide],
  );

  // Don't render if not open or disabled
  if (!context.isOpen || context.disabled) {
    return null;
  }

  // Don't render on server
  if (!mounted) {
    return null;
  }

  const contentProps = {
    ref: floatingRef,
    id: context.contentId,
    role: 'tooltip',
    className,
    style: { ...floatingStyles, ...style },
    'data-side': currentSide,
    'data-align': currentAlign,
    onKeyDown: handleKeyDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...props,
  };

  const portalContainer = container || document.body;

  return createPortal(
    <TooltipContentContext.Provider value={contentContextValue}>
      <Component {...contentProps}>{children}</Component>
    </TooltipContentContext.Provider>,
    portalContainer,
  );
};

TooltipContent.displayName = 'TooltipContent';
