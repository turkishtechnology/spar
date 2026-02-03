import { useEffect, useRef, type ElementType } from 'react';
import type { SelectItemTextProps } from './types';
import { useSelectItemContext } from './SelectItem';

/**
 * Text content of a select item. Automatically registers text value for type-ahead search.
 */
export const SelectItemText = <T extends ElementType = 'span'>({
  as,
  children,
  ...props
}: SelectItemTextProps<T>) => {
  const Component = as || 'span';
  const itemContext = useSelectItemContext();
  const textRef = useRef<HTMLSpanElement>(null);

  // Register text value for type-ahead
  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current.textContent || '';
      itemContext.registerItemText(text);
    }
  }, [children, itemContext]);

  return (
    <Component ref={textRef} {...props}>
      {children}
    </Component>
  );
};

SelectItemText.displayName = 'SelectItemText';
