import type { ElementType, ReactNode } from 'react';
import type { CheckedState } from '../../types';

/**
 * Render props provided to children function
 */
export interface CheckboxRenderProps {
  /**
   * Current checked state
   */
  checked: CheckedState;
  /**
   * Whether the checkbox is disabled
   */
  disabled: boolean;
  /**
   * Whether the checkbox is focused
   */
  isFocused: boolean;
  /**
   * Whether the checkbox is hovered
   */
  isHovered: boolean;
  /**
   * Whether the checkbox is being pressed
   */
  isPressed: boolean;
}

/**
 * Props for Checkbox component
 * @remarks Fully accessible, headless checkbox component
 */
export interface CheckboxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'defaultChecked' | 'children' | 'onChange'> {
  /**
   * The element or component to render as
   * @defaultValue 'span'
   */
  as?: ElementType;

  /**
   * Ref to the underlying DOM element
   */
  ref?: React.Ref<HTMLElement>;

  /**
   * Controlled checked state. When provided, component becomes controlled
   */
  checked?: CheckedState;

  /**
   * Default checked state for uncontrolled usage
   * @defaultValue false
   */
  defaultChecked?: CheckedState;

  /**
   * Callback fired when checked state changes
   */
  onCheckedChange?: (checked: CheckedState) => void;

  /**
   * Whether the checkbox is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is read-only
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Whether the checkbox is required in forms
   * @defaultValue false
   */
  required?: boolean;

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
   * Whether to focus the checkbox on mount
   * @defaultValue false
   */
  shouldAutoFocus?: boolean;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: CheckboxRenderProps) => ReactNode);
}
