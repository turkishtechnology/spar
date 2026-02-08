import { type ElementType } from 'react';
import type { InputLabelProps } from './types';
import { useInputContext } from './hooks';

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
  const Component = as || 'label';
  const context = useInputContext();

  return (
    <Component
      {...props}
      ref={ref}
      id={context.labelId}
      htmlFor={context.fieldId}
      data-spar-input-label
    >
      {children}
    </Component>
  );
};

InputLabel.displayName = 'InputLabel';
