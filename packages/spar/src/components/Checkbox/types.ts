import type { ElementType, ReactNode } from 'react';
import type { CheckedState, PolymorphicProps } from '../../types';

/**
 * Render props provided to children function for Checkbox
 */
export interface CheckboxRenderProps {
  /**
   * Current checked state
   */
  checked: CheckedState;
  /**
   * Function to programmatically set the checked state
   */
  setChecked: (checked: CheckedState) => void;
  /**
   * Whether the checkbox is disabled
   */
  disabled: boolean;
  /**
   * Whether the checkbox is read-only
   */
  readOnly: boolean;
  /**
   * Whether the checkbox is required
   */
  required: boolean;
  /**
   * Whether the checkbox is in an invalid/error state
   */
  isInvalid: boolean;
  /**
   * Whether the checkbox is currently focused
   */
  isFocused: boolean;
  /**
   * Whether the checkbox is currently hovered
   */
  isHovered: boolean;
  /**
   * Whether the checkbox is currently being pressed
   */
  isPressed: boolean;
}

/**
 * Own props for Checkbox component
 */
export interface CheckboxOwnProps {
  /**
   * Controlled checked state
   * @remarks When provided, component operates in controlled mode
   */
  checked?: CheckedState;

  /**
   * Default checked state for uncontrolled usage
   * @defaultValue false
   */
  defaultChecked?: CheckedState;

  /**
   * Callback fired when the checked state changes
   * @param checked - The new checked state
   */
  onChange?: (checked: CheckedState) => void;

  /**
   * Disabled state - prevents interaction and is properly announced to screen readers
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * Value sent in form data when checked
   * @defaultValue 'on'
   */
  value?: string;

  /**
   * ID of the form this checkbox belongs to
   */
  form?: string;

  /**
   * Required state for form validation
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Read-only state - prevents interaction
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Invalid/error state. When inside a `<Field>`, inherited automatically
   * unless explicitly overridden.
   * @defaultValue false
   */
  isInvalid?: boolean;

  /**
   * Auto-focus on mount
   * @defaultValue false
   */
  autoFocus?: boolean;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: CheckboxRenderProps) => ReactNode);
}

/**
 * Props for Checkbox component
 * @remarks Fully accessible, headless checkbox component providing dual-state and tri-state functionality
 */
export type CheckboxProps<T extends ElementType = 'span'> = PolymorphicProps<
  'span',
  T,
  CheckboxOwnProps
>;
