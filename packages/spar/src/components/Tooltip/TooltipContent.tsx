import React, { useEffect, useCallback, useRef, useState, type ElementType } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  hide,
  size,
  type Placement,
  type Middleware,
} from '@floating-ui/react-dom';
import { createPortal } from 'react-dom';
import { useMergedRef } from '@/hooks';
import { useTooltipContext } from './hooks';
import type { TooltipContentProps } from './types';
import type { Side, Align } from '../../types';

// Helper to convert Side + Align to Placement
const toPlacement = (side: Side, align?: Align): Placement => {
  if (!align || align === 'center') {
    return side;
  }
  return `${side}-${align}` as Placement;
};

/**
 * The content that displays in the tooltip popup
 */
export const TooltipContent = <T extends ElementType = 'div'>({
  children,
  className,
  style,
  as,
  asLabel = false,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  avoidCollisions = true,
  collisionBoundary,
  collisionPadding = 8,
  hideWhenDetached = false,
  container,
  onEscapeKeyDown,
  ref,
  ...props
}: TooltipContentProps<T>) => {
  const Component = as || 'div';
  const context = useTooltipContext();
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);

  // SSR safety - only render portal after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update placement
  useEffect(() => {
    context.setPlacement(side);
  }, [side, context]);

  // Build middleware array
  const middleware: Middleware[] = [offset(sideOffset + alignOffset)];

  if (context.arrowRef.current) {
    middleware.push(
      arrow({
        element: context.arrowRef.current,
      }),
    );
  }

  if (avoidCollisions) {
    const flipOptions: Parameters<typeof flip>[0] = {
      padding: collisionPadding,
    };
    if (collisionBoundary !== undefined) {
      flipOptions.boundary = collisionBoundary;
    }

    const shiftOptions: Parameters<typeof shift>[0] = {
      padding: collisionPadding,
    };
    if (collisionBoundary !== undefined) {
      shiftOptions.boundary = collisionBoundary;
    }

    middleware.push(flip(flipOptions));
    middleware.push(shift(shiftOptions));
  }

  if (hideWhenDetached) {
    middleware.push(hide());
  }

  // Size constraint middleware
  middleware.push(
    size({
      apply({ availableWidth, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`,
        });
      },
      padding: typeof collisionPadding === 'number' ? collisionPadding : 8,
    }),
  );

  // Floating UI positioning
  const {
    x,
    y,
    strategy,
    refs,
    middlewareData,
    placement: actualPlacement,
  } = useFloating({
    placement: toPlacement(side, align),
    middleware,
    whileElementsMounted: autoUpdate,
  });

  // Update refs from context
  useEffect(() => {
    refs.setReference(context.triggerRef.current);
    refs.setFloating(context.contentRef.current);
  }, [refs, context.triggerRef, context.contentRef]);

  // Update actual placement in context
  useEffect(() => {
    const [placementSide] = actualPlacement.split('-') as [Side, Align?];
    context.setPlacement(placementSide);
  }, [actualPlacement, context]);

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
      context.clearHideTimeout();
    }
  }, [context]);

  const handleMouseLeave = useCallback(() => {
    if (!context.disableHoverableContent) {
      context.onOpenChange(false);
    }
  }, [context]);

  // Ref callback that combines mergedRef with context and floating refs
  // Must be before early returns to satisfy Rules of Hooks
  const refCallback = useCallback(
    (node: HTMLElement | null) => {
      mergedRef(node);
      context.contentRef.current = node;
      refs.setFloating(node);
    },
    [mergedRef, context.contentRef, refs],
  );

  // Don't render if not open or disabled
  if (!context.isOpen || context.disabled) {
    return null;
  }

  // Don't render on server
  if (!mounted) {
    return null;
  }

  // Check if hidden by middleware
  const isHidden = hideWhenDetached && middlewareData.hide?.referenceHidden;
  if (isHidden) {
    return null;
  }

  // Get arrow data
  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  const contentProps = {
    ref: refCallback,
    id: context.contentId,
    role: 'tooltip',
    className,
    style: {
      ...style,
      position: strategy as React.CSSProperties['position'],
      top: y ?? 0,
      left: x ?? 0,
      '--tooltip-arrow-x': arrowX !== undefined ? `${arrowX}px` : undefined,
      '--tooltip-arrow-y': arrowY !== undefined ? `${arrowY}px` : undefined,
    } as React.CSSProperties,
    'data-state': context.isOpen ? 'open' : 'closed',
    'data-placement': actualPlacement,
    'data-as-label': asLabel ? 'true' : 'false',
    onKeyDown: handleKeyDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...props,
  };

  const portalContainer = container || document.body;

  return createPortal(<Component {...contentProps}>{children}</Component>, portalContainer);
};

TooltipContent.displayName = 'TooltipContent';
