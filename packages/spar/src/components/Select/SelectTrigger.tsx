import { useCallback, ElementType } from 'react';
import { useSelectContext } from './hooks';
import type { SelectTriggerProps, SelectTriggerRenderProps } from './types';
import { useMergedRef } from '@/hooks';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Trigger button that toggles the select dropdown. Handles keyboard navigation and accessibility attributes.
 */
export const SelectTrigger = <T extends ElementType = 'button'>({
  ref,
  as,
  onClick,
  onKeyDown,
  children,
  ...props
}: SelectTriggerProps<T>) => {
  const context = useSelectContext();
  const mergedRef = useMergedRef(context.triggerRef, ref);

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

  const buttonProps = {
    ...(as && { as }),
    ref: mergedRef,
    disabled: context.disabled,
    autoFocus: context.autoFocus,
    role: 'combobox' as const,
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': context.open,
    'aria-controls': context.open ? context.contentId : undefined,
    'aria-labelledby': context.valueId,
    'aria-required': context.required || undefined,
    'data-state': context.open ? 'open' : 'closed',
    'data-required': context.required ? '' : undefined,
    'data-placeholder': !context.value ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...props,
  } as ButtonProps<T>;

  return (
    <Button {...buttonProps}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Button>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
