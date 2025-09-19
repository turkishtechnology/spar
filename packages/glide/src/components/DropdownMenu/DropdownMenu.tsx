import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Ref,
  type ReactElement,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuContextValue,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupContextValue,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubContextValue,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
  DropdownMenuFocusStrategy,
  CheckedState,
} from './types';

type MenuItemType = 'item' | 'checkbox' | 'radio' | 'subtrigger';

interface MenuCollectionItem {
  id: string;
  ref: React.RefObject<HTMLElement | null>;
  disabled: boolean;
  textValue: string;
  type: MenuItemType;
}

interface DropdownMenuCollectionContextValue {
  registerItem: (item: MenuCollectionItem) => void;
  unregisterItem: (id: string) => void;
  highlightItem: (id: string | null) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  isItemHighlighted: (id: string) => boolean;
  highlightedId: string | null;
  closeOnSelect: boolean | 'auto';
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
  loop: boolean;
  dir: 'ltr' | 'rtl';
}

const TYPEAHEAD_TIMEOUT = 700;

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);
const DropdownMenuSubContext = createContext<DropdownMenuSubContextValue | null>(null);
const DropdownMenuRadioGroupContext = createContext<DropdownMenuRadioGroupContextValue | null>(
  null,
);
const DropdownMenuCollectionContext = createContext<DropdownMenuCollectionContextValue | null>(
  null,
);

const composeRefs = <T,>(...refs: Array<Ref<T> | undefined>) => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    });
  };
};

const isCharacterKey = (event: ReactKeyboardEvent<HTMLElement>) => {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
};

const useDropdownMenuRootContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu.Root');
  }
  return context;
};

const useMenuScope = () => {
  const subContext = useContext(DropdownMenuSubContext);
  if (subContext) {
    return subContext;
  }
  return useDropdownMenuRootContext();
};

const useDropdownMenuCollectionContext = () => {
  const context = useContext(DropdownMenuCollectionContext);
  if (!context) {
    throw new Error('DropdownMenu items must be rendered within DropdownMenu.Content');
  }
  return context;
};

const useDropdownMenuRadioGroupContext = () => {
  return useContext(DropdownMenuRadioGroupContext);
};

const useDropdownMenuSubContext = () => {
  const context = useContext(DropdownMenuSubContext);
  if (!context) {
    throw new Error('DropdownMenu.Sub components must be used within DropdownMenu.Sub');
  }
  return context;
};

const getCloseKey = (dir: 'ltr' | 'rtl') => (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
const getOpenKey = (dir: 'ltr' | 'rtl') => (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');

export const DropdownMenu = ({
  open,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  dir = 'ltr',
  closeOnSelect = 'auto',
  children,
}: DropdownMenuProps) => {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const triggerRef = useRef<HTMLElement | null>(null);
  const triggerId = useId();
  const contentId = useId();
  const [focusStrategy, setFocusStrategy] = useState<DropdownMenuFocusStrategy>('none');
  const restoreFocusRef = useRef(true);
  const previousOpenRef = useRef(isOpen);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const closeMenu = useCallback(
    (options?: { focusTrigger?: boolean }) => {
      restoreFocusRef.current = options?.focusTrigger !== false;
      handleOpenChange(false);
    },
    [handleOpenChange],
  );

  useEffect(() => {
    if (!previousOpenRef.current && isOpen) {
      restoreFocusRef.current = true;
    }

    if (previousOpenRef.current && !isOpen && restoreFocusRef.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }

    previousOpenRef.current = isOpen;
  }, [isOpen]);

  const contextValue = useMemo<DropdownMenuContextValue>(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
      triggerId,
      contentId,
      modal,
      dir,
      closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    }),
    [
      isOpen,
      handleOpenChange,
      triggerId,
      contentId,
      modal,
      dir,
      closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    ],
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>{children}</DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export const DropdownMenuTrigger = ({
  as: Component = 'button',
  asChild = false,
  disabled = false,
  onClick,
  onKeyDown,
  ref,
  children,
  ...props
}: DropdownMenuTriggerProps) => {
  const menu = useDropdownMenuRootContext();
  const triggerRefCallback = useMemo(
    () => composeRefs<HTMLElement | null>(menu.triggerRef, ref),
    [menu.triggerRef, ref],
  );

  const handleOpen = useCallback(
    (strategy: DropdownMenuFocusStrategy) => {
      if (disabled) return;
      menu.setFocusStrategy(strategy);
      menu.onOpenChange(true);
    },
    [disabled, menu],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }

      if (menu.open) {
        menu.closeMenu();
      } else {
        handleOpen('first');
      }
    },
    [onClick, disabled, menu, handleOpen],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleOpen('first');
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleOpen('last');
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (menu.open) {
          menu.closeMenu();
        } else {
          handleOpen('first');
        }
      }
    },
    [onKeyDown, disabled, handleOpen, menu],
  );

  const commonProps = {
    ...props,
    id: menu.triggerId,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': menu.open,
    'aria-controls': menu.open ? menu.contentId : undefined,
    'data-state': menu.open ? 'open' : 'closed',
    ...(disabled ? { 'data-disabled': '', 'aria-disabled': true } : {}),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  if (asChild) {
    const onlyChild = Children.only(children);
    if (!isValidElement(onlyChild)) {
      throw new Error('DropdownMenuTrigger with asChild expects a single React element child');
    }
    const childRef = (onlyChild as { ref?: Ref<HTMLElement | null> }).ref;

    return cloneElement<Record<string, unknown> & { ref?: Ref<HTMLElement | null> }>(
      onlyChild as ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement | null> }>,
      {
        ...commonProps,
        ref: composeRefs<HTMLElement | null>(childRef, triggerRefCallback),
      },
    );
  }

  const isNativeButton = Component === 'button';

  return (
    <Component
      {...commonProps}
      ref={triggerRefCallback}
      role={isNativeButton ? undefined : 'button'}
      tabIndex={isNativeButton ? commonProps.tabIndex : disabled ? -1 : (commonProps.tabIndex ?? 0)}
      disabled={isNativeButton ? disabled : undefined}
    >
      {children}
    </Component>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

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

    // Update data attributes for styling
    contentElement.setAttribute('data-side', finalSide);
    contentElement.setAttribute('data-align', finalAlign);
  }, [menu.open, side, align, _sideOffset, _alignOffset, _avoidCollisions, menu.triggerRef]);

  // Initial positioning
  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  // Handle scroll and resize events to reposition dropdown
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

interface MenuItemPrimitiveProps extends DropdownMenuItemProps {
  itemType: MenuItemType;
  closeBehavior: 'close' | 'persist';
  role: string;
  onSelectImpl?: (event: React.MouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => void;
}

const MenuItemPrimitive = ({
  as: Component = 'div',
  itemType,
  closeBehavior,
  role,
  onSelect,
  onSelectImpl,
  disabled = false,
  textValue,
  onPointerMove,
  onPointerLeave,
  onFocus,
  onClick,
  onKeyDown,
  ref,
  id: idProp,
  ...props
}: MenuItemPrimitiveProps) => {
  const collection = useDropdownMenuCollectionContext();
  const fallbackId = useId();
  const itemId = idProp ?? fallbackId;
  const itemRef = useRef<HTMLElement | null>(null);
  const setItemRef = composeRefs<HTMLElement | null>(ref, (node: HTMLElement | null) => {
    itemRef.current = node;
  });

  useLayoutEffect(() => {
    const node = itemRef.current;
    const text = textValue ?? node?.textContent?.trim() ?? '';
    collection.registerItem({
      id: itemId,
      ref: itemRef,
      disabled,
      textValue: text,
      type: itemType,
    });

    return () => {
      collection.unregisterItem(itemId);
    };
  }, [itemId, disabled, textValue, itemType, collection.registerItem, collection.unregisterItem]);

  const isHighlighted = collection.isItemHighlighted(itemId);

  const shouldCloseMenu = () => {
    if (collection.closeOnSelect === false) {
      return false;
    }
    if (collection.closeOnSelect === true) {
      return true;
    }
    return closeBehavior === 'close';
  };

  const runSelection = (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    onSelect?.(event);
    if (event.defaultPrevented) {
      return;
    }

    onSelectImpl?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (shouldCloseMenu()) {
      collection.closeMenu();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!disabled && !isHighlighted) {
      collection.highlightItem(itemId);
    }
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerLeave?.(event);
  };

  const handleFocus = (event: ReactFocusEvent<HTMLElement>) => {
    if (!disabled) {
      collection.highlightItem(itemId);
    }
    onFocus?.(event);
  };

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    runSelection(event);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      runSelection(event);
    }
  };

  return (
    <Component
      {...props}
      id={itemId}
      ref={setItemRef}
      role={role}
      tabIndex={disabled ? -1 : isHighlighted ? 0 : -1}
      aria-disabled={disabled || undefined}
      data-highlighted={isHighlighted ? '' : undefined}
      {...(disabled ? { 'data-disabled': '' } : {})}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
};

export const DropdownMenuItem = ({
  role: roleProp = 'menuitem',
  ...props
}: DropdownMenuItemProps) => {
  return <MenuItemPrimitive {...props} role={roleProp} itemType='item' closeBehavior='close' />;
};

DropdownMenuItem.displayName = 'DropdownMenuItem';

const mapCheckedStateToDataAttribute = (checked: CheckedState) => {
  if (checked === 'indeterminate') {
    return 'indeterminate';
  }
  return checked ? 'true' : 'false';
};

const mapCheckedStateToAria = (checked: CheckedState) => {
  if (checked === 'indeterminate') {
    return 'mixed';
  }
  return checked;
};

export const DropdownMenuCheckboxItem = ({
  checked = false,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps) => {
  const handleSelectImpl = useCallback(
    (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return;
      }
      const nextChecked = checked === 'indeterminate' ? true : !checked;
      onCheckedChange?.(nextChecked);
    },
    [checked, onCheckedChange],
  );

  return (
    <MenuItemPrimitive
      {...props}
      role='menuitemcheckbox'
      itemType='checkbox'
      closeBehavior='persist'
      onSelectImpl={handleSelectImpl}
      aria-checked={mapCheckedStateToAria(checked)}
      data-checked={mapCheckedStateToDataAttribute(checked)}
    />
  );
};

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps) => {
  const contextValue = useMemo<DropdownMenuRadioGroupContextValue>(
    () => ({ value, onValueChange }),
    [value, onValueChange],
  );

  return (
    <DropdownMenuRadioGroupContext.Provider value={contextValue}>
      <div {...props} role='group' />
    </DropdownMenuRadioGroupContext.Provider>
  );
};

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

export const DropdownMenuRadioItem = ({ value, ...props }: DropdownMenuRadioItemProps) => {
  const radioGroup = useDropdownMenuRadioGroupContext();
  const checked = radioGroup?.value === value;

  const handleSelectImpl = useCallback(
    (event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return;
      }
      radioGroup?.onValueChange?.(value);
    },
    [radioGroup, value],
  );

  return (
    <MenuItemPrimitive
      {...props}
      role='menuitemradio'
      itemType='radio'
      closeBehavior='persist'
      onSelectImpl={handleSelectImpl}
      aria-checked={checked}
      data-checked={checked ? 'true' : 'false'}
    />
  );
};

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuSeparator = ({
  as: Component = 'div',
  ...props
}: DropdownMenuSeparatorProps) => {
  return <Component {...props} role='separator' data-orientation='horizontal' />;
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuLabel = ({ as: Component = 'div', ...props }: DropdownMenuLabelProps) => {
  return <Component {...props} />;
};

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuGroup = ({ as: Component = 'div', ...props }: DropdownMenuGroupProps) => {
  return <Component {...props} role='group' />;
};

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

export const DropdownMenuSub = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuSubProps) => {
  const rootContext = useDropdownMenuRootContext();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const triggerId = useId();
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [focusStrategy, setFocusStrategy] = useState<DropdownMenuFocusStrategy>('none');
  const restoreFocusRef = useRef(true);
  const previousOpenRef = useRef(isOpen);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const closeMenu = useCallback(
    (options?: { focusTrigger?: boolean }) => {
      restoreFocusRef.current = options?.focusTrigger !== false;
      handleOpenChange(false);
    },
    [handleOpenChange],
  );

  useEffect(() => {
    if (!previousOpenRef.current && isOpen) {
      restoreFocusRef.current = true;
    }

    if (previousOpenRef.current && !isOpen && restoreFocusRef.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }

    previousOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!rootContext.open && isOpen) {
      handleOpenChange(false);
    }
  }, [rootContext.open, isOpen, handleOpenChange]);

  const contextValue = useMemo<DropdownMenuSubContextValue>(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
      triggerId,
      contentId,
      modal: rootContext.modal,
      dir: rootContext.dir,
      closeOnSelect: rootContext.closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    }),
    [
      isOpen,
      handleOpenChange,
      triggerId,
      contentId,
      rootContext.modal,
      rootContext.dir,
      rootContext.closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    ],
  );

  return (
    <DropdownMenuSubContext.Provider value={contextValue}>
      {children}
    </DropdownMenuSubContext.Provider>
  );
};

DropdownMenuSub.displayName = 'DropdownMenuSub';

export const DropdownMenuSubTrigger = ({
  disabled = false,
  onPointerMove,
  onKeyDown,
  onClick,
  ...props
}: DropdownMenuSubTriggerProps) => {
  const subContext = useDropdownMenuSubContext();
  const collection = useDropdownMenuCollectionContext();
  const fallbackId = useId();
  const itemId = props.id ?? fallbackId;

  useEffect(() => {
    if (collection.highlightedId && collection.highlightedId !== itemId && subContext.open) {
      subContext.closeMenu({ focusTrigger: false });
    }
  }, [collection.highlightedId, itemId, subContext.open, subContext.closeMenu]);

  const handleSelectImpl = useCallback(() => {
    if (disabled) {
      return;
    }
    subContext.setFocusStrategy('first');
    subContext.onOpenChange(true);
  }, [disabled, subContext.setFocusStrategy, subContext.onOpenChange]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      onPointerMove?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }
      subContext.setFocusStrategy('first');
      subContext.onOpenChange(true);
    },
    [onPointerMove, disabled, subContext.setFocusStrategy, subContext.onOpenChange],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (!disabled && event.key === getOpenKey(subContext.dir)) {
        event.preventDefault();
        subContext.setFocusStrategy('first');
        subContext.onOpenChange(true);
        return;
      }

      if (event.key === getCloseKey(subContext.dir) && subContext.open) {
        event.preventDefault();
        subContext.closeMenu();
      }
    },
    [
      onKeyDown,
      disabled,
      subContext.dir,
      subContext.open,
      subContext.setFocusStrategy,
      subContext.onOpenChange,
      subContext.closeMenu,
    ],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      handleSelectImpl();
    },
    [onClick, handleSelectImpl],
  );

  return (
    <MenuItemPrimitive
      {...props}
      id={itemId}
      role='menuitem'
      itemType='subtrigger'
      closeBehavior='persist'
      disabled={disabled}
      onSelectImpl={handleSelectImpl}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      aria-haspopup='menu'
      aria-expanded={subContext.open}
      aria-controls={subContext.open ? subContext.contentId : undefined}
      data-state={subContext.open ? 'open' : 'closed'}
      {...(disabled ? { 'data-disabled': '' } : {})}
    />
  );
};

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = (props: DropdownMenuSubContentProps) => {
  useDropdownMenuSubContext();
  return <DropdownMenuContent {...props} />;
};

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';
