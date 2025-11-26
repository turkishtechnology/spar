import { useMemo } from 'react';
import type { LabelProps } from './types';

/**
 * A headless, accessible label component for form controls that establishes programmatic relationships and improves usability.
 */
export const Label = ({
  as: Element = 'label',
  isRequired = false,
  isOptional = false,
  isDisabled = false,
  children,
  ...htmlProps
}: LabelProps) => {
  // Memoize data attributes to prevent object recreation
  const dataAttributes = useMemo(
    () => ({
      'data-required': isRequired || undefined,
      'data-optional': isOptional || undefined,
      'data-disabled': isDisabled || undefined,
    }),
    [isRequired, isOptional, isDisabled],
  );

  return (
    <Element {...htmlProps} {...dataAttributes}>
      {children}
    </Element>
  );
};

Label.displayName = 'Label';
