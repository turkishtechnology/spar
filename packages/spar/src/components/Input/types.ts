import type { ElementType } from 'react';
import type { PolymorphicProps } from '../../types';

/**
 * Input context state
 * @internal
 */
export interface InputContextValue {
  fieldId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  isInvalid: boolean;
  disabled: boolean;
  required: boolean;
  readOnly: boolean;
}

/**
 * Own props for Input.
 *
 * When used inside a `<Field>`, the Input reads the Field's context values
 * (`invalid`, `disabled`, `required`, `readOnly`) automatically as defaults.
 * Props set directly on `<Input>` override the inherited values.
 */
export interface InputOwnProps {
  /**
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-field`, `${id}-label`, etc.
   */
  id?: string;

  /**
   * Input validation state. When inside a Field, inherited from Field.
   */
  isInvalid?: boolean;

  /**
   * Input disabled state. When inside a Field, inherited from Field.
   */
  disabled?: boolean;

  /**
   * Input required state. When inside a Field, inherited from Field.
   */
  required?: boolean;

  /**
   * Input read-only state. When inside a Field, inherited from Field.
   */
  readOnly?: boolean;
}

/**
 * Props for Input
 * @remarks Provides state context for compound input elements
 */
export type InputProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T, InputOwnProps>;

/**
 * Own props for InputField
 * @remarks Core input element with polymorphic element support
 */
export interface InputFieldOwnProps {
  /**
   * Whether to focus the input on mount
   * @defaultValue false
   */
  autoFocus?: boolean;
}

/**
 * Props for InputField
 * @remarks Core input element with polymorphic element support
 */
export type InputFieldProps<T extends ElementType = 'input'> = PolymorphicProps<
  'input',
  T,
  InputFieldOwnProps
>;
