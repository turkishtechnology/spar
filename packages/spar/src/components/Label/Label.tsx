import { useMemo } from 'react';
import type { LabelProps } from './types';

/**
 * A headless, accessible label component for form controls that establishes programmatic relationships and improves usability.
 */
export const Label = ({
  as: Element = 'label',
  required = false,
  isOptional = false,
  disabled = false,
  children,
  ...htmlProps
}: LabelProps) => {
  // Memoize data attributes to prevent object recreation
  const dataAttributes = useMemo(
    () => ({
      'data-required': required || undefined,
      'data-optional': isOptional || undefined,
      'data-disabled': disabled || undefined,
    }),
    [required, isOptional, disabled],
  );

  return (
    <Element {...htmlProps} {...dataAttributes}>
      {children}
    </Element>
  );
};

Label.displayName = 'Label';
