import { useId, useRef } from 'react';
import { useMergedRef } from '@/hooks';
import { Button } from '../Button';
import { useSwitch } from './hooks';
import type { SwitchProps, SwitchRenderProps } from './types';

/**
 * Headless switch component for boolean toggle controls. Provides accessible switch semantics with form integration.
 */
export const Switch = ({
  as = 'button',
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  name,
  value = 'on',
  form,
  required = false,
  readOnly = false,
  autoFocus = false,
  id: providedId,
  children,
  ref,
  ...restProps
}: SwitchProps) => {
  const internalId = useId();
  const id = providedId || internalId;

  // Refs
  const internalRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(internalRef, ref as React.Ref<HTMLButtonElement>);

  // Use the switch hook
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

  // Render props for children function
  const renderProps: SwitchRenderProps = {
    checked: checkedState,
    setChecked,
    disabled,
    readOnly,
    isFocused,
    isHovered,
    isPressed: isActive,
  };

  // Extract known props to prevent conflicts
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    className,
    style,
    ...safeProps
  } = restProps;

  // Extract event handlers from switchProps
  // Note: We don't pass onKeyDown because Button already handles Space/Enter
  // and calls onClick, which triggers handleToggle
  const {
    onClick,
    onFocus,
    onBlur,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  } = switchProps;

  return (
    <>
      <Button
        as={as}
        ref={mergedRef}
        id={id}
        disabled={disabled}
        autoFocus={autoFocus}
        role='switch'
        aria-checked={checkedState}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={required || undefined}
        aria-readonly={readOnly || undefined}
        data-switch=''
        data-state={checkedState ? 'checked' : 'unchecked'}
        data-checked={checkedState ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-required={required ? '' : undefined}
        data-focus={isFocused ? '' : undefined}
        data-hover={isHovered ? '' : undefined}
        data-active={isActive ? '' : undefined}
        className={className}
        style={style}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        {...safeProps}
      >
        {typeof children === 'function' ? children(renderProps) : children}
      </Button>
      {name && (
        <input {...hiddenInputProps} name={name} value={value} form={form} required={required} />
      )}
    </>
  );
};

Switch.displayName = 'Switch';
