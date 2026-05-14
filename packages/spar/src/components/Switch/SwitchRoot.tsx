import { useCallback, useId, useMemo, useState, type ElementType } from 'react';
import { useSwitch } from './hooks';
import { SwitchContext } from './hooks/useSwitchContext';
import type { SwitchInternalContextValue, SwitchRenderProps, SwitchRootProps } from './types';

export const SwitchRoot = <T extends ElementType = 'div'>({
  as,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  name,
  value = 'on',
  form,
  required = false,
  readOnly = false,
  id: providedId,
  children,
  ref,
  ...props
}: SwitchRootProps<T>) => {
  const Component = as || 'div';
  const generatedId = useId();
  const rootId = providedId ?? generatedId;
  const controlId = `${rootId}-control`;
  const [labelId, setLabelId] = useState<string>();
  const [hintId, setHintId] = useState<string>();

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
    disabled,
    readOnly,
  });

  const registerLabel = useCallback((id: string) => {
    setLabelId(id);
    return () => setLabelId((current) => (current === id ? undefined : current));
  }, []);

  const registerHint = useCallback((id: string) => {
    setHintId(id);
    return () => setHintId((current) => (current === id ? undefined : current));
  }, []);

  const contextValue = useMemo<SwitchInternalContextValue>(
    () => ({
      checked: checkedState,
      setChecked,
      disabled,
      readOnly,
      required,
      isFocused,
      isHovered,
      isPressed: isActive,
      controlId,
      labelId,
      hintId,
      registerLabel,
      registerHint,
      switchProps,
      hiddenInputProps,
      value,
      ...(name !== undefined && { name }),
      ...(form !== undefined && { form }),
    }),
    [
      checkedState,
      setChecked,
      disabled,
      readOnly,
      required,
      isFocused,
      isHovered,
      isActive,
      controlId,
      labelId,
      hintId,
      registerLabel,
      registerHint,
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
    disabled,
    readOnly,
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
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-required={required ? '' : undefined}
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
