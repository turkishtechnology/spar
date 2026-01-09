import type {
  ElementType,
  ButtonHTMLAttributes,
  AriaAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  FocusEvent,
  CSSProperties,
} from 'react';

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
  disabled?: boolean;

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
  required?: boolean;

  /**
   * Read-only state - prevents interaction
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Auto-focus on mount
   * @defaultValue false
   */
  shouldAutoFocus?: boolean;

  /**
   * Accessible name for the switch
   * @remarks Required when switch has no visible label
   */
  'aria-label'?: AriaAttributes['aria-label'];

  /**
   * ID of element that labels the switch
   */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];

  /**
   * ID of element that describes the switch
   */
  'aria-describedby'?: AriaAttributes['aria-describedby'];
}

/**
 * Props for useSwitch hook
 */
export interface UseSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Return type for useSwitch hook
 */
export interface UseSwitchReturn {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
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
    'data-focus'?: '';
    'data-hover'?: '';
    'data-active'?: '';
    tabIndex: number;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: (event: MouseEvent) => void;
    onFocus: (event: FocusEvent) => void;
    onBlur: (event: FocusEvent) => void;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
    onPointerDown: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: (event: PointerEvent) => void;
  };
  hiddenInputProps: {
    type: 'checkbox';
    checked: boolean;
    onChange: () => void;
    tabIndex: -1;
    'aria-hidden': true;
    style: CSSProperties;
  };
}
