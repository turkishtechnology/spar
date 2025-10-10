import React, { useEffect, useCallback } from 'react';
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
import type { TooltipContentProps, Side, Align } from './types';
import { useTooltip } from './useTooltip';

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
export const TooltipContent = ({
  children,
  className,
  style,
  as: Component = 'div',
  asLabel = false,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  avoidCollisions = true,
  collisionBoundary,
  collisionPadding = 10,
  hideWhenDetached = false,
  onEscapeKeyDown,
  ...props
}: TooltipContentProps) => {
  const context = useTooltip();

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
      padding: typeof collisionPadding === 'number' ? collisionPadding : 10,
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

  // Don't render if not open or disabled
  if (!context.isOpen || context.isDisabled) {
    return null;
  }

  // Check if hidden by middleware
  const isHidden = hideWhenDetached && middlewareData.hide?.referenceHidden;
  if (isHidden) {
    return null;
  }

  // Ref callback
  const refCallback = (node: HTMLElement | null) => {
    context.contentRef.current = node;
    refs.setFloating(node);
  };

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

  return React.createElement(Component, contentProps, children);
};

TooltipContent.displayName = 'TooltipContent';
