import { type ElementType } from 'react';
import type { InputLabelProps } from './types';
import { useInputContext } from './hooks';
import { Label } from '../Label/Label';

/**
 * Input label component that provides accessible labeling for the input field.
 * Automatically associates with the input field via ARIA.
 */
export const InputLabel = <T extends ElementType = 'label'>({
  as,
  children,
  ref,
  ...props
}: InputLabelProps<T>) => {
  const context = useInputContext();

  return (
    <Label as={as || 'label'} {...props} ref={ref} id={context.labelId} htmlFor={context.fieldId}>
      {children}
    </Label>
  );
};

InputLabel.displayName = 'InputLabel';
