import React, { useCallback, useEffect, useRef, type ElementType } from 'react';
import { useInteractOutside } from '@/hooks';
import {
  useFloating,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  shift as shiftMiddleware,
  size as sizeMiddleware,
  hide as hideMiddleware,
  arrow as arrowMiddleware,
  autoUpdate,
} from '@floating-ui/react-dom';
import type { SelectContentProps } from './types';
import { useSelectContext } from './SelectRoot';

/**
 * Dropdown container that appears when select is open. Handles keyboard navigation, focus management, and outside click detection. Positioned using Floating UI.
 */
export const SelectContent = <T extends ElementType = 'div'>({
  ref,
  placement = 'bottom-start',
  strategy = 'absolute',
  middleware: customMiddleware,
  sideOffset = 8,
  shift = true,
  collisionPadding = 8,
  flip = true,
  hide = false,
  size = true,
  arrowRef,
  onEscapeKeyDown,
  onPointerDownOutside,
  onCloseAutoFocus: _onCloseAutoFocus,
  as,
  onKeyDown,
  style,
  children,
  ...props
}: SelectContentProps<T>) => {
  const Component = as || 'div';
  const context = useSelectContext();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build middleware array
  const middleware = React.useMemo(() => {
    if (customMiddleware) {
      return customMiddleware;
    }

    const middlewares = [];

    // Offset from trigger
    middlewares.push(offsetMiddleware(sideOffset));

    // Flip to opposite side when no space
    if (flip) {
      middlewares.push(flipMiddleware());
    }

    // Shift to stay in view
    if (shift) {
      middlewares.push(shiftMiddleware({ padding: collisionPadding }));
    }

    // Size to fit available space
    if (size) {
      middlewares.push(
        sizeMiddleware({
          apply({ availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight}px`,
            });
          },
          padding: 10,
        }),
      );
    }

    // Hide when reference is scrolled out of view
    if (hide) {
      middlewares.push(hideMiddleware());
    }

    // Arrow positioning
    if (arrowRef?.current) {
      middlewares.push(arrowMiddleware({ element: arrowRef.current }));
    }

    return middlewares;
  }, [customMiddleware, sideOffset, flip, shift, collisionPadding, size, hide, arrowRef]);

  // Use Floating UI hook for positioning
  const {
    x,
    y,
    strategy: floatingStrategy,
    refs,
    placement: finalPlacement,
  } = useFloating({
    placement,
    strategy,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  // Merge internal refs with Floating UI refs
  useEffect(() => {
    refs.setReference(context.triggerRef.current);
  }, [refs, context.triggerRef]);

  useEffect(() => {
    if (context.contentRef.current) {
      refs.setFloating(context.contentRef.current);
    }
  }, [refs, context.contentRef]);

  // Merge external ref with internal ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(context.contentRef.current);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = context.contentRef.current;
      }
    }
  }, [ref, context.contentRef]);

  // Focus management - focus content when opened
  useEffect(() => {
    if (context.open && context.contentRef.current) {
      // Use preventScroll to avoid scrolling the page when focusing
      context.contentRef.current.focus({ preventScroll: true });
    }
  }, [context.open, context.contentRef]);

  // Handle outside interactions
  useInteractOutside([context.contentRef, context.triggerRef], {
    enabled: context.open,
    onPointerDownOutside: (event) => {
      onPointerDownOutside?.(event);
      if (!event.defaultPrevented) {
        context.onOpenChange(false);
      }
    },
  });

  // Get non-disabled items
  const getNonDisabledItems = useCallback(() => {
    return Array.from(context.items.values()).filter((item) => !item.disabled);
  }, [context.items]);

  // Type-ahead search
  const handleTypeAhead = useCallback(
    (char: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      const newSearch = context.searchString + char.toLowerCase();
      context.setSearchString(newSearch);

      const items = getNonDisabledItems();
      const matchIndex = items.findIndex((item) =>
        item.textValue.toLowerCase().startsWith(newSearch),
      );

      if (matchIndex !== -1) {
        context.setHighlightedIndex(matchIndex);
      }

      searchTimeoutRef.current = setTimeout(() => {
        context.setSearchString('');
      }, 1000);
    },
    [context, getNonDisabledItems],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const { key } = event;
      const items = getNonDisabledItems();

      switch (key) {
        case 'Escape':
          onEscapeKeyDown?.(event.nativeEvent);
          if (!event.defaultPrevented) {
            event.preventDefault();
            context.onOpenChange(false);
            context.triggerRef.current?.focus();
          }
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (context.highlightedIndex >= 0 && context.highlightedIndex < items.length) {
            const selectedItem = items[context.highlightedIndex];
            if (selectedItem) {
              context.onValueChange(selectedItem.value);
              context.onOpenChange(false);
              context.triggerRef.current?.focus();
            }
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (context.highlightedIndex < items.length - 1) {
            context.setHighlightedIndex(context.highlightedIndex + 1);
          } else {
            // Wrap to first
            context.setHighlightedIndex(0);
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (context.highlightedIndex > 0) {
            context.setHighlightedIndex(context.highlightedIndex - 1);
          } else {
            // Wrap to last
            context.setHighlightedIndex(items.length - 1);
          }
          break;

        case 'Home':
        case 'PageUp':
          event.preventDefault();
          context.setHighlightedIndex(0);
          break;

        case 'End':
        case 'PageDown':
          event.preventDefault();
          context.setHighlightedIndex(items.length - 1);
          break;

        case 'Tab':
          event.preventDefault();
          context.onOpenChange(false);
          break;

        default:
          // Type-ahead for single character keys
          if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            handleTypeAhead(key);
          }
          break;
      }
    },
    [context, getNonDisabledItems, handleTypeAhead, onKeyDown, onEscapeKeyDown],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!context.open) {
    return null;
  }

  // Combine Floating UI styles with user styles
  const floatingStyles: React.CSSProperties = {
    position: floatingStrategy,
    top: y ?? 0,
    left: x ?? 0,
    minWidth: context.triggerRef.current?.offsetWidth ?? undefined,
    ...style,
  };

  return (
    <Component
      ref={context.contentRef}
      id={context.contentId}
      role='listbox'
      tabIndex={-1}
      data-state={context.open ? 'open' : 'closed'}
      data-placement={finalPlacement}
      onKeyDown={handleKeyDown}
      style={floatingStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

SelectContent.displayName = 'SelectContent';
