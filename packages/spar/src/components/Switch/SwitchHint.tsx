import { useEffect, useId, type ElementType } from 'react';
import { useSwitchContext } from './hooks';
import type { SwitchHintProps } from './types';

export const SwitchHint = <T extends ElementType = 'span'>({
  as,
  id,
  children,
  ref,
  ...props
}: SwitchHintProps<T>) => {
  const Component = as || 'span';
  const generatedId = useId();
  const hintId = id ?? `${generatedId}-hint`;
  const { disabled, readOnly, required, registerHint } = useSwitchContext();

  useEffect(() => registerHint(hintId), [hintId, registerHint]);

  return (
    <Component
      ref={ref}
      id={hintId}
      {...props}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-required={required ? '' : undefined}
    >
      {children}
    </Component>
  );
};

SwitchHint.displayName = 'SwitchHint';
