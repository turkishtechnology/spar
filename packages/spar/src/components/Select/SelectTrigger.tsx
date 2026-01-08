import React, { useCallback, useEffect } from 'react';
import type { SelectTriggerProps } from './types';
import { useSelectContext } from './SelectRoot';

/**
 * Trigger button that toggles the select dropdown. Handles keyboard navigation and accessibility attributes.
 */
export const SelectTrigger = ({
  ref,
  as: Component = 'button',
  onClick,
  onKeyDown,
  children,
  ...props
}: SelectTriggerProps) => {
  const context = useSelectContext();

  // Merge external ref with internal ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(context.triggerRef.current);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = context.triggerRef.current;
      }
    }
  }, [ref, context.triggerRef]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (context.disabled) return;

      onClick?.(event);
      if (event.defaultPrevented) return;

      context.onOpenChange(!context.open);
    },
    [context, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (context.disabled) return;

      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const { key } = event;

      // Open on Space, Enter, ArrowDown, ArrowUp
      if ([' ', 'Enter', 'ArrowDown', 'ArrowUp'].includes(key)) {
        event.preventDefault();
        if (!context.open) {
          context.onOpenChange(true);

          // Set initial highlighted index to selected item or first item
          const selectedIndex = Array.from(context.items.values()).findIndex(
            (item) => item.value === context.value,
          );
          context.setHighlightedIndex(selectedIndex !== -1 ? selectedIndex : 0);
        }
      }
    },
    [context, onKeyDown],
  );

  return (
    <Component
      ref={context.triggerRef}
      type={Component === 'button' ? 'button' : undefined}
      role='combobox'
      aria-haspopup='listbox'
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      aria-labelledby={context.valueId}
      aria-disabled={Component !== 'button' ? context.disabled || undefined : undefined}
      aria-required={context.required || undefined}
      {...(Component === 'button' ? { disabled: context.disabled } : {})}
      data-state={context.open ? 'open' : 'closed'}
      data-disabled={context.disabled ? '' : undefined}
      data-required={context.required ? '' : undefined}
      data-placeholder={!context.value ? '' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Component>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
