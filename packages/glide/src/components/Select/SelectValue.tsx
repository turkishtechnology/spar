import type { SelectValueProps } from './types';
import { useSelectContext } from './SelectRoot';

/**
 * Displays the selected value or placeholder text. Automatically updates when selection changes.
 */
export const SelectValue = ({
  placeholder,
  as: Component = 'span',
  children,
  ...props
}: SelectValueProps) => {
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
