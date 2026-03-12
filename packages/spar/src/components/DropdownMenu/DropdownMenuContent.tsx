import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
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

import type {
  DropdownMenuContentProps,
  DropdownMenuCollectionContextValue,
  DropdownMenuCollectionItem,
} from './types';
import {
  useDropdownMenuContext,
  DropdownMenuCollectionContext,
  DropdownMenuContentContext,
} from './hooks';
import { Align, Side } from '@/types';

/**
 * Floating content panel for the dropdown menu.
 * Handles positioning, keyboard navigation, focus management, and outside interaction dismissal.
 */
export const DropdownMenuContent = <T extends ElementType = 'div'>({
  as,
  side = 'bottom',
  align = 'center',
  container,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onKeyDown,
  ref,
  ...props
}: DropdownMenuContentProps<T>) => {
  const Component = as || 'div';
  const menu = useDropdownMenuContext();
  const contentRef = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use custom Floating UI hook for positioning
  const floatingOptions: UseFloatingOptions = {
    side,
    align,
    arrowRef: menu.arrowRef?.current,
  };

  const { floatingStyles, arrowStyles, placement, refs }: UseFloatingReturn =
    useFloating(floatingOptions);

  // Set reference element
  useEffect(() => {
    refs.setReference(menu.triggerRef.current);
  }, [refs, menu.triggerRef]);

  const mergedRef = useMergedRef(contentRef, ref);

  const floatingRef = useCallback(
    (node: HTMLElement | null) => {
      mergedRef(node);
      refs.setFloating(node);
    },
    [mergedRef, refs],
  );

  // --- Item collection ---
  const [items, setItems] = useState<DropdownMenuCollectionItem[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const hadHighlightRef = useRef(false);

  const registerItem = useCallback((item: DropdownMenuCollectionItem) => {
    setItems((previous) => {
      const next = [...previous.filter((entry) => entry.id !== item.id), item];
      next.sort((a, b) => {
        const aNode = a.ref.current;
        const bNode = b.ref.current;
        if (aNode && bNode) {
          const position = aNode.compareDocumentPosition(bNode);
          if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
          if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        }
        return 0;
      });
      return next;
    });
  }, []);

  const unregisterItem = useCallback((id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }, []);

  // --- Highlight ---

  const isItemHighlighted = useCallback((id: string) => highlightedId === id, [highlightedId]);

  const highlightItem = useCallback((id: string | null) => {
    setHighlightedId(id);
  }, []);

  const highlightFirst = useCallback(() => {
    const candidate = items.find((item) => !item.disabled);
    setHighlightedId(candidate?.id ?? null);
  }, [items]);

  const highlightLast = useCallback(() => {
    for (let index = items.length - 1; index >= 0; index -= 1) {
      const item = items[index];
      if (item && !item.disabled) {
        setHighlightedId(item.id);
        return;
      }
    }
    setHighlightedId(null);
  }, [items]);

  const highlightNext = useCallback(() => {
    if (!items.length) return;
    const currentIndex = highlightedId ? items.findIndex((item) => item.id === highlightedId) : -1;
    let index = currentIndex;

    for (let step = 0; step < items.length; step += 1) {
      index = index === -1 ? 0 : index + 1;
      if (index >= items.length) {
        index = 0;
      }
      const candidate = items[index];
      if (candidate && !candidate.disabled) {
        setHighlightedId(candidate.id);
        return;
      }
    }
  }, [items, highlightedId]);

  const highlightPrevious = useCallback(() => {
    if (!items.length) return;
    const currentIndex = highlightedId
      ? items.findIndex((item) => item.id === highlightedId)
      : items.length;
    let index = currentIndex;

    for (let step = 0; step < items.length; step += 1) {
      index = index === items.length ? items.length - 1 : index - 1;
      if (index < 0) {
        index = items.length - 1;
      }
      const candidate = items[index];
      if (candidate && !candidate.disabled) {
        setHighlightedId(candidate.id);
        return;
      }
    }
  }, [items, highlightedId]);

  // --- Typeahead ---

  const { performTypeahead, resetTypeahead } = useTypeahead({
    items,
    highlightedId,
    onHighlight: highlightItem,
  });

  // --- Activation ---

  const handleItemActivation = useCallback(() => {
    if (!highlightedId) return false;

    const currentItem = items.find((item) => item.id === highlightedId);
    const element = currentItem?.ref.current;
    if (!currentItem || currentItem.disabled || !element) return false;

    element.click();
    return true;
  }, [highlightedId, items]);

  // --- Focus strategy ---
  // highlightFirst/Last and setFocusStrategy('none') must stay in the same synchronous
  // layout effect — splitting them causes re-trigger loops during item registration.
  useLayoutEffect(() => {
    if (!menu.open) {
      setHighlightedId(null);
      resetTypeahead();
      return;
    }
    if (menu.focusStrategy === 'first') {
      highlightFirst();
      menu.setFocusStrategy('none');
    } else if (menu.focusStrategy === 'last') {
      highlightLast();
      menu.setFocusStrategy('none');
    }
  }, [menu.open, menu.focusStrategy, highlightFirst, highlightLast, resetTypeahead]);

  useEffect(() => {
    setItems((previous) => previous.filter((item) => item.ref.current));
  }, [menu.open]);

  // --- Focus sync ---
  useEffect(() => {
    if (!menu.open) {
      hadHighlightRef.current = false;
      return;
    }

    if (highlightedId) {
      hadHighlightRef.current = true;
      const currentItem = items.find((item) => item.id === highlightedId);
      const element = currentItem?.ref.current;
      if (element && element !== element.ownerDocument.activeElement) {
        element.focus({ preventScroll: true });
      }
    } else if (hadHighlightRef.current) {
      const contentNode = contentRef.current;
      if (contentNode && !contentNode.contains(contentNode.ownerDocument.activeElement)) {
        contentNode.focus({ preventScroll: true });
      }
    }
  }, [menu.open, highlightedId, items]);

  // --- Outside interaction ---
  useInteractOutside([contentRef, menu.triggerRef], {
    enabled: menu.open,
    includeFocus: true,
    onPointerDownOutside: (event) => {
      onPointerDownOutside?.(event);
      menu.closeMenu({ focusTrigger: false });
    },
    onFocusOutside: (event) => {
      onFocusOutside?.(event);
      if (menu.modal) {
        event.preventDefault();
        highlightFirst();
      } else {
        menu.closeMenu({ focusTrigger: false });
      }
    },
  });

  // --- Keyboard ---

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (performTypeahead(event)) {
        event.preventDefault();
        return;
      }

      switch (event.key) {
        case 'Enter':
        case ' ':
          if (handleItemActivation()) {
            event.preventDefault();
            return;
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          highlightNext();
          return;
        case 'ArrowUp':
          event.preventDefault();
          highlightPrevious();
          return;
        case 'Home':
          event.preventDefault();
          highlightFirst();
          return;
        case 'End':
          event.preventDefault();
          highlightLast();
          return;
        case 'Escape':
          event.preventDefault();
          onEscapeKeyDown?.(event.nativeEvent);
          menu.closeMenu();
          return;
        case 'Tab':
          if (menu.modal) {
            event.preventDefault();
            if (event.shiftKey) {
              highlightPrevious();
            } else {
              highlightNext();
            }
            return;
          }
          menu.closeMenu({ focusTrigger: false });
          return;
        default:
          break;
      }
    },
    [
      onKeyDown,
      performTypeahead,
      handleItemActivation,
      highlightNext,
      highlightPrevious,
      highlightFirst,
      highlightLast,
      onEscapeKeyDown,
      menu.closeMenu,
      menu.modal,
    ],
  );

  // IMPORTANT: Hooks must be called unconditionally in the same order.
  // Previously `useMemo` for collectionValue was after an `if (!menu.open) return null;`
  // which meant the first (closed) render executed fewer hooks than subsequent (open) renders,
  // triggering the React "Rendered more hooks" error. We compute the memo value first and
  // only conditionally return the rendered tree afterwards (this does not break hook rules).
  const collectionValue = useMemo<DropdownMenuCollectionContextValue>(
    () => ({
      registerItem,
      unregisterItem,
      highlightItem,
      highlightFirst,
      highlightLast,
      highlightNext,
      highlightPrevious,
      isItemHighlighted,
      highlightedId,
      closeOnSelect: menu.closeOnSelect,
      closeMenu: menu.closeMenu,
    }),
    [
      registerItem,
      unregisterItem,
      highlightItem,
      highlightFirst,
      highlightLast,
      highlightNext,
      highlightPrevious,
      isItemHighlighted,
      highlightedId,
      menu.closeOnSelect,
      menu.closeMenu,
    ],
  );

  const [currentSide, currentAlign] = useMemo(() => {
    const parts = placement.split('-');
    const placementSide = parts[0] as Side;
    const placementAlign = parts[1] ? (parts[1] as Align) : 'center';
    return [placementSide, placementAlign];
  }, [placement]);

  const contentContextValue = useMemo(
    () => ({ arrowStyles, side: currentSide, align: currentAlign }),
    [arrowStyles, currentSide, currentAlign],
  );

  if (!menu.open || !mounted) {
    return null;
  }

  const portalContainer = container || document.body;

  const ariaAttributes = {
    role: 'menu',
    'aria-labelledby': menu.triggerId,
  };

  const dataAttributes = {
    'data-state': 'open',
    'data-side': currentSide,
    'data-align': currentAlign,
  };

  const contentProps = {
    ...props,
    ref: floatingRef,
    id: menu.contentId,
    ...ariaAttributes,
    ...dataAttributes,
    tabIndex: -1,
    onKeyDown: handleKeyDown,
    style: {
      ...floatingStyles,
      ...props.style,
    },
  };

  const contentElement = (
    <DropdownMenuContentContext.Provider value={contentContextValue}>
      <DropdownMenuCollectionContext.Provider value={collectionValue}>
        <Component {...contentProps} />
      </DropdownMenuCollectionContext.Provider>
    </DropdownMenuContentContext.Provider>
  );

  return createPortal(contentElement, portalContainer);
};

DropdownMenuContent.displayName = 'DropdownMenuContent';
