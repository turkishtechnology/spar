import React, { useEffect, useRef, useCallback, useMemo, useState, type ElementType } from 'react';
import { createPortal } from 'react-dom';
import {
  useInteractOutside,
  useMergedRef,
  useFloating,
  type UseFloatingOptions,
  type UseFloatingReturn,
} from '@/hooks';
import { useSelectContext } from './hooks';
import type { SelectContentProps } from './types';
import { Align, Side } from '@/types';

/**
 * Dropdown container that appears when select is open. Handles keyboard navigation, focus management, and outside click detection. Positioned using Floating UI.
 */
export const SelectContent = <T extends ElementType = 'div'>({
  ref,
  side = 'bottom',
  align = 'start',
  container,
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

  // SSR safety - only render portal after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use custom Floating UI hook for positioning
  const floatingOptions: UseFloatingOptions = {
    side,
    align,
    arrowRef: context.arrowRef?.current ?? null,
  };

  const {
    x,
    y,
    strategy,
    placement: finalPlacement,
    refs,
    middlewareData,
  }: UseFloatingReturn = useFloating(floatingOptions);

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

  // Extract placement information for data attributes
  const [currentSide, currentAlign] = useMemo(() => {
    const parts = finalPlacement.split('-');
    const placementSide = parts[0] as Side;
    const placementAlign = parts[1] ? (parts[1] as Align) : 'center';
    return [placementSide, placementAlign];
  }, [finalPlacement]);

  // Calculate arrow position for CSS custom properties
  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  if (!context.open || !mounted) {
    return null;
  }

  // Combine Floating UI styles with user styles
  const floatingStyles: React.CSSProperties = {
    position: strategy,
    top: y ?? 0,
    left: x ?? 0,
    minWidth: context.triggerRef.current?.offsetWidth ?? undefined,
    // Arrow positioning via CSS custom properties
    '--select-arrow-x': arrowX === undefined ? undefined : `${arrowX}px`,
    '--select-arrow-y': arrowY === undefined ? undefined : `${arrowY}px`,
    ...style,
  } as React.CSSProperties;

  const portalContainer = container || document.body;

  const contentElement = (
    <Component
      ref={floatingRef}
      id={context.contentId}
      role='listbox'
      aria-labelledby={context.triggerId}
      tabIndex={-1}
      data-state={context.open ? 'open' : 'closed'}
      data-side={currentSide}
      data-align={currentAlign}
      onKeyDown={handleKeyDown}
      style={floatingStyles}
      {...props}
    >
      {children}
    </Component>
  );

  return createPortal(contentElement, portalContainer);
};

SelectContent.displayName = 'SelectContent';
