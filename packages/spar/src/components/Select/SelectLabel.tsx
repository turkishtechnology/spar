import { type ElementType } from 'react';
import type { SelectLabelProps } from './types';
import { useSelectGroupContext } from './SelectGroup';

/**
 * Label for a group of select items. Provides accessible context for grouped options.
 */
export const SelectLabel = <T extends ElementType = 'div'>({
  as,
  children,
  ...props
}: SelectLabelProps<T>) => {
  const Component = as || 'div';
  const groupContext = useSelectGroupContext();

  return (
    <Component id={groupContext.labelId} {...props}>
      {children}
    </Component>
  );
};

SelectLabel.displayName = 'SelectLabel';
