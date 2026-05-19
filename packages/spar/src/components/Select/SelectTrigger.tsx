import { useCallback, ElementType } from 'react';
import { useSelectContext } from './hooks';
import type { SelectTriggerProps, SelectTriggerRenderProps } from './types';
import { useMergedRef } from '@/hooks';
import { Button } from '../Button';
import type { ButtonProps } from '../Button/types';

/**
 * Trigger button that toggles the select dropdown. Handles keyboard navigation and accessibility attributes.
 *
 * When no `children` are provided, the trigger displays the selected item's `textValue` or the `placeholder`.
 * When a render function is provided, it receives `SelectTriggerRenderProps` including `textValue`.
 */
export const SelectTrigger = <T extends ElementType = 'button'>({
  ref,
  as,
  disabled: disabledProp,
  placeholder,
  onClick,
  onKeyDown,
  children,
  ...props
}: SelectTriggerProps<T>) => {
  const context = useSelectContext();
  const mergedRef = useMergedRef(context.triggerRef, ref);

  // Use prop if explicitly provided, otherwise use context
  const disabled = disabledProp ?? context.disabled;

  // Compute the display text from the selected item's registered textValue
  const selectedItem = context.value ? context.items.get(context.value) : undefined;
  const textValue = selectedItem?.textValue;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const willOpen = !context.open;
      if (willOpen) {
        // Signal content to highlight the selected item (or first if none selected)
        context.setFocusStrategy(context.value ? 'selected' : 'first');
      }
      context.onOpenChange(willOpen);
      onClick?.(event);
    },
    [disabled, context, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const { key } = event;

      // Open on ArrowDown, ArrowUp (Enter/Space handled by Button)
      if (['ArrowDown', 'ArrowUp'].includes(key)) {
        event.preventDefault();
        if (!context.open) {
          context.onOpenChange(true);

          // Signal content to highlight the selected item (or first if none selected)
          context.setFocusStrategy(context.value ? 'selected' : 'first');
        }
      }
    },
    [onKeyDown, disabled, context],
  );

  // Render props for children function
  const renderProps: SelectTriggerRenderProps = {
    isOpen: context.open,
    value: context.value,
    textValue,
    disabled,
    open: () => context.onOpenChange(true),
    close: () => context.onOpenChange(false),
    toggle: () => context.onOpenChange(!context.open),
  };

  // Build aria-labelledby: use field label when inside a Field, otherwise
  // the trigger's own text content serves as the accessible name via aria-label.
  const labelledBy = context.hasField ? context.labelId : undefined;

  // Only point to description/error when a Field is in scope — otherwise
  // those IDs are synthetic and resolve to no DOM node.
  const describedBy = context.hasField
    ? context.invalid
      ? context.errorId
      : context.descriptionId
    : undefined;

  const buttonProps = {
    ...(as && { as }),
    ref: mergedRef,
    id: context.triggerId,
    disabled,
    autoFocus: context.autoFocus,
    role: 'combobox' as const,
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': context.open,
    'aria-controls': context.contentId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    'aria-required': context.required || undefined,
    'aria-invalid': context.invalid || undefined,
    'aria-readonly': context.readOnly || undefined,
    'data-state': context.open ? 'open' : 'closed',
    'data-invalid': context.invalid ? '' : undefined,
    'data-required': context.required ? '' : undefined,
    'data-readonly': context.readOnly ? '' : undefined,
    'data-placeholder': !context.value ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...props,
  } as ButtonProps<T>;

  // Determine content to render
  let content;
  if (typeof children === 'function') {
    content = children(renderProps);
  } else if (children != null) {
    content = children;
  } else {
    // Default: show textValue or placeholder
    content = textValue || placeholder;
  }

  return <Button {...buttonProps}>{content}</Button>;
};

SelectTrigger.displayName = 'SelectTrigger';
