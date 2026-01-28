import type { ComponentProps, ElementType } from 'react';

/**
 * Input context state
 */
export interface InputContextValue {
  fieldId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  isInvalid: boolean;
  disabled: boolean;
  required: boolean;
  readOnly?: boolean;
}

/**
 * Props for Input.Root
 * @remarks Provides state context for compound input elements
 */
export interface InputRootProps extends ComponentProps<'div'> {
  /**
   * Input validation state
   * @defaultValue false
   */
  isInvalid?: boolean;

  /**
   * Input disabled state
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Input required state
   * @defaultValue false
   */
  required?: boolean;
}

/**
 * Base props for Input.Field
 * @remarks Core input element with polymorphic element support
 */
export interface InputFieldProps<T extends ElementType = 'input'> {
  /**
   * Element type for polymorphic rendering
   * @defaultValue "input"
   */
  as?: T;

  /**
   * Ref for the input element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];

  /**
   * Whether to focus the input on mount
   * @defaultValue false
   */
  autoFocus?: boolean;
}

/**
 * Complete props for Input.Field with polymorphic support
 */
export type PolymorphicInputFieldProps<T extends ElementType = 'input'> = InputFieldProps<T> &
  Omit<React.ComponentPropsWithRef<T>, keyof InputFieldProps<T>>;

/**
 * Props for Input.Label
 * @remarks Associated label element with automatic ID linking
 */
export interface InputLabelProps extends ComponentProps<'label'> {}

/**
 * Props for Input.Description
 * @remarks Helper text element for additional input guidance
 */
export interface InputDescriptionProps extends ComponentProps<'div'> {}

/**
 * Props for Input.ErrorMessage
 * @remarks Error announcement element with automatic ARIA handling
 */
export interface InputErrorMessageProps extends ComponentProps<'div'> {}
