import type { SelectItemIndicatorProps } from './types';
import { useSelectItemContext } from './SelectItem';

/**
 * Visual indicator for the selected state of an item. Only renders when item is selected unless forceMount is true.
 */
export const SelectItemIndicator = ({
  forceMount = false,
  as: Component = 'span',
  children,
  style,
  ...props
}: SelectItemIndicatorProps) => {
  const itemContext = useSelectItemContext();

  // Only render when item is selected (or forceMount is true)
  const shouldShow = forceMount || itemContext.isSelected;

  return (
    <Component
      aria-hidden='true'
      data-state={itemContext.isSelected ? 'checked' : 'unchecked'}
      style={{
        ...style,
        display: shouldShow ? undefined : 'none',
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

SelectItemIndicator.displayName = 'SelectItemIndicator';
