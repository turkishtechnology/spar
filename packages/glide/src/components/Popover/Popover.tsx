import React, {
  createContext,
  useContext,
  useId,
  useState,
  useRef,
  useCallback,
  useEffect,
  cloneElement,
  isValidElement,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import type {
  PopoverRootProps,
  PopoverContextValue,
  PopoverState,
  PopoverPosition,
  PopoverSide,
  PopoverAlign,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverArrowProps,
  PopoverAnchorProps,
  PopoverPortalProps,
  PopoverCloseProps,
} from './types';

// Context for sharing popover state between components
const PopoverContext = createContext<PopoverContextValue | null>(null);

/**
 * Hook to access popover context
 */
const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within PopoverRoot');
  }
  return context;
};

/**
 * Custom hook for popover state management
 */
const usePopover = (props: Omit<PopoverRootProps, 'children'>) => {
  const {
    isOpen: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    modal = false,
    side = 'bottom',
    align = 'center',
    sideOffset = 8,
  } = props;

  const generatedId = useId();
  const contentId = `popover-content-${generatedId}`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [state, setState] = useState<PopoverState>({
    isOpen,
    triggerRect: null,
    contentRect: null,
    side,
    align,
    actualSide: side,
    actualAlign: align,
    isPositioned: false,
    triggerElement: null,
    contentElement: null,
    anchorElement: null,
    contentId,
  });

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // SSR safety - only create portal after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update state when controlled prop changes
  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen }));
  }, [isOpen]);

  const openPopover = useCallback(() => {
    const newOpen = true;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    setState((prev) => ({ ...prev, isOpen: newOpen }));
  }, [isControlled, onOpenChange]);

  const closePopover = useCallback(() => {
    const newOpen = false;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
    setState((prev) => ({ ...prev, isOpen: newOpen }));
  }, [isControlled, onOpenChange]);

  const togglePopover = useCallback(() => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }, [isOpen, openPopover, closePopover]);

  return {
    state,
    setState,
    triggerRef,
    contentRef,
    anchorRef,
    modal,
    side,
    align,
    sideOffset,
    openPopover,
    closePopover,
    togglePopover,
    onOpenChange,
    isMounted,
  };
};

/**
 * Utility function to calculate popover position
 */
const calculatePosition = (
  triggerRect: DOMRect,
  contentElement: HTMLElement,
  side: PopoverSide,
  align: PopoverAlign,
  offset: number,
  avoidCollisions: boolean = true,
): PopoverPosition => {
  const contentRect = contentElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = 0;
  let y = 0;

  // Calculate base position
  switch (side) {
    case 'top':
      y = triggerRect.top - contentRect.height - offset;
      break;
    case 'bottom':
      y = triggerRect.bottom + offset;
      break;
    case 'left':
      x = triggerRect.left - contentRect.width - offset;
      break;
    case 'right':
      x = triggerRect.right + offset;
      break;
  }

  // Calculate alignment
  if (side === 'top' || side === 'bottom') {
    switch (align) {
      case 'start':
        x = triggerRect.left;
        break;
      case 'center':
        x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case 'end':
        x = triggerRect.right - contentRect.width;
        break;
    }
  } else {
    switch (align) {
      case 'start':
        y = triggerRect.top;
        break;
      case 'center':
        y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        break;
      case 'end':
        y = triggerRect.bottom - contentRect.height;
        break;
    }
  }

  // Collision detection and adjustment
  if (avoidCollisions) {
    // Adjust for viewport boundaries
    if (x < 0) x = 8;
    if (y < 0) y = 8;
    if (x + contentRect.width > viewportWidth) x = viewportWidth - contentRect.width - 8;
    if (y + contentRect.height > viewportHeight) y = viewportHeight - contentRect.height - 8;
  }

  // Calculate transform origin for animations
  const originX = side === 'left' ? '100%' : side === 'right' ? '0%' : '50%';
  const originY = side === 'top' ? '100%' : side === 'bottom' ? '0%' : '50%';
  const transformOrigin = `${originX} ${originY}`;

  return { x, y, side, align, transformOrigin };
};

/**
 * Utility function to get focusable elements
 */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

/**
 * Root container component that provides context for popover state
 */
export const PopoverRoot = ({ children, ...props }: PopoverRootProps) => {
  const popoverState = usePopover(props);

  const contextValue: PopoverContextValue = {
    state: popoverState.state,
    triggerRef: popoverState.triggerRef,
    contentRef: popoverState.contentRef,
    anchorRef: popoverState.anchorRef,
    modal: popoverState.modal,
    side: popoverState.side,
    align: popoverState.align,
    sideOffset: popoverState.sideOffset,
    openPopover: popoverState.openPopover,
    closePopover: popoverState.closePopover,
    togglePopover: popoverState.togglePopover,
    ...(popoverState.onOpenChange && { onOpenChange: popoverState.onOpenChange }),
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      <div data-state={popoverState.state.isOpen ? 'open' : 'closed'}>{children}</div>
    </PopoverContext.Provider>
  );
};

/**
 * Trigger element that opens/closes the popover
 */
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, children, isDisabled = false, onClick, onKeyDown, ...props }, ref) => {
    const { state, triggerRef, togglePopover, openPopover } = usePopoverContext();

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;

        event.preventDefault();
        togglePopover();
        onClick?.(event);
      },
      [isDisabled, togglePopover, onClick],
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (isDisabled) return;

        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault();
            togglePopover();
            break;
          case 'ArrowDown':
            event.preventDefault();
            if (!state.isOpen) {
              openPopover();
            }
            break;
        }
        onKeyDown?.(event);
      },
      [isDisabled, state.isOpen, togglePopover, openPopover, onKeyDown],
    );

    const triggerProps = {
      ref: (element: HTMLButtonElement | null) => {
        triggerRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      'aria-expanded': state.isOpen,
      'aria-controls': state.isOpen ? state.contentId : undefined,
      'aria-haspopup': 'dialog' as const,
      disabled: isDisabled,
      'data-state': state.isOpen ? 'open' : 'closed',
      'data-disabled': isDisabled ? '' : undefined,
      ...props,
    };

    if (asChild && isValidElement(children)) {
      return cloneElement(children, triggerProps);
    }

    return (
      <button type='button' {...triggerProps}>
        {children}
      </button>
    );
  },
);

/**
 * Content container that holds the popover content
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      side = 'bottom',
      align = 'center',
      sideOffset = 8,
      alignOffset = 0,
      avoidCollisions = true,
      collisionBoundary,
      hideWhenDetached = false,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      trapFocus = false,
      children,
      style,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    // Unused props for future implementation
    void alignOffset;
    void collisionBoundary;
    void hideWhenDetached;

    const { state, triggerRef, contentRef, modal, closePopover } = usePopoverContext();

    const [position, setPosition] = useState<PopoverPosition>({
      x: 0,
      y: 0,
      side,
      align,
      transformOrigin: '50% 0%',
    });
    const [isMounted, setIsMounted] = useState(false);

    // SSR safety
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Position calculation
    useEffect(() => {
      if (!state.isOpen || !triggerRef.current || !contentRef.current) return;

      const updatePosition = () => {
        const triggerRect = triggerRef.current!.getBoundingClientRect();
        const newPosition = calculatePosition(
          triggerRect,
          contentRef.current!,
          side,
          align,
          sideOffset,
          avoidCollisions,
        );
        setPosition(newPosition);
      };

      updatePosition();

      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, [state.isOpen, side, align, sideOffset, avoidCollisions]);

    // Focus management
    useEffect(() => {
      if (!state.isOpen || !contentRef.current) return;

      const contentElement = contentRef.current;

      // Focus first focusable element when opening
      const focusableElements = getFocusableElements(contentElement);
      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      } else {
        contentElement.focus();
      }

      onOpenAutoFocus?.(new Event('openautofocus'));

      return () => {
        // Return focus to trigger when closing
        if (triggerRef.current) {
          triggerRef.current.focus();
          onCloseAutoFocus?.(new Event('closeautofocus'));
        }
      };
    }, [state.isOpen, onOpenAutoFocus, onCloseAutoFocus]);

    // Escape key handling
    useEffect(() => {
      if (!state.isOpen) return;

      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closePopover();
          onEscapeKeyDown?.(event);
        }
      };

      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [state.isOpen, closePopover, onEscapeKeyDown]);

    // Outside interaction handling
    useEffect(() => {
      if (!state.isOpen) return;

      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          closePopover();
          onPointerDownOutside?.(event);
          onInteractOutside?.(event);
        }
      };

      const handleFocusOutside = (event: FocusEvent) => {
        if (trapFocus) return; // Don't close if focus is trapped

        const target = event.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          closePopover();
          onFocusOutside?.(event);
          onInteractOutside?.(event);
        }
      };

      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('focusin', handleFocusOutside);

      return () => {
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('focusin', handleFocusOutside);
      };
    }, [
      state.isOpen,
      trapFocus,
      closePopover,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
    ]);

    // Focus trapping
    useEffect(() => {
      if (!state.isOpen || !trapFocus || !contentRef.current) return;

      const contentElement = contentRef.current;
      const focusableElements = getFocusableElements(contentElement);

      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable?.focus();
          }
        }
      };

      contentElement.addEventListener('keydown', handleTabKey);
      return () => contentElement.removeEventListener('keydown', handleTabKey);
    }, [state.isOpen, trapFocus]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Handle Home/End keys within content
        if (event.key === 'Home' || event.key === 'End') {
          const focusableElements = getFocusableElements(event.currentTarget);
          if (focusableElements.length > 0) {
            event.preventDefault();
            const targetElement =
              event.key === 'Home'
                ? focusableElements[0]
                : focusableElements[focusableElements.length - 1];
            targetElement?.focus();
          }
        }
        onKeyDown?.(event);
      },
      [onKeyDown],
    );

    if (!state.isOpen || !isMounted) return null;

    const contentElement = (
      <div
        ref={(element: HTMLDivElement | null) => {
          contentRef.current = element;
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
        id={state.contentId}
        role={modal ? 'dialog' : undefined}
        aria-modal={modal ? 'true' : undefined}
        tabIndex={-1}
        data-state='open'
        data-side={position.side}
        data-align={position.align}
        style={
          {
            position: 'absolute',
            left: position.x,
            top: position.y,
            '--popover-content-transform-origin': position.transformOrigin,
            '--popover-content-available-width': `${window.innerWidth - position.x - 16}px`,
            '--popover-content-available-height': `${window.innerHeight - position.y - 16}px`,
            zIndex: 50,
            ...style,
          } as React.CSSProperties
        }
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );

    return createPortal(contentElement, document.body);
  },
);

/**
 * Portal component for rendering content in a different DOM location
 */
export const PopoverPortal = ({ children, container }: PopoverPortalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(children, container || document.body);
};

/**
 * Anchor component for custom positioning reference
 */
export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>(
  ({ asChild = false, children, ...props }, ref) => {
    const { anchorRef } = usePopoverContext();

    const anchorProps = {
      ref: (element: HTMLDivElement | null) => {
        anchorRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      'data-popover-anchor': '',
      ...props,
    };

    if (asChild && isValidElement(children)) {
      return cloneElement(children, anchorProps);
    }

    return <div {...anchorProps}>{children}</div>;
  },
);

/**
 * Close button component that automatically closes the popover
 */
export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ asChild = false, children, onClick, ...props }, ref) => {
    const { closePopover } = usePopoverContext();

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        closePopover();
        onClick?.(event);
      },
      [closePopover, onClick],
    );

    const closeProps = {
      ref,
      onClick: handleClick,
      'data-popover-close': '',
      ...props,
    };

    if (asChild && isValidElement(children)) {
      return cloneElement(children, closeProps);
    }

    return (
      <button type='button' {...closeProps}>
        {children}
      </button>
    );
  },
);

/**
 * Optional arrow element for popover visual enhancement
 */
export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ width = 10, height = 5, offset = 0, style, ...props }, ref) => {
    const { state } = usePopoverContext();

    if (!state.isOpen) return null;

    return (
      <div
        ref={ref}
        role='presentation'
        data-side={state.actualSide}
        style={
          {
            position: 'absolute',
            width,
            height,
            '--popover-arrow-offset': `${offset}px`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);

// Set display names for better debugging
PopoverRoot.displayName = 'PopoverRoot';
PopoverTrigger.displayName = 'PopoverTrigger';
PopoverContent.displayName = 'PopoverContent';
PopoverPortal.displayName = 'PopoverPortal';
PopoverAnchor.displayName = 'PopoverAnchor';
PopoverClose.displayName = 'PopoverClose';
PopoverArrow.displayName = 'PopoverArrow';
