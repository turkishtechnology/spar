import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { SelectItemProps, SelectItemContextValue } from './types';
import { useSelectContext } from './SelectRoot';

const SelectItemContext = createContext<SelectItemContextValue | null>(null);

export const useSelectItemContext = () => {
  const context = useContext(SelectItemContext);
  if (!context) {
    throw new Error('SelectItem components must be used within a SelectItem');
  }
  return context;
};

/**
 * Individual selectable option within the select dropdown. Handles selection state, focus, and accessibility.
 */
export const SelectItem = ({
  value,
  isDisabled = false,
  textValue: providedTextValue,
  ref,
  as: Component = 'div',
  onPointerMove,
  onClick,
  children,
  ...props
}: SelectItemProps) => {
  const context = useSelectContext();
  const itemRef = useRef<HTMLDivElement>(null);
  const [textValue, setTextValue] = useState(providedTextValue || '');

  // Merge external ref with internal ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(itemRef.current);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = itemRef.current;
      }
    }
  }, [ref]);

  // Register/unregister item
  useEffect(() => {
    context.registerItem(value, {
      value,
      textValue,
      disabled: isDisabled,
      ref: itemRef,
    });

    return () => {
      context.unregisterItem(value);
    };
  }, [context, value, textValue, isDisabled]);

  // Determine if this item is selected
  const isSelected = context.value === value;

  // Determine if this item is highlighted
  const items = Array.from(context.items.values()).filter((item) => !item.disabled);
  const itemIndex = items.findIndex((item) => item.value === value);
  const isHighlighted = context.highlightedIndex === itemIndex;

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isHighlighted]);

  const handleSelect = useCallback(() => {
    if (isDisabled || context.disabled) return;

    context.onValueChange(value);
    context.onOpenChange(false);
    context.triggerRef.current?.focus();
  }, [context, value, isDisabled]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      if (event.defaultPrevented) return;

      if (!isDisabled && itemIndex !== -1) {
        context.setHighlightedIndex(itemIndex);
      }
    },
    [context, itemIndex, isDisabled, onPointerMove],
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
      isDisabled,
      isHighlighted,
      textValue,
      onSelect: handleSelect,
      registerItemText,
    }),
    [value, isSelected, isDisabled, isHighlighted, textValue, handleSelect, registerItemText],
  );

  return (
    <SelectItemContext.Provider value={itemContextValue}>
      <Component
        ref={itemRef}
        role='option'
        aria-selected={isSelected}
        aria-disabled={isDisabled || undefined}
        data-state={isSelected ? 'checked' : 'unchecked'}
        data-disabled={isDisabled ? '' : undefined}
        data-highlighted={isHighlighted ? '' : undefined}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Component>
    </SelectItemContext.Provider>
  );
};

SelectItem.displayName = 'SelectItem';
