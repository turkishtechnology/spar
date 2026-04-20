import { ElementType } from 'react';
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
  onClick,
  ...htmlProps
}: LabelProps<T>) => {
  const Component = as || 'label';
  const userOnClick = onClick as React.MouseEventHandler<Element> | undefined;

  const handleClick: React.MouseEventHandler<Element> = (event) => {
    userOnClick?.(event);
    if (event.defaultPrevented) return;

    const htmlFor = 'htmlFor' in htmlProps ? htmlProps.htmlFor : undefined;
    if (!htmlFor) return;

    const associatedElement = event.currentTarget.ownerDocument.getElementById(htmlFor);
    if (!associatedElement) return;

    // If the click originated from within the associated element itself
    // (e.g. wrap pattern: <Label><Checkbox /></Label>), skip — already handled.
    if (associatedElement.contains(event.target as Node)) return;

    // When rendering as a native <label>, the browser already handles
    // focus and click delegation for native form elements. Only intervene
    // for custom form controls (non-native interactive elements).
    if (
      event.currentTarget instanceof HTMLLabelElement &&
      event.currentTarget.control === associatedElement
    ) {
      return;
    }

    const isDisabled = associatedElement.matches(':disabled, [aria-disabled="true"]');
    if (isDisabled) return;

    associatedElement.focus();
    associatedElement.click();
  };

  const dataAttributes = {
    'data-required': required ? '' : undefined,
    'data-optional': isOptional ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
    'data-invalid': isInvalid ? '' : undefined,
  };

  return (
    <Component ref={ref} {...htmlProps} {...dataAttributes} onClick={handleClick}>
      {children}
    </Component>
  );
};

Label.displayName = 'Label';
