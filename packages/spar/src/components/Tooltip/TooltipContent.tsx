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
import { getPlacement } from '@/utils';

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
  onKeyDown,
  ref,
  ...props
}: TooltipContentProps<T>) => {
  const Component = as || 'div';
  const context = useTooltipContext();

  // Expose the latest handler so TooltipTrigger's Escape paths honour the same veto
  context.onEscapeKeyDownRef.current = onEscapeKeyDown;

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

  // Handle escape key (only reachable when the content itself holds focus)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>);
      if (event.defaultPrevented || event.key !== 'Escape') return;

      // The consumer receives the native event, so read the veto from that same object.
      onEscapeKeyDown?.(event.nativeEvent);
      if (event.nativeEvent.defaultPrevented) return;

      event.preventDefault();
      event.stopPropagation();
      context.onOpenChange(false);
      // Refocus the trigger after closing
      context.triggerRef.current?.focus();
    },
    [onKeyDown, onEscapeKeyDown, context],
  );

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
    () => ({ arrowStyles, side: currentSide, align: currentAlign }),
    [arrowStyles, currentSide, currentAlign],
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
    'data-state': context.isOpen ? 'open' : 'closed',
    'data-placement': getPlacement(currentSide, currentAlign),
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
