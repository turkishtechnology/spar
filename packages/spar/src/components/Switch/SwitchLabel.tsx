import { useEffect, useId, type ElementType, type MouseEvent } from 'react';
import { useSwitchContext } from './hooks';
import type { SwitchLabelProps } from './types';

export const SwitchLabel = <T extends ElementType = 'span'>({
  as,
  id,
  children,
  onClick,
  style,
  ref,
  ...props
}: SwitchLabelProps<T>) => {
  const Component = as || 'span';
  const generatedId = useId();
  const labelId = id ?? `${generatedId}-label`;
  const { checked, setChecked, disabled, readOnly, required, registerLabel } = useSwitchContext();
  const interactive = !disabled && !readOnly;

  useEffect(() => registerLabel(labelId), [labelId, registerLabel]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as MouseEvent<HTMLSpanElement>);
    if (!event.defaultPrevented) {
      setChecked(!checked);
    }
  };

  return (
    <Component
      ref={ref}
      id={labelId}
      {...props}
      style={interactive ? { cursor: 'pointer', ...style } : style}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-required={required ? '' : undefined}
      onClick={handleClick}
    >
      {children}
    </Component>
  );
};

SwitchLabel.displayName = 'SwitchLabel';
