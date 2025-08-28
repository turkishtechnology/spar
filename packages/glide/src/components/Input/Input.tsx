import { forwardRef, useId } from 'react';
import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperTextId = `${inputId}-helper`;

    // Build aria-describedby attribute
    const describedByIds = [];
    if (error) {
      describedByIds.push(errorId);
    } else if (helperText) {
      describedByIds.push(helperTextId);
    }

    // Add any existing aria-describedby
    if (props['aria-describedby']) {
      describedByIds.push(props['aria-describedby']);
    }

    const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

    return (
      <div>
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        {error && (
          <div id={errorId} role='alert'>
            {error}
          </div>
        )}
        {helperText && !error && <div id={helperTextId}>{helperText}</div>}
      </div>
    );
  },
);

Input.displayName = 'Input';
