import React, { useEffect, useMemo, useCallback, useRef, useState, type ElementType } from 'react';
import { useSelectContext, useSelectCollectionContext, SelectItemContext } from './hooks';
import type { SelectItemProps, SelectItemContextValue, SelectItemRenderProps } from './types';
import { useMergedRef } from '@/hooks';

/**
 * Individual selectable option within the select dropdown. Handles selection state, focus, and accessibility.
 */
export const SelectItem = <T extends ElementType = 'div'>({
  value,
  disabled = false,
  textValue: providedTextValue,
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
  const [textValue, setTextValue] = useState(providedTextValue || '');

  // Merge external ref with internal ref
  const mergedRef = useMergedRef(itemRef, ref);

  // Register/unregister item
  useEffect(() => {
    context.registerItem(value, {
      value,
      textValue,
      disabled,
      ref: itemRef,
    });

    // Note: We intentionally do NOT unregister on unmount
    // This keeps the textValue cached so SelectValue can display it
    // even when the dropdown is closed and items are unmounted
  }, [context, value, textValue, disabled]);

  // Determine if this item is selected
  const isSelected = context.value === value;

  // Determine if this item is highlighted
  const isHighlighted = collection.isItemHighlighted(value);

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current && itemRef.current.scrollIntoView) {
      itemRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [isHighlighted]);

  const handleSelect = useCallback(() => {
    if (disabled || context.disabled) return;

    context.onValueChange(value);
    context.onOpenChange(false);
    context.triggerRef.current?.focus();
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

  const registerItemText = useCallback((text: string) => {
    setTextValue(text);
  }, []);

  const itemContextValue = useMemo<SelectItemContextValue>(
    () => ({
      value,
      isSelected,
      disabled,
      isHighlighted,
      textValue,
      onSelect: handleSelect,
      registerItemText,
    }),
    [value, isSelected, disabled, isHighlighted, textValue, handleSelect, registerItemText],
  );

  // Render props for children function
  const renderProps: SelectItemRenderProps = {
    isSelected,
    isHighlighted,
    select: handleSelect,
    disabled,
  };

  return (
    <SelectItemContext.Provider value={itemContextValue}>
      <Component
        ref={mergedRef}
        role='option'
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-state={isSelected ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        data-highlighted={isHighlighted ? '' : undefined}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        {...props}
      >
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
    </SelectItemContext.Provider>
  );
};

SelectItem.displayName = 'SelectItem';
