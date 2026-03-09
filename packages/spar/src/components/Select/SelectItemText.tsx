import { useEffect, useRef, type ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { SelectItemTextProps } from './types';
import { useSelectItemContext } from './hooks';

/**
 * Text content of a select item. Automatically registers text value for type-ahead search.
 */
export const SelectItemText = <T extends ElementType = 'span'>({
  as,
  ref,
  children,
  ...props
}: SelectItemTextProps<T>) => {
  const Component = as || 'span';
  const itemContext = useSelectItemContext();
  const textRef = useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(textRef, ref);

  // Register text value for type-ahead
  useEffect(() => {
    if (textRef.current) {
      const text = textRef.current.textContent || '';
      itemContext.registerItemText(text);
    }
  }, [children, itemContext]);

  return (
    <Component ref={mergedRef} {...props}>
      {children}
    </Component>
  );
};

SelectItemText.displayName = 'SelectItemText';
