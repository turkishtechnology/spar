import type { ElementType, ReactNode } from 'react';

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
}

/**
 * Props for Input.Root
 * @remarks Provides state context for compound input elements
 */
export interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
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

  /**
   * Compound input elements
   */
  children: ReactNode;
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
export interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Label content
   */
  children: ReactNode;

  /**
   * Ref for the label element
   */
  ref?: React.Ref<HTMLLabelElement>;
}

/**
 * Props for Input.Description
 * @remarks Helper text element for additional input guidance
 */
export interface InputDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Description content
   */
  children: ReactNode;

  /**
   * Ref for the description element
   */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props for Input.ErrorMessage
 * @remarks Error announcement element with automatic ARIA handling
 */
export interface InputErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Error content
   */
  children: ReactNode;

  /**
   * Ref for the error element
   */
  ref?: React.Ref<HTMLDivElement>;
}
