import { useId, useMemo, type ElementType } from 'react';
import { useOptionalFieldContext } from '../Field/hooks';
import { useSwitch } from './hooks';
import { SwitchContext } from './hooks/useSwitchContext';
import type { SwitchInternalContextValue, SwitchRenderProps, SwitchRootProps } from './types';

export const SwitchRoot = <T extends ElementType = 'div'>({
  as,
  checked,
  defaultChecked,
  onChange,
  disabled,
  isInvalid,
  name,
  value = 'on',
  form,
  required,
  readOnly,
  id: providedId,
  children,
  ref,
  ...props
}: SwitchRootProps<T>) => {
  const Component = as || 'div';
  const generatedId = useId();
  const rootId = providedId ?? generatedId;
  const controlId = `${rootId}-control`;

  // Field context integration — direct props win over inherited Field values.
  const fieldCtx = useOptionalFieldContext();
  const resolvedInvalid = isInvalid ?? fieldCtx?.invalid ?? false;
  const resolvedDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const resolvedRequired = required ?? fieldCtx?.required ?? false;
  const resolvedReadOnly = readOnly ?? fieldCtx?.readOnly ?? false;

  const {
    checked: checkedState,
    isFocused,
    isHovered,
    isActive,
    setChecked,
    switchProps,
    hiddenInputProps,
  } = useSwitch({
    ...(checked !== undefined && { checked }),
    ...(defaultChecked !== undefined && { defaultChecked }),
    ...(onChange && { onChange }),
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
  });

  const contextValue = useMemo<SwitchInternalContextValue>(
    () => ({
      checked: checkedState,
      setChecked,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      required: resolvedRequired,
      isInvalid: resolvedInvalid,
      isFocused,
      isHovered,
      isPressed: isActive,
      controlId,
      switchProps,
      hiddenInputProps,
      value,
      ...(name !== undefined && { name }),
      ...(form !== undefined && { form }),
    }),
    [
      checkedState,
      setChecked,
      resolvedDisabled,
      resolvedReadOnly,
      resolvedRequired,
      resolvedInvalid,
      isFocused,
      isHovered,
      isActive,
      controlId,
      switchProps,
      hiddenInputProps,
      value,
      name,
      form,
    ],
  );

  const renderProps: SwitchRenderProps = {
    checked: checkedState,
    setChecked,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    required: resolvedRequired,
    isInvalid: resolvedInvalid,
    isFocused,
    isHovered,
    isPressed: isActive,
  };

  return (
    <SwitchContext.Provider value={contextValue}>
      <Component
        ref={ref}
        id={providedId}
        {...props}
        data-switch-root=''
        data-state={checkedState ? 'checked' : 'unchecked'}
        data-checked={checkedState ? '' : undefined}
        data-disabled={resolvedDisabled ? '' : undefined}
        data-readonly={resolvedReadOnly ? '' : undefined}
        data-required={resolvedRequired ? '' : undefined}
        data-invalid={resolvedInvalid ? '' : undefined}
        data-focus={isFocused ? '' : undefined}
        data-hover={isHovered ? '' : undefined}
        data-active={isActive ? '' : undefined}
      >
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
    </SwitchContext.Provider>
  );
};

SwitchRoot.displayName = 'SwitchRoot';
