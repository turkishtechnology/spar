import { useMemo } from 'react';
import type { LabelProps } from './types';

/**
 * A headless, accessible label component for form controls that establishes programmatic relationships and improves usability.
 */
export const Label = ({
  as: Element = 'label',
  htmlFor,
  isRequired = false,
  isOptional = false,
  isDisabled = false,
  children,
  className,
  style,
  ref,
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
    <Element
      ref={ref}
      htmlFor={htmlFor}
      className={className}
      style={style}
      {...dataAttributes}
      {...htmlProps}
    >
      {children}
    </Element>
  );
};

Label.displayName = 'Label';
