import * as React from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectViewportProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectItemIndicatorProps,
  SelectScrollButtonProps,
  SelectIconProps,
  SelectPortalProps,
  SelectImperativeHandle,
  SelectAction,
  SelectStateSnapshot,
  SelectItemRegistration,
  SelectInternalContextValue,
} from './types';

// Default filter: prefix match (case-insensitive)
const defaultFilter = (optionText: string, typed: string): boolean => {
  return optionText.toLowerCase().startsWith(typed.toLowerCase());
};

// ID factory (deterministic per instance)
let globalSelectId = 0;
const createBaseId = (provided?: string): string => {
  if (provided) return provided;

  return `glide-select-${++globalSelectId}`;
};

// Reducer for state management
const selectReducer = (state: SelectStateSnapshot, action: SelectAction): SelectStateSnapshot => {
  switch (action.type) {
    case 'OPEN':
      return state.open ? state : { ...state, open: true };

    case 'CLOSE':
      return state.open ? { ...state, open: false, highlight: null, typeahead: '' } : state;

    case 'TOGGLE':
      return {
        ...state,
        open: !state.open,
        highlight: !state.open ? state.highlight : null,
        typeahead: !state.open ? state.typeahead : '',
      };

    case 'REGISTER_ITEM': {
      const existingIndex = state.items.findIndex((i) => i.value === action.item.value);
      let items: SelectItemRegistration[];

      if (existingIndex !== -1) {
        items = [...state.items];
        items[existingIndex] = action.item; // last registration wins

        // Dev warning for duplicate item values
        // eslint-disable-next-line no-console
        if (typeof console !== 'undefined' && console.warn) {
          console.warn(`[Glide][Select] Duplicate item value registered: ${action.item.value}`);
        }
      } else {
        items = [...state.items, action.item];
      }

      return { ...state, items };
    }

    case 'UNREGISTER_ITEM': {
      const items = state.items.filter((i) => i.value !== action.value);
      const highlight = state.highlight === action.value ? null : state.highlight;
      return { ...state, items, highlight };
    }

    case 'HIGHLIGHT':
      return state.highlight === action.value ? state : { ...state, highlight: action.value };

    case 'SELECT':
      return state.value === action.value ? state : { ...state, value: action.value };

    case 'TYPEAHEAD_APPEND':
      return { ...state, typeahead: state.typeahead + action.char };

    case 'TYPEAHEAD_CLEAR':
      return state.typeahead ? { ...state, typeahead: '' } : state;

    case 'UPDATE_DISABLED_SET':
      return { ...state, disabledValues: action.values };

    default:
      return state;
  }
};

// Context
const SelectInternalContext = React.createContext<SelectInternalContextValue | null>(null);

const useSelectInternal = (): SelectInternalContextValue => {
  const ctx = React.useContext(SelectInternalContext);
  if (!ctx) {
    throw new Error('Select components must be used within <SelectRoot>.');
  }
  return ctx;
};

// Helper functions
const isPrintableKey = (event: React.KeyboardEvent): boolean => {
  const { key } = event;
  return key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
};

const findNextMatch = (
  items: SelectItemRegistration[],
  startIndex: number,
  typed: string,
  filter: (text: string, typed: string) => boolean,
  loop: boolean,
  isDisabled: (v: string) => boolean,
): SelectItemRegistration | undefined => {
  if (!typed || !items.length) return undefined;

  const len = items.length;
  let index = startIndex % len;
  let traversed = 0;

  while (traversed < len) {
    const item = items[index];
    if (item && !isDisabled(item.value) && filter(item.getText(), typed)) {
      return item;
    }
    index = (index + 1) % len;
    traversed += 1;
    if (!loop && index === 0) break;
  }

  return undefined;
};

const moveHighlight = (
  state: SelectStateSnapshot,
  direction: 1 | -1,
  loop: boolean,
  isDisabled: (v: string) => boolean,
): string | null => {
  if (!state.items.length) return null;

  const ordered = state.items;
  const currentIndex = state.highlight ? ordered.findIndex((i) => i.value === state.highlight) : -1;

  const start =
    currentIndex === -1 ? (direction === 1 ? 0 : ordered.length - 1) : currentIndex + direction;

  const len = ordered.length;
  let index = start;
  let traversed = 0;

  while (traversed < len) {
    const item = ordered[(index + len) % len];
    if (item && !isDisabled(item.value)) {
      return item.value;
    }
    index += direction;
    traversed += 1;
    if (!loop && (index < 0 || index >= len)) break;
  }

  return null;
};

// Support functions
const scheduleTypeaheadClear = (ctx: SelectInternalContextValue): void => {
  const debounce = ctx.propsRef.current?.typeaheadDebounce ?? 350;

  if (ctx.typeaheadTimeoutRef.current != null) {
    window.clearTimeout(ctx.typeaheadTimeoutRef.current);
  }

  ctx.typeaheadTimeoutRef.current = window.setTimeout(() => {
    ctx.dispatch({ type: 'TYPEAHEAD_CLEAR' });
  }, debounce);
};

const performTypeahead = (ctx: SelectInternalContextValue): void => {
  const { typeahead, items, highlight } = ctx.state;
  if (!typeahead || !items.length) return;

  const props = ctx.propsRef.current;
  if (!props) return;

  const { loop, filter } = props;
  const highlightValue = highlight;
  const startIndex = highlightValue
    ? (items.findIndex((i) => i.value === highlightValue) + 1) % items.length
    : 0;

  const match = findNextMatch(items, startIndex, typeahead, filter, loop, ctx.isItemDisabled);

  if (match) {
    ctx.dispatch({ type: 'HIGHLIGHT', value: match.value });
    if (props.selectionFollowsFocus) {
      commitSelection(ctx, match.value, false);
    }
  }
};

const commitSelection = (
  ctx: SelectInternalContextValue,
  value: string,
  close: boolean = true,
): void => {
  if (ctx.isItemDisabled(value)) return;

  const props = ctx.propsRef.current;
  if (!props) return;

  if (ctx.state.value !== value) {
    if (props.value === undefined) {
      ctx.dispatch({ type: 'SELECT', value });
    }
    props.onValueChange?.(value);
  }

  if (close) {
    if (props.open === undefined) {
      ctx.dispatch({ type: 'CLOSE' });
    }
    props.onOpenChange?.(false);
    ctx.triggerRef.current?.focus();
  }
};

/**
 * Root Select component with state management
 */
export const SelectRoot = React.forwardRef<SelectImperativeHandle, SelectRootProps>(
  (props, ref) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      required = false,
      name,
      id,
      loop = true,
      typeaheadDebounce = 350,
      autoFocus = false,
      dir = 'ltr',
      selectionFollowsFocus = false,
      positioning = { side: 'bottom', align: 'start' },
      focusStrategy = 'active-descendant',
      scrollAlignment = 'nearest',
      onHighlightChange,
      filter = defaultFilter,
      disabledValues = [],
      multi = false,
      children,
      ...rest
    } = props;

    // Development warnings
    React.useEffect(() => {
      if (typeof console !== 'undefined' && console.warn) {
        if (multi) {
          // eslint-disable-next-line no-console
          console.warn('[Glide][Select] Multi-select not yet implemented; prop ignored.');
        }
        if (focusStrategy !== 'active-descendant') {
          // eslint-disable-next-line no-console
          console.warn('[Glide][Select] Unsupported focusStrategy; using active-descendant.');
        }
      }
    }, [multi, focusStrategy]);

    const baseId = React.useMemo(() => createBaseId(id), [id]);

    // State management
    const [snapshot, dispatch] = React.useReducer(selectReducer, {
      open: openProp ?? defaultOpen,
      value: valueProp ?? defaultValue,
      highlight: null,
      items: [],
      disabledValues: new Set(disabledValues),
      typeahead: '',
    });

    // Prop refs for stable callbacks
    const propsRef = React.useRef({
      value: valueProp,
      onValueChange,
      open: openProp,
      onOpenChange,
      selectionFollowsFocus,
      loop,
      filter,
      typeaheadDebounce,
      scrollAlignment,
      onHighlightChange,
      disabledValues,
    });

    React.useLayoutEffect(() => {
      propsRef.current = {
        value: valueProp,
        onValueChange,
        open: openProp,
        onOpenChange,
        selectionFollowsFocus,
        loop,
        filter,
        typeaheadDebounce,
        scrollAlignment,
        onHighlightChange,
        disabledValues,
      };
    });

    // Effective state (controlled/uncontrolled)
    const effectiveOpen = openProp !== undefined ? openProp : snapshot.open;
    const effectiveValue = valueProp !== undefined ? valueProp : snapshot.value;

    // Track highlight changes
    const previousHighlightRef = React.useRef<string | null>(null);
    React.useEffect(() => {
      if (snapshot.highlight !== previousHighlightRef.current) {
        previousHighlightRef.current = snapshot.highlight;
        onHighlightChange?.(snapshot.highlight);
      }
    }, [snapshot.highlight, onHighlightChange]);

    // Update disabled set when prop changes
    React.useEffect(() => {
      dispatch({ type: 'UPDATE_DISABLED_SET', values: new Set(disabledValues) });
    }, [disabledValues]);

    // Timer for typeahead clearing
    const typeaheadTimeoutRef = React.useRef<number | null>(null);
    React.useEffect(
      () => () => {
        if (typeaheadTimeoutRef.current != null) {
          window.clearTimeout(typeaheadTimeoutRef.current);
        }
      },
      [],
    );

    // Refs
    const triggerRef = React.useRef<HTMLElement | null>(null);
    const contentRef = React.useRef<HTMLElement | null>(null);
    const viewportRef = React.useRef<HTMLElement | null>(null);
    const highlightRef = React.useRef<string | null>(null);
    highlightRef.current = snapshot.highlight;

    // Item registry helpers
    const registerItem = React.useCallback((item: SelectItemRegistration) => {
      dispatch({ type: 'REGISTER_ITEM', item });
    }, []);

    const unregisterItem = React.useCallback((value: string) => {
      dispatch({ type: 'UNREGISTER_ITEM', value });
    }, []);

    const isItemDisabled = React.useCallback(
      (value: string): boolean => {
        return (
          snapshot.items.some((i) => i.value === value && i.disabled) ||
          snapshot.disabledValues.has(value)
        );
      },
      [snapshot.items, snapshot.disabledValues],
    );

    const getItemData = React.useCallback(
      (value: string): SelectItemRegistration | undefined => {
        return snapshot.items.find((i) => i.value === value);
      },
      [snapshot.items],
    );

    // Imperative handle
    React.useImperativeHandle(
      ref,
      () => ({
        open: () => {
          if (!effectiveOpen) {
            if (openProp === undefined) dispatch({ type: 'OPEN' });
            onOpenChange?.(true);
          }
        },
        close: () => {
          if (effectiveOpen) {
            if (openProp === undefined) dispatch({ type: 'CLOSE' });
            onOpenChange?.(false);
          }
        },
        toggle: () => {
          const next = !effectiveOpen;
          if (openProp === undefined) dispatch({ type: 'TOGGLE' });
          onOpenChange?.(next);
        },
        focus: () => {
          triggerRef.current?.focus();
        },
        highlight: (value: string | null) => {
          if (value != null && !snapshot.items.some((i) => i.value === value)) return;
          if (snapshot.highlight === value) return;
          dispatch({ type: 'HIGHLIGHT', value });
        },
        select: (value: string) => {
          if (!snapshot.items.some((i) => i.value === value)) return;
          if (isItemDisabled(value)) return;
          if (value === effectiveValue) return;
          if (valueProp === undefined) dispatch({ type: 'SELECT', value });
          onValueChange?.(value);
        },
      }),
      [
        effectiveOpen,
        openProp,
        snapshot.items,
        snapshot.highlight,
        valueProp,
        effectiveValue,
        onOpenChange,
        onValueChange,
        isItemDisabled,
      ],
    );

    // Auto focus
    React.useEffect(() => {
      if (autoFocus) {
        triggerRef.current?.focus();
      }
    }, [autoFocus]);

    // Context value
    const contextValue = React.useMemo<SelectInternalContextValue>(
      () => ({
        state: { ...snapshot, open: effectiveOpen, value: effectiveValue },
        dispatch,
        propsRef: propsRef as RefObject<{
          value?: string;
          onValueChange?: (v: string) => void;
          open?: boolean;
          onOpenChange?: (o: boolean) => void;
          selectionFollowsFocus?: boolean;
          loop: boolean;
          filter: (optionText: string, typed: string) => boolean;
          typeaheadDebounce: number;
          scrollAlignment: ScrollIntoViewOptions['block'];
          onHighlightChange?: (v: string | null) => void;
          disabledValues: string[];
        }>,
        baseId,
        triggerRef,
        contentRef,
        viewportRef,
        highlightRef,
        typeaheadTimeoutRef,
        registerItem,
        unregisterItem,
        isItemDisabled,
        getItemData,
        positioning,
        rootDisabled: disabled,
      }),
      [
        snapshot,
        effectiveOpen,
        effectiveValue,
        baseId,
        registerItem,
        unregisterItem,
        isItemDisabled,
        getItemData,
        positioning,
        disabled,
      ],
    );

    return (
      <SelectInternalContext.Provider value={contextValue}>
        <div
          data-select-root
          data-state={effectiveOpen ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          dir={dir}
          {...rest}
        >
          {children}
          {name && (
            <input
              type='hidden'
              name={name}
              required={required}
              value={effectiveValue ?? ''}
              data-select-hidden-input
            />
          )}
        </div>
      </SelectInternalContext.Provider>
    );
  },
);

SelectRoot.displayName = 'SelectRoot';

/**
 * Select trigger button
 */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (props, forwardedRef) => {
    const {
      disabled: disabledProp,
      preventFocusOnOpen = false, // eslint-disable-line @typescript-eslint/no-unused-vars
      children,
      onKeyDown,
      onClick,
      ...rest
    } = props;

    const ctx = useSelectInternal();
    const { state, propsRef, triggerRef, baseId, dispatch } = ctx;

    // Merge refs
    const ref = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [triggerRef, forwardedRef],
    );

    const disabled = disabledProp || ctx.rootDisabled || false;

    // Active descendant for accessibility
    const activeDescendant = React.useMemo(() => {
      if (!state.open || !state.highlight) return undefined;
      const index = state.items.findIndex((i) => i.value === state.highlight);
      return index >= 0 ? `${baseId}-option-${index}` : undefined;
    }, [state.open, state.highlight, state.items, baseId]);

    const handleToggle = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled) return;

        const next = !state.open;
        if (propsRef.current?.open === undefined) {
          dispatch({ type: 'TOGGLE' });
        }
        propsRef.current?.onOpenChange?.(next);
      },
      [onClick, disabled, state.open, propsRef, dispatch],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled) return;

        const { key } = event;

        // Handle typeahead while closed
        if (!state.open && isPrintableKey(event)) {
          dispatch({ type: 'TYPEAHEAD_APPEND', char: key });
          if (propsRef.current?.open === undefined) {
            dispatch({ type: 'OPEN' });
          }
          propsRef.current?.onOpenChange?.(true);
          scheduleTypeaheadClear(ctx);
          performTypeahead(ctx);
          return;
        }

        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
          event.preventDefault();

          if (!state.open) {
            if (propsRef.current?.open === undefined) {
              dispatch({ type: 'OPEN' });
            }
            propsRef.current?.onOpenChange?.(true);

            // Highlight selection or first enabled item
            const selected = state.value ? ctx.getItemData(state.value) : undefined;
            let initialHighlight: string | null = null;

            if (selected && !ctx.isItemDisabled(selected.value)) {
              initialHighlight = selected.value;
            } else {
              const ordered = key === 'ArrowUp' ? [...state.items].reverse() : state.items;
              const firstEnabled = ordered.find((i) => !ctx.isItemDisabled(i.value));
              initialHighlight = firstEnabled ? firstEnabled.value : null;
            }

            if (initialHighlight) {
              dispatch({ type: 'HIGHLIGHT', value: initialHighlight });
            }
          } else if (key === 'Enter' || key === ' ') {
            // Commit selection & close
            if (state.highlight) {
              commitSelection(ctx, state.highlight);
            } else {
              // Just close
              if (propsRef.current?.open === undefined) {
                dispatch({ type: 'CLOSE' });
              }
              propsRef.current?.onOpenChange?.(false);
            }
          }
        }
      },
      [onKeyDown, disabled, state, propsRef, dispatch, ctx],
    );

    return (
      <button
        data-select-trigger
        data-state={state.open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        ref={ref}
        type='button'
        aria-haspopup='listbox'
        aria-expanded={state.open}
        aria-controls={`${baseId}-content`}
        aria-activedescendant={activeDescendant}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

SelectTrigger.displayName = 'SelectTrigger';

/**
 * Selected value display
 */
export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder = '', children, ...props }, ref) => {
    const { state } = useSelectInternal();
    const selectedItem = state.items.find((item) => item.value === state.value);

    // Determine what to show
    let content: React.ReactNode;
    if (children != null) {
      content = children;
    } else if (selectedItem) {
      content = selectedItem.getText();
    } else {
      content = placeholder;
    }

    const showPlaceholder = !selectedItem && !children;

    return (
      <span
        data-select-value
        data-placeholder-shown={showPlaceholder ? '' : undefined}
        ref={ref}
        {...props}
      >
        {content}
      </span>
    );
  },
);

SelectValue.displayName = 'SelectValue';

/**
 * Decorative icon
 */
export const SelectIcon = React.forwardRef<HTMLSpanElement, SelectIconProps>(
  ({ children, ...props }, ref) => {
    return (
      <span data-select-icon aria-hidden='true' ref={ref} {...props}>
        {children}
      </span>
    );
  },
);

SelectIcon.displayName = 'SelectIcon';

/**
 * Portal wrapper
 */
export const SelectPortal: React.FC<SelectPortalProps> = ({ container, children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const target = container ?? (typeof document !== 'undefined' ? document.body : null);

  if (!target || typeof createPortal !== 'function') {
    return <>{children}</>;
  }

  return createPortal(children, target);
};

SelectPortal.displayName = 'SelectPortal';

/**
 * Select content container with listbox
 */
export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (props, forwardedRef) => {
    const { inertFocusGuards = true, children, collisionPadding = 8, onKeyDown, ...rest } = props;

    const ctx = useSelectInternal();
    const { state, propsRef, contentRef, baseId, dispatch, triggerRef } = ctx;

    // Merge refs
    const ref = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [contentRef, forwardedRef],
    );

    // Close on outside click
    React.useEffect(() => {
      if (!state.open) return;

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (!contentRef.current || !triggerRef.current) return;
        if (contentRef.current.contains(target)) return;
        if (triggerRef.current.contains(target)) return;

        if (propsRef.current?.open === undefined) {
          dispatch({ type: 'CLOSE' });
        }
        propsRef.current?.onOpenChange?.(false);
      };

      window.addEventListener('mousedown', handlePointerDown, true);
      return () => window.removeEventListener('mousedown', handlePointerDown, true);
    }, [state.open, contentRef, triggerRef, propsRef, dispatch]);

    // Key handling
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;

        const { key } = event;

        if (key === 'Escape') {
          event.stopPropagation();
          if (propsRef.current?.open === undefined) {
            dispatch({ type: 'CLOSE' });
          }
          propsRef.current?.onOpenChange?.(false);
          triggerRef.current?.focus();
          return;
        }

        if (key === 'Tab') {
          if (propsRef.current?.open === undefined) {
            dispatch({ type: 'CLOSE' });
          }
          propsRef.current?.onOpenChange?.(false);
          return;
        }

        if (key === 'ArrowDown') {
          event.preventDefault();
          const next = moveHighlight(state, 1, propsRef.current?.loop ?? true, ctx.isItemDisabled);
          if (next !== null) {
            dispatch({ type: 'HIGHLIGHT', value: next });
            if (propsRef.current?.selectionFollowsFocus) {
              commitSelection(ctx, next, false);
            }
          }
          return;
        }

        if (key === 'ArrowUp') {
          event.preventDefault();
          const next = moveHighlight(state, -1, propsRef.current?.loop ?? true, ctx.isItemDisabled);
          if (next !== null) {
            dispatch({ type: 'HIGHLIGHT', value: next });
            if (propsRef.current?.selectionFollowsFocus) {
              commitSelection(ctx, next, false);
            }
          }
          return;
        }

        if (key === 'Home') {
          event.preventDefault();
          const first = state.items.find((i) => !ctx.isItemDisabled(i.value));
          if (first) {
            dispatch({ type: 'HIGHLIGHT', value: first.value });
            if (propsRef.current?.selectionFollowsFocus) {
              commitSelection(ctx, first.value, false);
            }
          }
          return;
        }

        if (key === 'End') {
          event.preventDefault();
          const last = [...state.items].reverse().find((i) => !ctx.isItemDisabled(i.value));
          if (last) {
            dispatch({ type: 'HIGHLIGHT', value: last.value });
            if (propsRef.current?.selectionFollowsFocus) {
              commitSelection(ctx, last.value, false);
            }
          }
          return;
        }

        if (isPrintableKey(event)) {
          dispatch({ type: 'TYPEAHEAD_APPEND', char: key });
          scheduleTypeaheadClear(ctx);
          performTypeahead(ctx);
          return;
        }

        if ((key === 'Enter' || key === ' ') && state.highlight) {
          event.preventDefault();
          commitSelection(ctx, state.highlight);
        }
      },
      [onKeyDown, state, propsRef, dispatch, triggerRef, ctx],
    );

    // Scroll highlighted item into view
    React.useLayoutEffect(() => {
      if (!state.open || !state.highlight) return;

      const item = ctx.getItemData(state.highlight);
      if (!item?.ref.current) return;

      const scrollOptions: ScrollIntoViewOptions = {
        block: propsRef.current?.scrollAlignment ?? 'nearest',
        inline: 'nearest',
      };

      try {
        item.ref.current.scrollIntoView(scrollOptions);
      } catch {
        // Ignore scrollIntoView errors (SSR)
      }
    }, [state.open, state.highlight, ctx, propsRef]);

    // Focus management
    const preventFocusOnOpen = rest['aria-activedescendant'] != null;

    React.useLayoutEffect(() => {
      if (state.open && !preventFocusOnOpen && contentRef.current) {
        if (document.activeElement === triggerRef.current) {
          contentRef.current.focus();
        }
      }
    }, [state.open, contentRef, triggerRef, preventFocusOnOpen]);

    // Active descendant for accessibility
    const activeDescendant = React.useMemo(() => {
      if (!state.highlight) return undefined;
      const index = state.items.findIndex((i) => i.value === state.highlight);
      return index >= 0 ? `${baseId}-option-${index}` : undefined;
    }, [state.highlight, state.items, baseId]);

    if (!state.open) return null;

    return (
      <div
        data-select-content
        data-state='open'
        data-side={ctx.positioning?.side}
        data-align={ctx.positioning?.align}
        id={`${baseId}-content`}
        ref={ref}
        onKeyDown={handleKeyDown}
        role='listbox'
        tabIndex={-1}
        aria-activedescendant={activeDescendant}
        aria-disabled={ctx.rootDisabled || undefined}
        data-collision-padding={collisionPadding}
        {...rest}
      >
        {inertFocusGuards && (
          <div
            tabIndex={-1}
            aria-hidden='true'
            style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1 }}
          />
        )}
        {children}
        {inertFocusGuards && (
          <div
            tabIndex={-1}
            aria-hidden='true'
            style={{ position: 'fixed', top: 0, left: 0, width: 1, height: 1 }}
          />
        )}
      </div>
    );
  },
);

SelectContent.displayName = 'SelectContent';

/**
 * Scrollable viewport
 */
export const SelectViewport = React.forwardRef<HTMLDivElement, SelectViewportProps>(
  ({ overscan = 2, children, ...props }, forwardedRef) => {
    const { viewportRef } = useSelectInternal();

    const ref = React.useCallback(
      (node: HTMLDivElement | null) => {
        viewportRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [viewportRef, forwardedRef],
    );

    return (
      <div data-select-viewport data-overscan={overscan} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

SelectViewport.displayName = 'SelectViewport';

/**
 * Group wrapper
 */
export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ labelId, children, ...props }, ref) => {
    const groupLabelId = React.useId();
    const effectiveLabelId = labelId ?? groupLabelId;

    return (
      <div
        data-select-group
        role='group'
        aria-labelledby={effectiveLabelId}
        data-label-id={effectiveLabelId}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SelectGroup.displayName = 'SelectGroup';

/**
 * Group label
 */
export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ children, ...props }, ref) => {
    return (
      <div data-select-label ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

SelectLabel.displayName = 'SelectLabel';

/**
 * Separator
 */
export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ children, ...props }, ref) => {
    return (
      <div data-select-separator role='presentation' ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

SelectSeparator.displayName = 'SelectSeparator';

/**
 * Select item
 */
export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  (props, forwardedRef) => {
    const { value, disabled = false, textValue, children, onClick, onPointerDown, ...rest } = props;

    const ctx = useSelectInternal();
    const { state, propsRef, dispatch, baseId } = ctx;
    const itemRef = React.useRef<HTMLDivElement | null>(null);

    // Merge refs
    const ref = React.useCallback(
      (node: HTMLDivElement | null) => {
        itemRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    // Register item
    React.useEffect(() => {
      if (!value) {
        // eslint-disable-next-line no-console
        if (typeof console !== 'undefined' && console.error) {
          console.error('[Glide][Select] SelectItem requires a value prop');
        }
        return;
      }

      const registration: SelectItemRegistration = {
        value,
        disabled,
        getText: () => textValue ?? itemRef.current?.textContent ?? '',
        ref: itemRef as RefObject<HTMLElement>,
      };

      ctx.registerItem(registration);
      return () => ctx.unregisterItem(value);
    }, [value, disabled, textValue, ctx]);

    const highlighted = state.highlight === value;
    const selected = state.value === value;
    const trulyDisabled = disabled || ctx.isItemDisabled(value);

    const handleInteraction = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
        if (event.type === 'click') {
          onClick?.(event as React.MouseEvent<HTMLDivElement>);
        } else {
          onPointerDown?.(event as React.PointerEvent<HTMLDivElement>);
        }

        if (event.defaultPrevented || trulyDisabled) return;

        event.preventDefault();

        if (highlighted && selected) {
          // Close only
          if (state.open) {
            if (propsRef.current?.open === undefined) {
              dispatch({ type: 'CLOSE' });
            }
            propsRef.current?.onOpenChange?.(false);
          }
          return;
        }

        if (selected) {
          // Selecting same item closes list
          if (propsRef.current?.open === undefined) {
            dispatch({ type: 'CLOSE' });
          }
          propsRef.current?.onOpenChange?.(false);
          return;
        }

        commitSelection(ctx, value);
      },
      [
        onClick,
        onPointerDown,
        trulyDisabled,
        highlighted,
        selected,
        state.open,
        propsRef,
        dispatch,
        ctx,
        value,
      ],
    );

    const index = state.items.findIndex((i) => i.value === value);
    const optionId = index >= 0 ? `${baseId}-option-${index}` : undefined;

    return (
      <div
        data-select-item
        data-value={value}
        data-disabled={trulyDisabled ? '' : undefined}
        data-highlighted={highlighted ? '' : undefined}
        data-selected={selected ? '' : undefined}
        ref={ref}
        onPointerDown={handleInteraction}
        onClick={handleInteraction}
        role='option'
        aria-disabled={trulyDisabled || undefined}
        aria-selected={selected || undefined}
        id={optionId}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

SelectItem.displayName = 'SelectItem';

/**
 * Item text
 */
export const SelectItemText = React.forwardRef<HTMLSpanElement, SelectItemTextProps>(
  ({ children, ...props }, ref) => {
    return (
      <span data-select-item-text ref={ref} {...props}>
        {children}
      </span>
    );
  },
);

SelectItemText.displayName = 'SelectItemText';

/**
 * Item indicator
 */
export const SelectItemIndicator = React.forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(
  ({ children, ...props }, ref) => {
    return (
      <span data-select-item-indicator aria-hidden='true' ref={ref} {...props}>
        {children}
      </span>
    );
  },
);

SelectItemIndicator.displayName = 'SelectItemIndicator';

/**
 * Scroll up button
 */
export const SelectScrollUpButton = React.forwardRef<HTMLDivElement, SelectScrollButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <div data-select-scroll-button data-direction='up' aria-hidden='true' ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

SelectScrollUpButton.displayName = 'SelectScrollUpButton';

/**
 * Scroll down button
 */
export const SelectScrollDownButton = React.forwardRef<HTMLDivElement, SelectScrollButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <div data-select-scroll-button data-direction='down' aria-hidden='true' ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

SelectScrollDownButton.displayName = 'SelectScrollDownButton';
