import React, {
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useState,
  type ElementType,
} from 'react';
import { createPortal } from 'react-dom';
import {
  useInteractOutside,
  useMergedRef,
  useFloating,
  useTypeahead,
  type UseFloatingOptions,
  type UseFloatingReturn,
} from '@/hooks';
import { useSelectContext, SelectContentContext, SelectCollectionContext } from './hooks';
import type { SelectContentProps, SelectCollectionContextValue } from './types';
import { Align, Side } from '@/types';

/**
 * Dropdown container that appears when select is open. Handles keyboard navigation, focus management, and outside click detection. Positioned using Floating UI.
 */
export const SelectContent = <T extends ElementType = 'div'>({
  ref,
  side = 'bottom',
  align = 'center',
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
    floatingStyles,
    arrowStyles,
    placement: finalPlacement,
    refs,
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

  // --- Highlight state (owned by Content, not Root) ---
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Enabled items for keyboard navigation
  const enabledItems = useMemo(
    () => Array.from(context.items.values()).filter((item) => !item.disabled),
    [context.items],
  );

  // Items mapped for typeahead (id = value string)
  const typeaheadItems = useMemo(
    () =>
      Array.from(context.items.values()).map((item) => ({
        id: item.value,
        textValue: item.textValue,
        disabled: item.disabled,
      })),
    [context.items],
  );

  // --- Highlight helpers ---
  const highlightItem = useCallback((id: string | null) => {
    setHighlightedId(id);
  }, []);

  const isItemHighlighted = useCallback((id: string) => highlightedId === id, [highlightedId]);

  const highlightFirst = useCallback(() => {
    const candidate = enabledItems[0];
    setHighlightedId(candidate?.value ?? null);
  }, [enabledItems]);

  const highlightLast = useCallback(() => {
    const candidate = enabledItems[enabledItems.length - 1];
    setHighlightedId(candidate?.value ?? null);
  }, [enabledItems]);

  const highlightNext = useCallback(() => {
    if (!enabledItems.length) return;
    const currentIndex = highlightedId
      ? enabledItems.findIndex((item) => item.value === highlightedId)
      : -1;
    const nextIndex = (currentIndex + 1) % enabledItems.length;
    const candidate = enabledItems[nextIndex];
    if (candidate) setHighlightedId(candidate.value);
  }, [enabledItems, highlightedId]);

  const highlightPrevious = useCallback(() => {
    if (!enabledItems.length) return;
    const currentIndex = highlightedId
      ? enabledItems.findIndex((item) => item.value === highlightedId)
      : enabledItems.length;
    const prevIndex = currentIndex <= 0 ? enabledItems.length - 1 : currentIndex - 1;
    const candidate = enabledItems[prevIndex];
    if (candidate) setHighlightedId(candidate.value);
  }, [enabledItems, highlightedId]);

  // --- Typeahead ---
  const { performTypeahead, resetTypeahead } = useTypeahead({
    items: typeaheadItems,
    highlightedId,
    onHighlight: highlightItem,
  });

  // --- Focus strategy ---
  // highlightFirst/Last/Selected and setFocusStrategy('none') must stay in the same
  // synchronous layout effect to avoid re-trigger loops during item registration.
  useLayoutEffect(() => {
    if (!context.open) {
      setHighlightedId(null);
      resetTypeahead();
      return;
    }
    if (context.focusStrategy === 'selected') {
      const selectedItem = enabledItems.find((item) => item.value === context.value);
      setHighlightedId(selectedItem?.value ?? enabledItems[0]?.value ?? null);
      context.setFocusStrategy('none');
    } else if (context.focusStrategy === 'first') {
      highlightFirst();
      context.setFocusStrategy('none');
    } else if (context.focusStrategy === 'last') {
      highlightLast();
      context.setFocusStrategy('none');
    }
  }, [
    context.open,
    context.focusStrategy,
    context.value,
    enabledItems,
    highlightFirst,
    highlightLast,
    resetTypeahead,
    context.setFocusStrategy,
  ]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      // Typeahead first (consistent with DropdownMenu)
      if (performTypeahead(event)) {
        event.preventDefault();
        return;
      }

      switch (event.key) {
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
          if (highlightedId) {
            const selectedItem = enabledItems.find((item) => item.value === highlightedId);
            if (selectedItem) {
              context.onValueChange(selectedItem.value);
              context.onOpenChange(false);
              context.triggerRef.current?.focus();
            }
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          highlightNext();
          break;

        case 'ArrowUp':
          event.preventDefault();
          highlightPrevious();
          break;

        case 'Home':
        case 'PageUp':
          event.preventDefault();
          highlightFirst();
          break;

        case 'End':
        case 'PageDown':
          event.preventDefault();
          highlightLast();
          break;

        case 'Tab':
          context.triggerRef.current?.focus();
          context.onOpenChange(false);
          break;

        default:
          break;
      }
    },
    [
      context,
      enabledItems,
      highlightedId,
      performTypeahead,
      highlightNext,
      highlightPrevious,
      highlightFirst,
      highlightLast,
      onKeyDown,
      onEscapeKeyDown,
    ],
  );

  // Extract placement information for data attributes
  const [currentSide, currentAlign] = useMemo(() => {
    const parts = finalPlacement.split('-');
    const placementSide = parts[0] as Side;
    const placementAlign = parts[1] ? (parts[1] as Align) : 'center';
    return [placementSide, placementAlign];
  }, [finalPlacement]);

  const contentContextValue = useMemo(
    () => ({ arrowStyles, side: currentSide, align: currentAlign }),
    [arrowStyles, currentSide, currentAlign],
  );

  // Collection context value — provided to SelectItem descendants
  // Must be computed before the early return to keep hook call order stable.
  const collectionValue = useMemo<SelectCollectionContextValue>(
    () => ({
      highlightItem,
      highlightFirst,
      highlightLast,
      highlightNext,
      highlightPrevious,
      isItemHighlighted,
      highlightedId,
    }),
    [
      highlightItem,
      highlightFirst,
      highlightLast,
      highlightNext,
      highlightPrevious,
      isItemHighlighted,
      highlightedId,
    ],
  );

  if (!context.open || !mounted) {
    // Render children in a hidden container (no portal, no positioning)
    // so items can register their data for SelectValue display.
    return (
      <SelectContentContext.Provider value={contentContextValue}>
        <SelectCollectionContext.Provider value={collectionValue}>
          <Component hidden>{children}</Component>
        </SelectCollectionContext.Provider>
      </SelectContentContext.Provider>
    );
  }

  // Combine Floating UI styles with component-specific extras
  const contentStyle: React.CSSProperties = {
    ...floatingStyles,
    ...style,
  };

  const ariaAttributes = {
    role: 'listbox',
    'aria-labelledby': context.triggerId,
  };

  const dataAttributes = {
    'data-state': context.open ? 'open' : 'closed',
    'data-side': currentSide,
    'data-align': currentAlign,
  };

  const contentProps = {
    ref: floatingRef,
    id: context.contentId,
    ...ariaAttributes,
    tabIndex: -1,
    ...dataAttributes,
    onKeyDown: handleKeyDown,
    style: contentStyle,
    ...props,
  };

  const portalContainer = container || document.body;

  const contentElement = (
    <SelectContentContext.Provider value={contentContextValue}>
      <SelectCollectionContext.Provider value={collectionValue}>
        <Component {...contentProps}>{children}</Component>
      </SelectCollectionContext.Provider>
    </SelectContentContext.Provider>
  );

  return createPortal(contentElement, portalContainer);
};

SelectContent.displayName = 'SelectContent';
