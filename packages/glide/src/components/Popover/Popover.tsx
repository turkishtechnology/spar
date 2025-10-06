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
} from 'react';
import { createPortal } from 'react-dom';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  size,
  hide,
  type Placement,
  type Strategy,
} from '@floating-ui/react-dom';
import type {
  PopoverRootProps,
  PopoverContextValue,
  PopoverState,
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
 * Custom hook for popover state management with Floating UI
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

  const arrowRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  // Floating UI setup
  const placement = getPlacement(side, align);
  const {
    x,
    y,
    strategy,
    refs,
    update,
    placement: actualPlacement,
  } = useFloating({
    placement,
    open: isOpen,
    middleware: [
      offset(sideOffset),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift({
        padding: 8,
      }),
      arrow({
        element: arrowRef,
      }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
      hide(),
    ],
    strategy: 'absolute' as Strategy,
  });

  const [isMounted, setIsMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-update position
  useEffect(() => {
    if (!isOpen || !refs.reference.current || !refs.floating.current) return;

    const cleanup = autoUpdate(refs.reference.current, refs.floating.current, update);
    return cleanup;
  }, [isOpen, refs.reference, refs.floating, update]);

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

  // Update state when open changes
  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen }));
  }, [isOpen]);

  // Update actual placement in state
  useEffect(() => {
    if (actualPlacement) {
      const [actualSide, actualAlign] = actualPlacement.split('-') as [
        PopoverSide,
        PopoverAlign | undefined,
      ];
      setState((prev) => ({
        ...prev,
        actualSide,
        actualAlign: actualAlign || 'center',
      }));
    }
  }, [actualPlacement]);

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
    triggerRef: refs.reference,
    contentRef: refs.floating,
    anchorRef,
    arrowRef,
    floatingStyles: {
      position: strategy,
      top: y ?? 0,
      left: x ?? 0,
    },
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
 * Utility function to convert side + align to Floating UI placement
 */
const getPlacement = (side: PopoverSide, align: PopoverAlign): Placement => {
  if (align === 'center') {
    return side as Placement;
  }
  return `${side}-${align}` as Placement;
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
    triggerRef: popoverState.triggerRef as React.RefObject<HTMLElement | null>,
    contentRef: popoverState.contentRef as React.RefObject<HTMLDivElement | null>,
    anchorRef: popoverState.anchorRef,
    arrowRef: popoverState.arrowRef,
    floatingStyles: popoverState.floatingStyles,
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
export const PopoverTrigger = ({
  asChild = false,
  children,
  isDisabled = false,
  onClick,
  onKeyDown,
  ref,
  ...props
}: PopoverTriggerProps) => {
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
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = element;
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
};

/**
 * Content container that holds the popover content
 */
export const PopoverContent = ({
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
  ref,
  ...props
}: PopoverContentProps) => {
  // Unused props for future implementation
  void side;
  void align;
  void sideOffset;
  void alignOffset;
  void collisionBoundary;
  void hideWhenDetached;
  void avoidCollisions;

  const { state, triggerRef, contentRef, floatingStyles, modal, closePopover } =
    usePopoverContext();

  const [isMounted, setIsMounted] = useState(false);

  // SSR safety
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        (triggerRef.current as HTMLElement).focus();
        onCloseAutoFocus?.(new Event('closeautofocus'));
      }
    };
  }, [state.isOpen, onOpenAutoFocus, onCloseAutoFocus, contentRef, triggerRef]);

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
    contentRef,
    triggerRef,
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
  }, [state.isOpen, trapFocus, contentRef]);

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
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
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
      data-side={state.actualSide}
      data-align={state.actualAlign}
      style={{
        ...floatingStyles,
        zIndex: 50,
        ...style,
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );

  return createPortal(contentElement, document.body);
};

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
export const PopoverAnchor = ({ asChild = false, children, ref, ...props }: PopoverAnchorProps) => {
  const { anchorRef } = usePopoverContext();

  const anchorProps = {
    ref: (element: HTMLDivElement | null) => {
      (anchorRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
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
};

/**
 * Close button component that automatically closes the popover
 */
export const PopoverClose = ({
  asChild = false,
  children,
  onClick,
  ref,
  ...props
}: PopoverCloseProps) => {
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
};

/**
 * Optional arrow element for popover visual enhancement
 */
export const PopoverArrow = ({
  width = 10,
  height = 5,
  offset = 0,
  style,
  ref,
  ...props
}: PopoverArrowProps) => {
  const { state, arrowRef } = usePopoverContext();

  // Unused prop for future implementation
  void offset;

  if (!state.isOpen) return null;

  return (
    <div
      ref={(element: HTMLDivElement | null) => {
        (arrowRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      role='presentation'
      data-side={state.actualSide}
      style={
        {
          position: 'absolute',
          width,
          height,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

// Set display names for better debugging
PopoverRoot.displayName = 'PopoverRoot';
PopoverTrigger.displayName = 'PopoverTrigger';
PopoverContent.displayName = 'PopoverContent';
PopoverPortal.displayName = 'PopoverPortal';
PopoverAnchor.displayName = 'PopoverAnchor';
PopoverClose.displayName = 'PopoverClose';
PopoverArrow.displayName = 'PopoverArrow';
