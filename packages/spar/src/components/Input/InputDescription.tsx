import { type ElementType } from 'react';
import type { InputDescriptionProps } from './types';
import { useInputContext } from './hooks';

/**
 * Input description component that provides helper text for the input field.
 * Automatically linked to the input field via aria-describedby.
 */
export const InputDescription = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: InputDescriptionProps<T>) => {
  const Component = as || 'div';
  const context = useInputContext();

  return (
    <Component {...props} ref={ref} id={context.descriptionId}>
      {children}
    </Component>
  );
};

InputDescription.displayName = 'InputDescription';
