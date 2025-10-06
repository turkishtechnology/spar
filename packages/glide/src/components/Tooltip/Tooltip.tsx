import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipArrowProps,
  TooltipContextValue,
  TooltipProviderContextValue,
  Side,
  Align,
} from './types';

// Provider Context
const TooltipProviderContext = createContext<TooltipProviderContextValue | null>(null);

// Tooltip Context
const TooltipContext = createContext<TooltipContextValue | null>(null);

// Provider Component
/**
 * Provides shared configuration for multiple tooltip instances
 */
export const TooltipProvider = ({
  children,
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
}: TooltipProviderProps) => {
  const [isOpenDelayed, setIsOpenDelayed] = useState(false);

  const contextValue: TooltipProviderContextValue = {
    delayDuration,
    skipDelayDuration,
    disableHoverableContent,
    isOpenDelayed,
    setIsOpenDelayed,
  };

  return (
    <TooltipProviderContext.Provider value={contextValue}>
      <div data-tooltip-provider='' data-skip-delay={isOpenDelayed ? 'true' : 'false'}>
        {children}
      </div>
    </TooltipProviderContext.Provider>
  );
};

TooltipProvider.displayName = 'TooltipProvider';

// Hook to use provider context
const useTooltipProvider = () => {
  const context = useContext(TooltipProviderContext);
  return context; // Can be null if not within provider
};

// Hook to use tooltip context
const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within TooltipRoot');
  }
  return context;
};

// Root Component
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
  const contextValue: TooltipContextValue = {
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
  };

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};

TooltipRoot.displayName = 'TooltipRoot';

// Trigger Component
/**
 * The trigger element that shows/hides the tooltip on hover or focus
 */
export const TooltipTrigger = ({
  children,
  asChild = false,
  as: Component = 'button',
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
  const handleMouseEnter = () => {
    if (isTouch) return;
    showTooltip();
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip(true); // Immediate on focus
  };

  const handleBlur = () => {
    hideTooltip(true); // Immediate on blur
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && context.isOpen) {
      event.preventDefault();
      event.stopPropagation();
      hideTooltip(true);
      // Keep focus on trigger
      context.triggerRef.current?.focus();
    }
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

// Helper to convert Side + Align to Placement
const toPlacement = (side: Side, align?: Align): Placement => {
  if (!align || align === 'center') {
    return side;
  }
  return `${side}-${align}` as Placement;
};

// Content Component
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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onEscapeKeyDown?.(event.nativeEvent);
      context.onOpenChange(false);
      // Refocus the trigger after closing
      const trigger = document.getElementById(context.triggerId);
      trigger?.focus();
    }
  };

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
  const handleMouseEnter = () => {
    // Keep tooltip open when hovering content (WCAG 1.4.13)
  };

  const handleMouseLeave = () => {
    if (!context.disableHoverableContent) {
      context.onOpenChange(false);
    }
  };

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

// Portal Component
/**
 * Portal component for rendering tooltip outside normal DOM tree
 */
export const TooltipPortal = ({ children, container, forceMount = false }: TooltipPortalProps) => {
  const context = useTooltip();
  const [mounted, setMounted] = useState(false);

  // Mount after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if not mounted, disabled, or not open (unless forced)
  if (!mounted || context.isDisabled || (!context.isOpen && !forceMount)) {
    return null;
  }

  const portalContainer = container || (typeof document !== 'undefined' ? document.body : null);

  if (!portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
};

TooltipPortal.displayName = 'TooltipPortal';

// Arrow Component
/**
 * Optional arrow pointing to the trigger element
 */
export const TooltipArrow = ({
  width = 10,
  height = 5,
  as: Component = 'svg',
  className,
  style,
}: TooltipArrowProps) => {
  const context = useTooltip();

  // Ref callback to attach arrow ref
  const refCallback = (node: HTMLElement | SVGSVGElement | null) => {
    context.arrowRef.current = node;
  };

  const arrowStyle = {
    ...style,
    position: 'absolute' as const,
  } as React.CSSProperties;

  if (Component === 'svg') {
    return (
      <svg
        ref={refCallback as React.Ref<SVGSVGElement>}
        width={width}
        height={height}
        className={className}
        style={arrowStyle}
        data-placement={context.placement}
        viewBox={`0 0 ${width} ${height}`}
      >
        <polygon points={`0,${height} ${width / 2},0 ${width},${height}`} />
      </svg>
    );
  }

  const arrowProps = {
    ref: refCallback,
    width,
    height,
    className,
    style: arrowStyle,
    'data-placement': context.placement,
  };

  return React.createElement(Component, arrowProps);
};

TooltipArrow.displayName = 'TooltipArrow';
