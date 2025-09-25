import { useState, useMemo, useId, type ChangeEvent, type FocusEvent } from 'react';
import type { TextareaProps } from './types';

/**
 * A headless, multi-line text input control that provides accessibility, keyboard navigation, and form integration capabilities.
 * Extends the native HTML textarea element with enhanced validation states, helper text, error handling, and comprehensive ARIA support.
 */
export const Textarea = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onInvalid,
  label,
  placeholder,
  helperText,
  errorMessage,
  validationErrors,
  validationBehavior = 'aria',
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  rows = 3,
  cols,
  maxLength,
  minLength,
  autoComplete,
  autoFocus = false,
  spellCheck,
  wrap = 'soft',
  inputMode,
  id: providedId,
  name,
  form,
  as: Component = 'textarea',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  className,
  style,
  ref,
  ...rest
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = providedId || generatedId;

  // Internal state management
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  // Controlled vs uncontrolled detection
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Error state determination
  const hasError = isInvalid || !!errorMessage || (validationErrors && validationErrors.length > 0);
  const allErrors = useMemo(() => {
    const errors: string[] = [];
    if (errorMessage) errors.push(errorMessage);
    if (validationErrors) errors.push(...validationErrors);
    return errors;
  }, [errorMessage, validationErrors]);

  // Character count for maxLength
  const characterCount = useMemo(
    () => (maxLength ? `${currentValue.length}/${maxLength}` : undefined),
    [currentValue, maxLength],
  );

  // Build aria-describedby (only use provided ariaDescribedBy)
  const describedByIds = ariaDescribedBy || undefined;

  // Event handlers
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    setIsFocusVisible(event.target.matches(':focus-visible'));
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setIsFocusVisible(false);
    onBlur?.(event);

    // Trigger validation on blur if there are errors to report
    if (allErrors.length > 0 && onInvalid) {
      onInvalid(allErrors);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Detect focus-visible state for keyboard navigation
    if (event.key === 'Tab') {
      setIsFocusVisible(true);
    }

    // Call the provided onKeyDown handler if it exists
    onKeyDown?.(event);
  };

  // Data attributes for styling
  const dataAttributes = {
    'data-glide-textarea': '',
    'data-focused': isFocused ? 'true' : 'false',
    'data-focus-visible': isFocusVisible ? 'true' : undefined,
    'data-disabled': isDisabled ? 'true' : undefined,
    'data-readonly': isReadOnly ? 'true' : undefined,
    'data-required': isRequired ? 'true' : undefined,
    'data-invalid': hasError ? 'true' : undefined,
    'data-empty': !currentValue ? 'true' : undefined,
    'data-rows': rows.toString(),
    'data-cols': cols?.toString(),
    'data-has-error': hasError ? 'true' : undefined,
    'data-has-helper': helperText ? 'true' : undefined,
    'data-character-count': characterCount,
    'data-validation-behavior': validationBehavior,
  };

  // Clean up undefined data attributes
  const cleanDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, value]) => value !== undefined),
  );

  return (
    <Component
      ref={ref}
      id={textareaId}
      name={name}
      form={form}
      value={currentValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      maxLength={maxLength}
      minLength={minLength}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      spellCheck={spellCheck}
      wrap={wrap}
      inputMode={inputMode}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      aria-label={ariaLabel || label}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedByIds}
      aria-invalid={hasError}
      aria-required={isRequired}
      aria-readonly={isReadOnly}
      className={className}
      style={style}
      {...cleanDataAttributes}
      {...rest}
    />
  );
};

Textarea.displayName = 'Textarea';
