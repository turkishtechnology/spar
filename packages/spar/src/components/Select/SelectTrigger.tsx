import { useCallback, useEffect, useRef } from 'react';
import { useSelectContext } from './hooks';
import type { SelectTriggerProps, SelectTriggerRenderProps } from './types';
import { useMergedRef } from '@/hooks';
import { Button } from '../Button';

/**
 * Trigger button that toggles the select dropdown. Handles keyboard navigation and accessibility attributes.
 */
export const SelectTrigger = ({
  ref,
  as = 'button',
  onClick,
  onKeyDown,
  children,
  ...props
}: SelectTriggerProps) => {
  const context = useSelectContext();
  const internalRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);

  // Merge external ref with internal ref
  useEffect(() => {
    if (context.triggerRef) {
      if (typeof context.triggerRef === 'object' && context.triggerRef !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (context.triggerRef as any).current = internalRef.current;
      }
    }
  }, [context.triggerRef, internalRef]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (context.disabled) return;

      context.onOpenChange(!context.open);
      onClick?.(event);
    },
    [context, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (context.disabled) return;

      const { key } = event;

      // Open on ArrowDown, ArrowUp (Enter/Space handled by Button)
      if (['ArrowDown', 'ArrowUp'].includes(key)) {
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

      onKeyDown?.(event);
    },
    [context, onKeyDown],
  );

  // Render props for children function
  const renderProps: SelectTriggerRenderProps = {
    isOpen: context.open,
    value: context.value,
    disabled: context.disabled,
    open: () => context.onOpenChange(true),
    close: () => context.onOpenChange(false),
    toggle: () => context.onOpenChange(!context.open),
  };

  return (
    <Button
      as={as}
      ref={mergedRef}
      disabled={context.disabled}
      autoFocus={context.autoFocus}
      role='combobox'
      aria-haspopup='listbox'
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      aria-labelledby={context.valueId}
      aria-required={context.required || undefined}
      data-state={context.open ? 'open' : 'closed'}
      data-required={context.required ? '' : undefined}
      data-placeholder={!context.value ? '' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
