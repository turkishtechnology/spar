import type { ElementType } from 'react';
import { useSwitchContext } from './hooks';
import type { SwitchThumbProps } from './types';

export const SwitchThumb = <T extends ElementType = 'span'>({
  as,
  children,
  ref,
  ...props
}: SwitchThumbProps<T>) => {
  const Component = as || 'span';
  const { checked, disabled, readOnly, required, isFocused, isHovered, isPressed } =
    useSwitchContext();

  return (
    <Component
      ref={ref}
      {...props}
      aria-hidden='true'
      data-state={checked ? 'checked' : 'unchecked'}
      data-checked={checked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-required={required ? '' : undefined}
      data-focus={isFocused ? '' : undefined}
      data-hover={isHovered ? '' : undefined}
      data-active={isPressed ? '' : undefined}
    >
      {children}
    </Component>
  );
};

SwitchThumb.displayName = 'SwitchThumb';
