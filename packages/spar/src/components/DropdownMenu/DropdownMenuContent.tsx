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
import { useInteractOutside, useMergedRef } from '@/hooks';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
  type Placement,
  type Middleware,
} from '@floating-ui/react-dom';
import type {
  DropdownMenuContentProps,
  DropdownMenuCollectionContextValue,
  DropdownMenuCollectionItem,
} from './types';
import type { Side, Align } from '../../types';
import { useDropdownMenuContext, DropdownMenuCollectionContext } from './hooks';
import { isCharacterKey, TYPEAHEAD_TIMEOUT } from './utils/index';

/**
 * Convert side and align to Floating UI placement.
 */
const getPlacement = (side: Side, align: Align): Placement => {
  if (side === 'top' || side === 'bottom') {
    if (align === 'start') return `${side}-start`;
    if (align === 'end') return `${side}-end`;
    return side;
  }
  if (side === 'left' || side === 'right') {
    if (align === 'start') return `${side}-start`;
    if (align === 'end') return `${side}-end`;
    return side;
  }
  return 'bottom';
};

const normalizeTypeaheadValue = (value: string) => value.trim().toLocaleLowerCase();

/**
 * Floating content panel for the dropdown menu.
 * Handles positioning, keyboard navigation, focus management, and outside interaction dismissal.
 */
export const DropdownMenuContent = <T extends ElementType = 'div'>({
  as,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
  collisionBoundary = null,
  collisionPadding = 8,
  loop = false,
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

  const middleware: Middleware[] = useMemo(() => {
    const result: Middleware[] = [offset({ mainAxis: sideOffset, alignmentAxis: alignOffset })];

    if (avoidCollisions) {
      const boundaryValue = collisionBoundary
        ? Array.isArray(collisionBoundary)
          ? collisionBoundary
          : [collisionBoundary]
        : undefined;

      result.push(
        flip({
          ...(boundaryValue && { boundary: boundaryValue }),
          padding: collisionPadding,
        }),
      );
      result.push(
        shift({
          ...(boundaryValue && { boundary: boundaryValue }),
          padding: collisionPadding,
          limiter: limitShift(),
        }),
      );
    }

    return result;
  }, [sideOffset, alignOffset, avoidCollisions, collisionBoundary, collisionPadding]);

  const { x, y, strategy, refs, placement } = useFloating({
    placement: getPlacement(side, align),
    middleware,
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    if (menu.triggerRef.current) {
      refs.setReference(menu.triggerRef.current);
    }
  }, [menu.triggerRef, refs]);

  const mergedRef = useMergedRef(contentRef, ref);

  const floatingRef = useCallback(
    (node: HTMLElement | null) => {
      mergedRef(node);
      if (node) {
        refs.setFloating(node);
      }
    },
    [mergedRef, refs],
  );

  // --- Item collection ---
  const [items, setItems] = useState<DropdownMenuCollectionItem[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const typeaheadRef = useRef('');
  const typeaheadTimeoutId = useRef<number | null>(null);
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
        if (!loop) return;
        index = 0;
      }
      const candidate = items[index];
      if (candidate && !candidate.disabled) {
        setHighlightedId(candidate.id);
        return;
      }
      if (!loop && index === items.length - 1) return;
    }
  }, [items, highlightedId, loop]);

  const highlightPrevious = useCallback(() => {
    if (!items.length) return;
    const currentIndex = highlightedId
      ? items.findIndex((item) => item.id === highlightedId)
      : items.length;
    let index = currentIndex;

    for (let step = 0; step < items.length; step += 1) {
      index = index === items.length ? items.length - 1 : index - 1;
      if (index < 0) {
        if (!loop) return;
        index = items.length - 1;
      }
      const candidate = items[index];
      if (candidate && !candidate.disabled) {
        setHighlightedId(candidate.id);
        return;
      }
      if (!loop && index === 0) return;
    }
  }, [items, highlightedId, loop]);

  // --- Typeahead ---

  const resetTypeahead = useCallback(() => {
    typeaheadRef.current = '';
    if (typeaheadTimeoutId.current !== null) {
      window.clearTimeout(typeaheadTimeoutId.current);
      typeaheadTimeoutId.current = null;
    }
  }, []);

  const performTypeahead = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!isCharacterKey(event)) return false;

      const key = normalizeTypeaheadValue(event.key);
      if (!key) return false;

      const nextSearch = `${typeaheadRef.current}${key}`;
      const isRepeatedKey =
        nextSearch.length > 1 && nextSearch.split('').every((char) => char === nextSearch[0]);
      const search = isRepeatedKey ? key : nextSearch;
      if (!search) return false;

      const enabledItems = items
        .filter((item) => !item.disabled)
        .map((item) => ({ item, value: normalizeTypeaheadValue(item.textValue) }))
        .filter((entry) => entry.value.length > 0);
      if (!enabledItems.length) return false;

      const currentIndex = highlightedId
        ? enabledItems.findIndex((entry) => entry.item.id === highlightedId)
        : -1;

      const findMatch = (startIndex: number) => {
        for (let step = 1; step <= enabledItems.length; step += 1) {
          const index = (startIndex + step) % enabledItems.length;
          const candidate = enabledItems[index];
          if (candidate?.value.startsWith(search)) return candidate.item;
        }
        return null;
      };

      const match = findMatch(currentIndex);
      if (match) setHighlightedId(match.id);

      typeaheadRef.current = search;
      if (typeaheadTimeoutId.current !== null) window.clearTimeout(typeaheadTimeoutId.current);
      typeaheadTimeoutId.current = window.setTimeout(resetTypeahead, TYPEAHEAD_TIMEOUT);

      return true;
    },
    [items, highlightedId, resetTypeahead],
  );

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

  useEffect(
    () => () => {
      if (typeaheadTimeoutId.current !== null) {
        window.clearTimeout(typeaheadTimeoutId.current);
      }
    },
    [],
  );

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
      loop,
      dir: menu.dir,
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
      loop,
      menu.dir,
    ],
  );

  const [currentSide, currentAlign] = useMemo(() => {
    const parts = placement.split('-');
    const placementSide = parts[0] as Side;
    const placementAlign = parts[1] ? (parts[1] as Align) : 'center';
    return [placementSide, placementAlign];
  }, [placement]);

  if (!menu.open || !mounted) {
    return null;
  }

  const portalContainer = container || document.body;

  const contentElement = (
    <DropdownMenuCollectionContext.Provider value={collectionValue}>
      <Component
        {...props}
        ref={floatingRef}
        id={menu.contentId}
        role='menu'
        aria-labelledby={menu.triggerId}
        data-state='open'
        data-side={currentSide}
        data-align={currentAlign}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          ...props.style,
        }}
      />
    </DropdownMenuCollectionContext.Provider>
  );

  return createPortal(contentElement, portalContainer);
};

DropdownMenuContent.displayName = 'DropdownMenuContent';
