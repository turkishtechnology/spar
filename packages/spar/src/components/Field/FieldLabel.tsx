import { type ElementType } from 'react';
import { useFieldContext } from './hooks';
import { Label } from '../Label/Label';
import type { FieldLabelProps } from './types';

/**
 * Accessible label for a field. Automatically wired to the field's control
 * via `htmlFor` using the coordinated ID from Field context.
 */
export const FieldLabel = <T extends ElementType = 'label'>({
  as,
  children,
  ref,
  ...props
}: FieldLabelProps<T>) => {
  const context = useFieldContext();

  return (
    <Label
      as={as || 'label'}
      {...props}
      ref={ref}
      id={context.labelId}
      htmlFor={context.fieldId}
      disabled={context.disabled}
      required={context.required}
      optional={context.optional}
      readOnly={context.readOnly}
      invalid={context.invalid}
    >
      {children}
    </Label>
  );
};

FieldLabel.displayName = 'FieldLabel';
