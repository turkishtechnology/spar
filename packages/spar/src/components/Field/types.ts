import type { ElementType, ReactNode } from 'react';
import type { PolymorphicProps } from '../../types';
import type { LabelProps } from '../Label/types';

/**
 * Field context value shared with compound children.
 * Provides coordinated IDs and form state for ARIA relationships.
 */
export interface FieldContextValue {
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
 * Render props provided to Field children function.
 */
export interface FieldRenderProps {
  /** Whether the field is in an invalid/error state */
  invalid: boolean;
  /** Whether the field is disabled */
  disabled: boolean;
  /** Whether the field is required */
  required: boolean;
  /** Whether the field is read-only */
  readOnly: boolean;
}

/**
 * Own props for Field root.
 */
export interface FieldOwnProps {
  /**
   * Custom base ID for ARIA relationships.
   * If not provided, one will be generated automatically.
   * Sub-element IDs are derived as `${id}-field`, `${id}-label`, etc.
   */
  id?: string;

  /**
   * Whether the field is in an invalid/error state.
   * Drives conditional rendering of `FieldErrorMessage` and propagates
   * to nested form controls (e.g. Input) which apply `aria-invalid`
   * on the actual input element.
   * Intended to be set by external validation (e.g. Zod).
   * @defaultValue false
   */
  invalid?: boolean;

  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Whether the field is read-only.
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Field content, or a render function receiving field state.
   */
  children?: ReactNode | ((props: FieldRenderProps) => ReactNode);
}

/**
 * Props for Field root.
 * @remarks Generic form-field container providing shared ARIA context
 *          for any form control (Input, Switch, Checkbox, Select, etc.).
 */
export type FieldProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T, FieldOwnProps>;

/**
 * Props for FieldLabel.
 * @remarks Renders as `<label>` by default with automatic htmlFor linking.
 * When used inside a Field, `disabled`, `required`, `readOnly`, and
 * `invalid` are provided by Field context and cannot be overridden.
 */
export type FieldLabelProps<T extends ElementType = 'label'> = LabelProps<T>;

/**
 * Props for FieldDescription.
 * @remarks Helper/hint text linked via aria-describedby.
 */
export type FieldDescriptionProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;

/**
 * Props for FieldErrorMessage.
 * @remarks Only renders when the field is invalid. Uses role="alert".
 */
export type FieldErrorMessageProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T>;
