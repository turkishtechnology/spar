import type { ElementType, ButtonHTMLAttributes } from 'react';

/**
 * Props for Switch component
 * @remarks Fully accessible, headless switch component providing binary toggle functionality
 */
export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'checked' | 'defaultChecked'> {
  /**
   * The element or component to render as
   * @defaultValue 'button'
   */
  as?: ElementType;

  /**
   * Controlled checked state
   * @remarks When provided, component operates in controlled mode
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled usage
   * @defaultValue false
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the checked state changes
   * @param checked - The new checked state
   */
  onChange?: (checked: boolean) => void;

  /**
   * Disabled state - properly announced to screen readers
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Form input name for form integration
   */
  name?: string;

  /**
   * Form input value when checked
   * @defaultValue 'on'
   */
  value?: string;

  /**
   * Form ID to associate with
   */
  form?: string;

  /**
   * Required state for form validation
   * @defaultValue false
   */
  isRequired?: boolean;

  /**
   * Read-only state - prevents interaction
   * @defaultValue false
   */
  isReadOnly?: boolean;

  /**
   * Auto-focus on mount
   * @defaultValue false
   */
  shouldAutoFocus?: boolean;

  /**
   * Accessible name for the switch
   * @remarks Required when switch has no visible label
   */
  'aria-label'?: string;

  /**
   * ID of element that labels the switch
   */
  'aria-labelledby'?: string;

  /**
   * ID of element that describes the switch
   */
  'aria-describedby'?: string;
}

/**
 * Props for useSwitch hook
 */
export interface UseSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

/**
 * Return type for useSwitch hook
 */
export interface UseSwitchReturn {
  checked: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  switchProps: {
    role: 'switch';
    'aria-checked': boolean;
    'aria-disabled'?: boolean;
    'aria-readonly'?: boolean;
    'data-switch': '';
    'data-state': 'checked' | 'unchecked';
    'data-checked'?: '';
    'data-disabled'?: '';
    'data-readonly'?: '';
    tabIndex: number;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onClick: (event: React.MouseEvent) => void;
    onFocus: (event: React.FocusEvent) => void;
    onBlur: (event: React.FocusEvent) => void;
    onMouseEnter: (event: React.MouseEvent) => void;
    onMouseLeave: (event: React.MouseEvent) => void;
    onMouseDown: (event: React.MouseEvent) => void;
    onMouseUp: (event: React.MouseEvent) => void;
  };
  hiddenInputProps: {
    type: 'checkbox';
    checked: boolean;
    onChange: () => void;
    tabIndex: -1;
    'aria-hidden': true;
    style: React.CSSProperties;
  };
}
