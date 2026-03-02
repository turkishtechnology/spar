import { useMemo, ElementType } from 'react';
import type { LabelProps } from './types';

/**
 * A headless, accessible label component for form controls that establishes programmatic relationships and improves usability.
 */
export const Label = <T extends ElementType = 'label'>({
  as,
  required = false,
  isOptional = false,
  disabled = false,
  readOnly = false,
  isInvalid = false,
  children,
  ref,
  ...htmlProps
}: LabelProps<T>) => {
  const Component = as || 'label';
  // Memoize data attributes to prevent object recreation
  const dataAttributes = useMemo(
    () => ({
      'data-required': required ? '' : undefined,
      'data-optional': isOptional ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-invalid': isInvalid ? '' : undefined,
    }),
    [required, isOptional, disabled, readOnly, isInvalid],
  );

  return (
    <Component ref={ref} {...htmlProps} {...dataAttributes}>
      {children}
    </Component>
  );
};

Label.displayName = 'Label';
