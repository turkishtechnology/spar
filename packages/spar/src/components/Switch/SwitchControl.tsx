import type { ElementType, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { useOptionalFieldContext } from '../Field/hooks';
import { useSwitchInternalContext } from './hooks/useSwitchContext';
import type { SwitchControlProps } from './types';

export const SwitchControl = <T extends ElementType = 'button'>({
  as,
  id,
  type = 'button',
  children,
  onClick,
  onKeyDown,
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ref,
  ...props
}: SwitchControlProps<T>) => {
  const Component = as || 'button';
  const isNativeButton = Component === 'button';
  const {
    checked,
    disabled,
    readOnly,
    required,
    isInvalid,
    controlId,
    name,
    value,
    form,
    switchProps,
    hiddenInputProps,
  } = useSwitchInternalContext();

  const fieldCtx = useOptionalFieldContext();
  const resolvedId = id ?? fieldCtx?.fieldId ?? controlId;
  const resolvedLabelledBy = ariaLabelledBy ?? fieldCtx?.labelId;
  const resolvedDescribedBy =
    ariaDescribedBy ?? (isInvalid ? fieldCtx?.errorId : fieldCtx?.descriptionId);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    switchProps.onClick(event as MouseEvent);
    onClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    switchProps.onKeyDown(event as KeyboardEvent);
    onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    switchProps.onFocus(event as FocusEvent);
    onFocus?.(event as FocusEvent<HTMLButtonElement>);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    switchProps.onBlur(event as FocusEvent);
    onBlur?.(event as FocusEvent<HTMLButtonElement>);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    switchProps.onPointerEnter(event as PointerEvent);
    onPointerEnter?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    switchProps.onPointerLeave(event as PointerEvent);
    onPointerLeave?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    switchProps.onPointerDown(event as PointerEvent);
    onPointerDown?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    switchProps.onPointerUp(event as PointerEvent);
    onPointerUp?.(event as PointerEvent<HTMLButtonElement>);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLElement>) => {
    switchProps.onPointerCancel(event as PointerEvent);
    onPointerCancel?.(event as PointerEvent<HTMLButtonElement>);
  };

  const elementProps: Record<string, unknown> = {
    ref,
    id: resolvedId,
    ...props,
    role: 'switch',
    'aria-checked': checked,
    'aria-label': ariaLabel,
    'aria-labelledby': resolvedLabelledBy,
    'aria-describedby': resolvedDescribedBy,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': isInvalid || undefined,
    'data-switch': '',
    'data-state': checked ? 'checked' : 'unchecked',
    'data-checked': checked ? '' : undefined,
    'data-disabled': disabled ? '' : undefined,
    'data-readonly': readOnly ? '' : undefined,
    'data-required': required ? '' : undefined,
    'data-invalid': isInvalid ? '' : undefined,
    'data-focus': switchProps['data-focus'],
    'data-hover': switchProps['data-hover'],
    'data-active': switchProps['data-active'],
    tabIndex: switchProps.tabIndex,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  };

  if (isNativeButton) {
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type = type;
    (elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled = disabled;
  } else if (disabled) {
    elementProps['aria-disabled'] = true;
  }

  return (
    <>
      <Component {...elementProps}>{children}</Component>
      {name && (
        <input
          {...hiddenInputProps}
          name={name}
          value={value}
          form={form}
          required={required}
          disabled={disabled}
        />
      )}
    </>
  );
};

SwitchControl.displayName = 'SwitchControl';
