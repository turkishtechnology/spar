import { type ElementType } from 'react';
import { useFieldContext } from './hooks';
import type { FieldDescriptionProps } from './types';

/**
 * Helper/hint text for a field. Automatically linked to the field's control
 * via `aria-describedby` using the coordinated ID from Field context.
 */
export const FieldDescription = <T extends ElementType = 'div'>({
  as,
  children,
  ref,
  ...props
}: FieldDescriptionProps<T>) => {
  const Component = as || 'div';
  const context = useFieldContext();

  const dataAttributes = {
    'data-disabled': context.disabled ? '' : undefined,
    'data-readonly': context.readOnly ? '' : undefined,
  };

  return (
    <Component {...props} ref={ref} id={context.descriptionId} {...dataAttributes}>
      {children}
    </Component>
  );
};

FieldDescription.displayName = 'FieldDescription';
