import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { DropdownMenuContentProps } from './types';
import {
  useMenuScope,
  DropdownMenuSubContext,
  DropdownMenuCollectionContext,
  type DropdownMenuCollectionContextValue,
  type MenuCollectionItem,
} from './contexts';
import { composeRefs, isCharacterKey, getCloseKey, TYPEAHEAD_TIMEOUT } from './utils';

export const DropdownMenuContent = ({
  as: Component = 'div',
  side: sideProp,
  align = 'start',
  sideOffset: _sideOffset = 0,
  alignOffset: _alignOffset = 0,
  avoidCollisions: _avoidCollisions = true,
  collisionBoundary: _collisionBoundary = null,
  loop = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onKeyDown,
  ref,
  ...props
}: DropdownMenuContentProps) => {
  const menu = useMenuScope();
  const parentSubContext = useContext(DropdownMenuSubContext);
  const isSubmenu = parentSubContext === menu;
  // Auto-determine side based on menu type
  const side = sideProp ?? (isSubmenu ? 'right' : 'bottom');
  const contentRef = useRef<HTMLElement | null>(null);
  const composedRefs = composeRefs<HTMLElement | null>(ref, (node: HTMLElement | null) => {
    contentRef.current = node;
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

  useEffect(() => {
    if (!menu.open) return;
    const node = contentRef.current;
    if (!node) return;

    const doc = node.ownerDocument;
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;
      if (!node.contains(target) && !menu.triggerRef.current?.contains(target as Node)) {
        onPointerDownOutside?.(event);
        menu.closeMenu({ focusTrigger: false });
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null;
      if (!node.contains(target)) {
        onFocusOutside?.(event);
        if (menu.modal) {
          event.preventDefault();
          highlightFirst();
        } else {
          menu.closeMenu({ focusTrigger: false });
        }
      }
    };
    doc.addEventListener('pointerdown', handlePointerDown);
    doc.addEventListener('focusin', handleFocusIn);
    return () => {
      doc.removeEventListener('pointerdown', handlePointerDown);
      doc.removeEventListener('focusin', handleFocusIn);
    };
  }, [
    menu.open,
    menu.triggerRef,
    menu.modal,
    onPointerDownOutside,
    onFocusOutside,
    highlightFirst,
    menu.closeMenu,
  ]);

  const handleKeyDownInternal = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
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

  // Positioning logic - calculate and apply position relative to trigger
  const updatePosition = useCallback(() => {
    if (!menu.open || !contentRef.current || !menu.triggerRef.current) {
      return;
    }

    const triggerElement = menu.triggerRef.current;
    const contentElement = contentRef.current;
    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalSide = side;
    const finalAlign = align;

    // Auto-position based on available space
    if (_avoidCollisions) {
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const spaceRight = viewportWidth - triggerRect.right;
      const spaceLeft = triggerRect.left;

      // Determine best side
      if (side === 'bottom' && spaceBelow < contentRect.height && spaceAbove > spaceBelow) {
        finalSide = 'top';
      } else if (side === 'top' && spaceAbove < contentRect.height && spaceBelow > spaceAbove) {
        finalSide = 'bottom';
      } else if (side === 'right' && spaceRight < contentRect.width && spaceLeft > spaceRight) {
        finalSide = 'left';
      } else if (side === 'left' && spaceLeft < contentRect.width && spaceRight > spaceLeft) {
        finalSide = 'right';
      }
    }

    // Calculate position
    let top = 0;
    let left = 0;

    switch (finalSide) {
      case 'top':
        top = triggerRect.top - contentRect.height - _sideOffset;
        break;
      case 'bottom':
        top = triggerRect.bottom + _sideOffset;
        break;
      case 'left':
        left = triggerRect.left - contentRect.width - _sideOffset;
        break;
      case 'right':
        left = triggerRect.right + _sideOffset;
        break;
    }

    // Calculate alignment for vertical sides (top/bottom)
    if (finalSide === 'top' || finalSide === 'bottom') {
      switch (finalAlign) {
        case 'start':
          left = triggerRect.left + _alignOffset;
          break;
        case 'center':
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 + _alignOffset;
          break;
        case 'end':
          left = triggerRect.right - contentRect.width + _alignOffset;
          break;
      }
    }

    // Calculate alignment for horizontal sides (left/right)
    if (finalSide === 'left' || finalSide === 'right') {
      switch (finalAlign) {
        case 'start':
          top = triggerRect.top + _alignOffset;
          break;
        case 'center':
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 + _alignOffset;
          break;
        case 'end':
          top = triggerRect.bottom - contentRect.height + _alignOffset;
          break;
      }
    }

    // Ensure content stays within viewport bounds
    if (_avoidCollisions) {
      left = Math.max(8, Math.min(left, viewportWidth - contentRect.width - 8));
      top = Math.max(8, Math.min(top, viewportHeight - contentRect.height - 8));
    }

    // Apply positioning
    contentElement.style.position = 'fixed';
    contentElement.style.top = `${top}px`;
    contentElement.style.left = `${left}px`;
    contentElement.style.zIndex = '9999';
    contentElement.style.opacity = '1';

    // Update data attributes for styling
    contentElement.setAttribute('data-side', finalSide);
    contentElement.setAttribute('data-align', finalAlign);
  }, [menu.open, side, align, _sideOffset, _alignOffset, _avoidCollisions, menu.triggerRef]);

  useLayoutEffect(() => {
    if (!menu.open) return;

    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
    }

    updatePosition();

    const rafId = requestAnimationFrame(() => {
      updatePosition();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [updatePosition, menu.open]);

  useEffect(() => {
    if (!menu.open) {
      return;
    }

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    // Listen to scroll events on window and all scrollable parents
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [menu.open, updatePosition]);

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
        data-side={side}
        data-align={align}
        hidden={false}
        tabIndex={-1}
        onKeyDown={handleKeyDownInternal}
      />
    </DropdownMenuCollectionContext.Provider>
  );
};

DropdownMenuContent.displayName = 'DropdownMenuContent';
