import type { ElementType } from 'react';
import type { PolymorphicProps } from '../../types';
import type { LabelProps } from '../Label/types';

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
  readOnly?: boolean;
}

/**
 * Own props for Input
 */
export interface InputOwnProps {
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

/**
 * Props for InputLabel
 * @remarks Associated label element with automatic ID linking
 */
export type InputLabelProps<T extends ElementType = 'label'> = LabelProps<T>;

/**
 * Props for InputDescription
 * @remarks Helper text element for additional input guidance
 */
export type InputDescriptionProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Props for InputErrorMessage
 * @remarks Error announcement element with automatic ARIA handling
 */
export type InputErrorMessageProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;
