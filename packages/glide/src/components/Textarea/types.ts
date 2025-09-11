import type { ChangeEvent, FocusEvent } from 'react';

export type ValidationBehavior = 'native' | 'aria';
export type ResizeBehavior = 'none' | 'both' | 'horizontal' | 'vertical';
export type WrapMode = 'soft' | 'hard' | 'off';

/**
 * Props for Textarea component
 * @remarks Fully accessible, headless multi-line text input component
 */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInvalid'> {
  /**
   * Controlled value of the textarea
   */
  value?: string;

  /**
   * Uncontrolled default value
   */
  defaultValue?: string;

  /**
   * Value change handler
   */
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;

  /**
   * Validation error handler
   */
  onInvalid?: (errors: string[]) => void;

  /**
   * Accessible label text
   */
  label?: string;

  /**
   * Helper text below textarea
   */
  helperText?: string;

  /**
   * Error message (sets invalid state)
   */
  errorMessage?: string;

  /**
   * Multiple validation error messages
   */
  validationErrors?: string[];

  /**
   * Validation behavior mode
   * @defaultValue 'aria'
   */
  validationBehavior?: ValidationBehavior;

  /**
   * Required field indicator
   * @defaultValue false
   */
  isRequired?: boolean;

  /**
   * Disabled state
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Read-only state
   * @defaultValue false
   */
  isReadOnly?: boolean;

  /**
   * Invalid state (controlled)
   * @defaultValue false
   */
  isInvalid?: boolean;

  /**
   * Visible rows of text
   * @defaultValue 3
   */
  rows?: number;

  /**
   * Visible columns (character width)
   */
  cols?: number;

  /**
   * Maximum character limit
   */
  maxLength?: number;

  /**
   * Minimum character limit
   */
  minLength?: number;

  /**
   * Resize behavior
   * @defaultValue 'vertical'
   */
  resize?: ResizeBehavior;

  /**
   * Text wrapping mode
   * @defaultValue 'soft'
   */
  wrap?: WrapMode;

  /**
   * Input mode for mobile keyboards
   */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

  /**
   * Polymorphic component type
   * @defaultValue 'textarea'
   */
  as?: React.ElementType;

  /**
   * Forward ref to textarea element
   */
  ref?: React.Ref<HTMLTextAreaElement>;
}
