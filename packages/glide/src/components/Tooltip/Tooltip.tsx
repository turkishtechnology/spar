import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const triggerRef = useRef<HTMLElement>(null);
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
      triggerRef.current?.focus();
    }
  };

  // Global escape key handler for better accessibility
  useEffect(() => {
    if (!context.isOpen) return;

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        context.onOpenChange(false);
        // Refocus trigger
        triggerRef.current?.focus();
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

  // Props to spread to trigger element
  const triggerProps = {
    ref: triggerRef,
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
  onEscapeKeyDown,
  ...props
}: TooltipContentProps) => {
  const context = useTooltip();
  const contentRef = useRef<HTMLElement>(null);

  // Update placement
  useEffect(() => {
    context.setPlacement(side);
  }, [side, context]);

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

  const contentProps = {
    ref: contentRef,
    id: context.contentId,
    role: 'tooltip',
    className,
    style: {
      ...style,
      '--tooltip-x': '0px',
      '--tooltip-y': '0px',
      '--tooltip-offset': `${sideOffset}px`,
    } as React.CSSProperties,
    'data-state': context.isOpen ? 'open' : 'closed',
    'data-placement': side,
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

  const arrowStyle = {
    ...style,
    '--tooltip-arrow-x': '0px',
    '--tooltip-arrow-y': '0px',
  } as React.CSSProperties;

  if (Component === 'svg') {
    return (
      <svg
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
    width,
    height,
    className,
    style: arrowStyle,
    'data-placement': context.placement,
  };

  return React.createElement(Component, arrowProps);
};

TooltipArrow.displayName = 'TooltipArrow';
