import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useInteractOutside } from '@/hooks';
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
import type { DropdownMenuContentProps } from './types';
import type { Side, Align } from '../../types';
import {
  useMenuScope,
  DropdownMenuSubContext,
  DropdownMenuCollectionContext,
  type DropdownMenuCollectionContextValue,
  type MenuCollectionItem,
} from './contexts';
import { composeRefs, isCharacterKey, getCloseKey, TYPEAHEAD_TIMEOUT } from './utils';

/**
 * Convert side and align to Floating UI placement
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

export const DropdownMenuContent = <T extends ElementType = 'div'>({
  as,
  side: sideProp,
  align = 'start',
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
  collisionBoundary = null,
  collisionPadding = 8,
  loop = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onKeyDown,
  ref,
  ...props
}: DropdownMenuContentProps<T>) => {
  const Component = as || 'div';
  const menu = useMenuScope();
  const parentSubContext = useContext(DropdownMenuSubContext);
  const isSubmenu = parentSubContext === menu;
  // Get closeRootMenu for submenus - this closes the entire menu hierarchy
  const closeRootMenu =
    isSubmenu && parentSubContext ? parentSubContext.closeRootMenu : menu.closeMenu;
  // Auto-determine side based on menu type
  const side = sideProp ?? (isSubmenu ? 'right' : 'bottom');
  const contentRef = useRef<HTMLElement | null>(null);

  // Configure Floating UI middleware
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

  // Floating UI setup
  const { x, y, strategy, refs, placement } = useFloating({
    placement: getPlacement(side, align),
    middleware,
    whileElementsMounted: autoUpdate,
  });

  // Set trigger ref from context
  useLayoutEffect(() => {
    if (menu.triggerRef.current) {
      refs.setReference(menu.triggerRef.current);
    }
  }, [menu.triggerRef, refs]);

  // Set floating ref
  useLayoutEffect(() => {
    if (contentRef.current) {
      refs.setFloating(contentRef.current);
    }
  }, [refs]);

  // Compose refs
  const composedRefs = composeRefs<HTMLElement | null>(ref, (node: HTMLElement | null) => {
    contentRef.current = node;
    if (node) {
      refs.setFloating(node);
    }
  });

  const [items, setItems] = useState<MenuCollectionItem[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const typeaheadRef = useRef('');
  const typeaheadTimeoutId = useRef<number | null>(null);

  const registerItem = useCallback((item: MenuCollectionItem) => {
    setItems((previous) => {
      const next = [...previous.filter((entry) => entry.id !== item.id), item];
      next.sort((a, b) => {
        const aNode = a.ref.current;
        const bNode = b.ref.current;
        if (aNode && bNode) {
          const position = aNode.compareDocumentPosition(bNode);
          if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            return -1;
          }
          if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            return 1;
          }
        }
        return 0;
      });
      return next;
    });
  }, []);

  const unregisterItem = useCallback((id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const isItemHighlighted = useCallback(
    (id: string) => {
      return highlightedId === id;
    },
    [highlightedId],
  );

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
      if (!loop && index === items.length - 1) {
        return;
      }
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
      if (!loop && index === 0) {
        return;
      }
    }
  }, [items, highlightedId, loop]);

  const resetTypeahead = useCallback(() => {
    typeaheadRef.current = '';
    if (typeaheadTimeoutId.current !== null) {
      window.clearTimeout(typeaheadTimeoutId.current);
      typeaheadTimeoutId.current = null;
    }
  }, []);

  const performTypeahead = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (!isCharacterKey(event)) {
        return false;
      }

      const search = (typeaheadRef.current + event.key.toLowerCase()).trim();
      if (!search) {
        return false;
      }

      const enabledItems = items.filter((item) => !item.disabled);
      if (!enabledItems.length) {
        return false;
      }

      const currentIndex = highlightedId
        ? enabledItems.findIndex((item) => item.id === highlightedId)
        : -1;

      const findMatch = (startIndex: number) => {
        for (let offset = 1; offset <= enabledItems.length; offset += 1) {
          const index = (startIndex + offset) % enabledItems.length;
          const candidate = enabledItems[index];
          if (!candidate) {
            continue;
          }
          const value = candidate.textValue.toLowerCase();
          if (value.startsWith(search)) {
            return candidate;
          }
        }
        return null;
      };

      const match = findMatch(currentIndex);
      if (match) {
        setHighlightedId(match.id);
      }

      typeaheadRef.current = search;
      if (typeaheadTimeoutId.current !== null) {
        window.clearTimeout(typeaheadTimeoutId.current);
      }
      typeaheadTimeoutId.current = window.setTimeout(resetTypeahead, TYPEAHEAD_TIMEOUT);

      return true;
    },
    [items, highlightedId, resetTypeahead],
  );

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
    // If already 'none' do nothing (prevents redundant state updates each render)
  }, [menu.open, menu.focusStrategy, highlightFirst, highlightLast, resetTypeahead]);

  useEffect(() => {
    setItems((previous) => previous.filter((item) => item.ref.current));
  }, [menu.open]);

  useEffect(() => {
    if (!menu.open || !highlightedId) {
      return;
    }

    const currentItem = items.find((item) => item.id === highlightedId);
    const element = currentItem?.ref.current;
    if (element && element !== element.ownerDocument.activeElement) {
      element.focus({ preventScroll: true });
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

  // Handle outside interactions
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

  const handleKeyDownInternal = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (performTypeahead(event)) {
        event.preventDefault();
        return;
      }

      switch (event.key) {
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
          // Escape closes the entire menu hierarchy, not just the current level
          closeRootMenu();
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

      if (isSubmenu && event.key === getCloseKey(menu.dir)) {
        event.preventDefault();
        menu.closeMenu();
      }
    },
    [
      onKeyDown,
      performTypeahead,
      highlightNext,
      highlightPrevious,
      highlightFirst,
      highlightLast,
      onEscapeKeyDown,
      closeRootMenu,
      menu.dir,
      menu.closeMenu,
      menu.modal,
      isSubmenu,
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

  // Extract placement information for data attributes
  const [currentSide, currentAlign] = useMemo(() => {
    const parts = placement.split('-');
    const placementSide = parts[0] as Side;
    const placementAlign = parts[1] ? (parts[1] as Align) : 'center';
    return [placementSide, placementAlign];
  }, [placement]);

  if (!menu.open) {
    return null;
  }

  return (
    <DropdownMenuCollectionContext.Provider value={collectionValue}>
      <Component
        {...props}
        ref={composedRefs}
        id={menu.contentId}
        role='menu'
        aria-labelledby={menu.triggerId}
        data-state='open'
        data-side={currentSide}
        data-align={currentAlign}
        tabIndex={-1}
        onKeyDown={handleKeyDownInternal}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          ...props.style,
        }}
      />
    </DropdownMenuCollectionContext.Provider>
  );
};

DropdownMenuContent.displayName = 'DropdownMenuContent';
