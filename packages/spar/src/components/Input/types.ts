import type { ElementType } from 'react';
import type { Mask, MaskChangeMeta, PolymorphicProps } from '../../types';

/**
 * Input context state
 * @internal
 */
export interface InputContextValue {
  fieldId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
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
  invalid?: boolean;

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

  /**
   * Input mask — a shape/date/time/number/regex pattern, or a resolver
   * function.
   *
   * @remarks
   * Omitting it leaves the field exactly as it was: no masking, no forced
   * reconciliation of `value`, and `onValueChange` is never called.
   *
   * Setting it makes the field's displayed value the masked projection of what
   * was typed, and makes `onValueChange` the channel that reports every change.
   */
  mask?: Mask;

  /**
   * Fires with the **masked** value plus `raw` / `completed` / `iso` metadata.
   *
   * @remarks
   * Only called while `mask` is set. It fires for every change the mask
   * produces, including the ones the field applies itself — a delimiter-aware
   * delete, an undo — which produce no DOM change event and therefore never
   * reach `onChange`. Prefer this over `onChange` on a masked field.
   */
  onValueChange?: (value: string, meta: MaskChangeMeta) => void;
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
