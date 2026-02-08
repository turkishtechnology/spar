import { type ElementType } from 'react';
import { useSelectContext } from './hooks';
import type { SelectValueProps } from './types';

/**
 * Displays the selected value or placeholder text. Automatically updates when selection changes.
 */
export const SelectValue = <T extends ElementType = 'span'>({
  placeholder,
  as,
  children,
  ...props
}: SelectValueProps<T>) => {
  const Component = as || 'span';
  const context = useSelectContext();

  // Get the selected item's text
  const selectedItem = context.value ? context.items.get(context.value) : undefined;
  // Use textValue if available and not empty, otherwise fall back to placeholder
  const displayValue = selectedItem?.textValue ? selectedItem.textValue : placeholder;

  return (
    <Component ref={context.valueNodeRef} id={context.valueId} {...props}>
      {children || displayValue}
    </Component>
  );
};

SelectValue.displayName = 'SelectValue';
