import { type ElementType } from 'react';
import type { SelectLabelProps } from './types';
import { useSelectGroupContext } from './hooks';
import { Label } from '../Label/Label';

/**
 * Label for a group of select items. Provides accessible context for grouped options.
 */
export const SelectLabel = <T extends ElementType = 'label'>({
  as,
  children,
  ...props
}: SelectLabelProps<T>) => {
  const groupContext = useSelectGroupContext();

  return (
    <Label as={as || 'label'} id={groupContext.labelId} {...props}>
      {children}
    </Label>
  );
};

SelectLabel.displayName = 'SelectLabel';
