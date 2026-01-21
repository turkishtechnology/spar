import React, { useCallback } from 'react';
import { PrimitiveButton } from '../Primitives/PrimitiveButton';
import type { SelectTriggerProps, SelectTriggerRenderProps } from './types';
import { useSelectContext } from './SelectRoot';
import { useMergedRef } from '../../hooks';

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

  // Merge context triggerRef with user's ref
  const mergedRef = useMergedRef(context.triggerRef, ref);

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
    <PrimitiveButton
      as={as}
      type='button'
      disabled={context.disabled}
      shouldAutoFocus={context.shouldAutoFocus}
      ref={mergedRef}
      role='combobox'
      aria-haspopup='listbox'
      aria-expanded={context.open}
      aria-controls={context.open ? context.contentId : undefined}
      aria-labelledby={context.valueId}
      aria-required={context.required || undefined}
      data-state={context.open ? 'open' : 'closed'}
      data-required={context.required ? '' : undefined}
      data-placeholder={context.value ? undefined : ''}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </PrimitiveButton>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
