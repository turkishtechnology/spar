import React from 'react';
import type { SelectLabelProps } from './types';
import { useSelectGroupContext } from './SelectGroup';

/**
 * Label for a group of select items. Provides accessible context for grouped options.
 */
export const SelectLabel = ({ as: Component = 'div', children, ...props }: SelectLabelProps) => {
  const groupContext = useSelectGroupContext();

  return (
    <Component id={groupContext.labelId} {...props}>
      {children}
    </Component>
  );
};

SelectLabel.displayName = 'SelectLabel';
