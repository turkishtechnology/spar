import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  type ElementType,
} from 'react';
import { useSelectContext, useSelectCollectionContext, SelectItemContext } from './hooks';
import type { SelectItemProps, SelectItemContextValue, SelectItemRenderProps } from './types';
import { useMergedRef } from '@/hooks';

// Use layout effect on the client so item registration happens before the first
// paint — otherwise a `<Select defaultValue=…>` flashes the placeholder for one
// frame before the trigger picks up the selected item's label. On the server
// `useLayoutEffect` warns; fall back to a no-op (SSR has nothing to register).
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Individual selectable option within the select dropdown. Handles selection state, focus, and accessibility.
 */
export const SelectItem = <T extends ElementType = 'div'>({
  value,
  disabled = false,
  label: providedLabel,
  ref,
  as,
  onPointerMove,
  onClick,
  children,
  ...props
}: SelectItemProps<T>) => {
  const Component = as || 'div';
  const context = useSelectContext();
  const collection = useSelectCollectionContext();
  const itemRef = useRef<HTMLDivElement>(null);

  // Resolve a text label for the trigger display and typeahead search, in order:
  //   1. explicit `label` prop
  //   2. plain-text `children` (the common case — no `label` prop required)
  //   3. the rendered node's textContent, captured at registration time below
  //   4. the previously-cached label (survives while the item is unmounted)
  // Steps 1–2 are known during render; step 3 needs the mounted DOM node, so it
  // is resolved inside the registration layout effect.
  const textLabel = providedLabel ?? (typeof children === 'string' ? children : undefined);
  const label = textLabel ?? context.items.get(value)?.label ?? '';

  // Merge external ref with internal ref
  const mergedRef = useMergedRef(itemRef, ref);

  // Register/unregister item. Runs in a layout effect so the trigger sees the
  // selected item's label on the very first paint when `defaultValue` is set.
  // Dep list intentionally tracks only the registry action (which is stable via
  // useCallback) plus this item's own identity/state — including `context` here
  // would re-fire on every items-map mutation and loop infinitely.
  const { registerItem } = context;
  useIsomorphicLayoutEffect(() => {
    // Fall back to the rendered text when children aren't plain text and no
    // `label` prop was given, so element/icon children still get a usable
    // string. `?? label` preserves any previously cached value.
    const resolvedLabel = textLabel ?? itemRef.current?.textContent?.trim() ?? label;
    registerItem(value, {
      value,
      label: resolvedLabel,
      disabled,
      ref: itemRef,
      mounted: true,
    });
    return () => {
      // Keep cache (label) but mark unmounted so navigation/typeahead ignores it
      registerItem(value, {
        value,
        label: resolvedLabel,
        disabled,
        ref: itemRef,
        mounted: false,
      });
    };

    // Note: We intentionally do NOT unregister on unmount
    // This keeps the label cached so the trigger can display it
    // even when the dropdown is closed and items are unmounted
  }, [registerItem, value, textLabel, label, disabled]);

  // Determine if this item is selected
  const isSelected = context.multiple
    ? Array.isArray(context.value) && context.value.includes(value)
    : context.value === value;

  // Determine if this item is highlighted
  const isHighlighted = collection.isItemHighlighted(value);

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current && itemRef.current.scrollIntoView) {
      itemRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [isHighlighted]);

  const handleSelect = useCallback(() => {
    // Read-only selects can be opened and inspected but not changed, so a
    // click must neither toggle the value nor close the listbox.
    if (disabled || context.disabled || context.readOnly) return;

    context.onChange(value);
    // In multiple mode (closeOnSelect false) the listbox stays open and the
    // highlight is left untouched so successive toggles keep their flow. When
    // it does close, focus returns to the trigger via SelectContent's focus
    // effect (which also honors onCloseAutoFocus).
    if (context.closeOnSelect) {
      context.onOpenChange(false);
    }
  }, [context, value, disabled]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      if (event.defaultPrevented) return;

      if (!disabled) {
        collection.highlightItem(value);
      }
    },
    [collection, value, disabled, onPointerMove],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      handleSelect();
    },
    [onClick, handleSelect],
  );

  const itemContextValue = useMemo<SelectItemContextValue>(
    () => ({
      value,
      isSelected,
      disabled,
      isHighlighted,
      label,
      onSelect: handleSelect,
    }),
    [value, isSelected, disabled, isHighlighted, label, handleSelect],
  );

  // Render props for children function
  const renderProps: SelectItemRenderProps = {
    isSelected,
    isHighlighted,
    select: handleSelect,
    disabled,
  };

  const ariaAttributes = {
    role: 'option',
    'aria-selected': isSelected,
    'aria-disabled': disabled || undefined,
  };

  const dataAttributes = {
    'data-state': isSelected ? 'checked' : 'unchecked',
    'data-disabled': disabled ? '' : undefined,
    'data-highlighted': isHighlighted ? '' : undefined,
  };

  const itemProps = {
    id: `${context.contentId}-option-${encodeURIComponent(value)}`,
    ref: mergedRef,
    ...ariaAttributes,
    ...dataAttributes,
    onPointerMove: handlePointerMove,
    onClick: handleClick,
    ...props,
  };

  return (
    <SelectItemContext.Provider value={itemContextValue}>
      <Component {...itemProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
    </SelectItemContext.Provider>
  );
};

SelectItem.displayName = 'SelectItem';
